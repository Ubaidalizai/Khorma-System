const User = require('../models/user.model');
const asyncHandler = require('../middlewares/asyncHandler.js');

const {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  verifyRefreshToken,
} = require('../utils/tokens');
const Email = require('../utils/email.js');
const { deleteOldImage } = require('../middlewares/uploadFile.js');

const crypto = require('crypto');
const {
  userValidationSchema,
  loginValidationSchema,
  updateUserValidationSchema,
  updateProfileValidationSchema,
} = require('../validations');

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message,
    });
  }

  const { name, email, phone, password, role, isActive } = req.body;

  // Check if the user with the provided email already exists
  const userExists = await User.findOne({ email });

  // If user exists, return a 409 conflict status
  if (userExists) {
    return res.status(409).send({
      success: false,
      message: 'A user with this email address already exists',
    });
  }

  // Create a new user
  const newUser = new User({
    name,
    email,
    phone,
    password,
    role,
    image: req.file ? req.file.filename : 'default-user.jpg', // Default image if no file is uploaded
  });

  try {
    // Save the new user to the database
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'New User Added Successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        image: newUser.image,
        isActive: newUser.isActive,
      },
    });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send({
      success: false,
      message: 'Error saving user, please try again later',
    });
  }
});

// Update user photo
const updateUserPhoto = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Delete old image if it exists and is not the default
  const currentUser = await User.findById(id);
  if (currentUser.image && currentUser.image !== 'default-user.jpg') {
    deleteOldImage(currentUser.image, 'users');
  }

  const user = await User.findByIdAndUpdate(
    id,
    {
      image: req.file.filename,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.status(200).json({
    success: true,
    message: 'User photo updated successfully',
    data: user,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.isPasswordValid(password, user.password))) {
    // Generate access and refresh tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setAuthCookies(res, accessToken, refreshToken);
    // Prepare user data without sensitive information
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    };

    res.json({
      success: true,
      user: userData,
      accessToken,
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email or password is incorrect!',
    });
  }
});

const logout = (req, res) => {
  clearAuthCookies(res);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// Refresh access token using refresh token cookie
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies && req.cookies.refresh_token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Missing refresh token' });
  }

  try {
    const decoded = verifyRefreshToken(token);
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return res
        .status(401)
        .json({ success: false, message: 'User no longer exists' });
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res
        .status(401)
        .json({ success: false, message: 'User recently changed password' });
    }

    const newAccessToken = generateAccessToken(currentUser._id);
    // update access cookie only
    setAuthCookies(res, newAccessToken, token);
    return res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is set by the authentication middleware
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      image: user.image,
    },
  });
});

// Update User By Id (only admin can)
const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the request body
  const { error } = updateUserValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message, // Return the first validation error message
    });
  }

  const { name, email, phone, role, isActive } = req.body;

  const user = await User.findById(id);

  if (user) {
    // Check if email is being updated and if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).send({
          success: false,
          message: 'A user with this email address already exists',
        });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.role = role || user.role;
    if (isActive !== undefined) user.isActive = isActive;

    // Update image if a new file was uploaded
    if (req.file) {
      user.image = req.file.filename;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        image: updatedUser.image,
        isActive: updatedUser.isActive,
      },
    });
  } else {
    return res.status(404).json({
      success: false,
      message: 'User not found!',
    });
  }
});

// Update current user profile
const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  // Validate the request body
  const { error } = updateProfileValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message, // Return the first validation error message
    });
  }

  const { name, email, phone } = req.body;

  const user = await User.findById(_id);

  if (user) {
    // Check if email is being updated and if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).send({
          success: false,
          message: 'A user with this email address already exists',
        });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    // Update image if a new file was uploaded
    if (req.file) {
      // Delete old image if it exists and is not the default
      if (user.image && user.image !== 'default-user.jpg') {
        deleteOldImage(user.image, 'users');
      }
      user.image = req.file.filename;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      image: updatedUser.image,
      isActive: updatedUser.isActive,
    });
  } else {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
});

// Get all users (with optional search by name)
const getAllUsers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let filter = {};
  if (search) {
    filter = {
      name: { $regex: search, $options: 'i' },
    };
  }
  const users = await User.find(filter);
  res.status(200).json({
    success: true,
    data: { results: users },
    count: users.length,
  });
});

const findUserByID = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById({ _id: id }).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }
});

const deleteUserByID = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById({ _id: id });
  if (user) {
    if (user.isAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user as admin!',
      });
    }

    if (user.image && user.image !== 'default-user.jpg') {
      deleteOldImage(user.image, 'users');
    }

    await User.deleteOne({ _id: user._id });
    res.status(204).json({ message: 'User removed successfully' });
  } else {
    return res.status(404).json({
      success: false,
      message: 'User not found!',
    });
  }
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).send({
      success: false,
      message: 'Current and new password are required',
    });
  }

  // 1) Get user from the database
  const user = await User.findById(_id);

  if (!user) {
    return res.status(404).send({
      success: false,
      message: 'User not found',
    });
  }

  // 2) Validate current password
  const isMatch = await user.isPasswordValid(currentPassword); // Compare with hashed password
  if (!isMatch) {
    return res.status(401).send({
      success: false,
      message: 'Your current password is incorrect',
    });
  }

  // 3) Update to new password
  user.password = newPassword; // This should trigger hashing in Mongoose middleware
  await user.save();

  // 4) Respond with success message
  res.status(200).json({
    status: 'success',
    message: 'Your password was updated successfully',
  });
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on POSTed email

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({
      success: false,
      message: 'There is no user with this email address.',
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    // Use frontend URL for the reset link
    const resetURL = `http://localhost:5173/resetPassword/${resetToken}`;

    // Send the reset URL to the user
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email go to email and click of sending link!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.error(err);
    return res.status(500).send({
      success: false,
      message: 'There was an error sending the email. Try again later!',
    });
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If the token has not expired and then is the user, set the new password
  if (!user) {
    return res.status(400).send({
      success: false,
      message: 'Token is invalid or has expired!',
    });
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Issue new tokens after password reset
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  setAuthCookies(res, accessToken, refreshToken);
  res.status(200).json({
    status: 'success',
    message: 'Your password was reset successfully',
    accessToken,
  });
});

module.exports = {
  registerUser,
  loginUser,
  updateCurrentUserProfile,
  getAllUsers,
  findUserByID,
  updateUserById,
  deleteUserByID,
  updateUserPhoto,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout,
  getUserProfile,
  refreshAccessToken,
};
