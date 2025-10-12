# Frontend Design Documentation
## Trading & Distribution Management System

<div dir="rtl" align="right">

# مستندات طراحی فرانت‌اند
## سیستم مدیریت تجارت و توزیع

</div>

---

## 1. Design Philosophy & Concept

### 1.1 Brand Identity
**Theme:** "Golden Harvest" - Inspired by dates, chickpeas, and traditional Middle Eastern trading
**Style:** Modern, clean, professional with warm, earthy tones
**Target Users:** Business owners, traders, warehouse managers

### 1.2 Design Principles
- **Simplicity:** Clean, uncluttered interface
- **Accessibility:** High contrast, readable fonts, intuitive navigation
- **Responsiveness:** Works on desktop, tablet, and mobile
- **Cultural Sensitivity:** RTL support, appropriate color choices
- **Professional:** Business-focused, trustworthy appearance

---

## 2. Color Palette

### 2.1 Primary Colors (Date-Inspired)

#### **Golden Date Brown** - Primary Brand Color
```css
--primary-brown: #8B4513;        /* Saddle Brown - Rich date color */
--primary-brown-light: #A0522D;  /* Sienna - Lighter date tone */
--primary-brown-dark: #654321;   /* Dark Brown - Deep date color */
```

#### **Warm Amber** - Secondary Color
```css
--amber: #DAA520;                /* Goldenrod - Honey/amber tone */
--amber-light: #F4A460;          /* Sandy Brown - Light amber */
--amber-dark: #B8860B;           /* Dark Goldenrod - Deep amber */
```

#### **Chickpea Beige** - Neutral Base
```css
--beige: #F5DEB3;                /* Wheat - Chickpea color */
--beige-light: #FFF8DC;          /* Cornsilk - Very light beige */
--beige-dark: #DEB887;           /* Burlywood - Darker beige */
```

### 2.2 Accent Colors

#### **Success Green** - Positive Actions
```css
--success-green: #228B22;        /* Forest Green - Growth/profit */
--success-light: #90EE90;        /* Light Green - Success feedback */
```

#### **Warning Orange** - Alerts
```css
--warning-orange: #FF8C00;       /* Dark Orange - Low stock alerts */
--warning-light: #FFE4B5;        /* Moccasin - Warning background */
```

#### **Error Red** - Critical Actions
```css
--error-red: #DC143C;            /* Crimson - Errors/critical */
--error-light: #FFB6C1;          /* Light Pink - Error background */
```

#### **Info Blue** - Information
```css
--info-blue: #4682B4;            /* Steel Blue - Information */
--info-light: #B0E0E6;           /* Powder Blue - Info background */
```

### 2.3 Neutral Colors

#### **Grayscale Palette**
```css
--text-dark: #2F2F2F;            /* Dark text */
--text-medium: #666666;          /* Medium text */
--text-light: #999999;           /* Light text */
--background: #FAFAFA;           /* Main background */
--surface: #FFFFFF;              /* Card/surface background */
--border: #E0E0E0;               /* Border color */
--shadow: rgba(0, 0, 0, 0.1);    /* Shadow color */
```

---

## 3. Typography

### 3.1 Font Families

#### **Primary Font - Inter (Modern, Clean)**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### **Secondary Font - Poppins (Friendly, Approachable)**
```css
font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### **RTL Font - Tajawal (Arabic/Dari Support)**
```css
font-family: 'Tajawal', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 3.2 Font Sizes & Hierarchy

```css
/* Headings */
--h1-size: 2.5rem;    /* 40px - Page titles */
--h2-size: 2rem;      /* 32px - Section titles */
--h3-size: 1.5rem;    /* 24px - Subsection titles */
--h4-size: 1.25rem;   /* 20px - Card titles */
--h5-size: 1.125rem;  /* 18px - Small headings */
--h6-size: 1rem;      /* 16px - Labels */

/* Body Text */
--body-large: 1.125rem;  /* 18px - Important text */
--body-regular: 1rem;    /* 16px - Regular text */
--body-small: 0.875rem;  /* 14px - Secondary text */
--body-tiny: 0.75rem;    /* 12px - Captions */

/* Line Heights */
--line-height-tight: 1.2;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

---

## 4. Layout & Grid System

### 4.1 Container Sizes
```css
--container-sm: 640px;   /* Small screens */
--container-md: 768px;   /* Medium screens */
--container-lg: 1024px;  /* Large screens */
--container-xl: 1280px;  /* Extra large screens */
--container-2xl: 1536px; /* Ultra large screens */
```

### 4.2 Spacing System
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### 4.3 Grid System
- **12-column grid** for flexible layouts
- **Responsive breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Gutters**: 1rem (16px) on mobile, 1.5rem (24px) on desktop

---

## 5. Component Design System

### 5.1 Buttons

#### **Primary Button**
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-brown), var(--primary-brown-light));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px var(--shadow);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px var(--shadow);
}
```

#### **Secondary Button**
```css
.btn-secondary {
  background: var(--surface);
  color: var(--primary-brown);
  border: 2px solid var(--primary-brown);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s ease;
}
```

#### **Success Button**
```css
.btn-success {
  background: var(--success-green);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
}
```

### 5.2 Cards

#### **Main Card**
```css
.card {
  background: var(--surface);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px var(--shadow);
  border: 1px solid var(--border);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 16px var(--shadow);
  transform: translateY(-2px);
}
```

#### **Stat Card**
```css
.stat-card {
  background: linear-gradient(135deg, var(--beige-light), var(--surface));
  border-left: 4px solid var(--primary-brown);
  padding: 1.5rem;
  border-radius: 0.5rem;
}
```

### 5.3 Forms

#### **Input Fields**
```css
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 0.5rem;
  font-size: var(--body-regular);
  transition: all 0.2s ease;
  background: var(--surface);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-brown);
  box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
}
```

#### **Select Dropdown**
```css
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--border);
  border-radius: 0.5rem;
  background: var(--surface);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}
```

### 5.4 Tables

#### **Data Table**
```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--surface);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px var(--shadow);
}

.data-table th {
  background: var(--primary-brown);
  color: white;
  padding: 1rem;
  text-align: right;
  font-weight: 600;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  text-align: right;
}

.data-table tr:hover {
  background: var(--beige-light);
}
```

### 5.5 Navigation

#### **Sidebar Navigation**
```css
.sidebar {
  background: linear-gradient(180deg, var(--primary-brown-dark), var(--primary-brown));
  color: white;
  width: 250px;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  padding: 2rem 0;
  box-shadow: -2px 0 8px var(--shadow);
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  color: white;
  text-decoration: none;
  transition: all 0.2s ease;
  border-right: 3px solid transparent;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(255, 255, 255, 0.1);
  border-right-color: var(--amber);
}
```

#### **Top Navigation Bar**
```css
.top-nav {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px var(--shadow);
}

.nav-brand {
  font-size: var(--h4-size);
  font-weight: 700;
  color: var(--primary-brown);
}
```

---

## 6. Dashboard Layout

### 6.1 Main Dashboard Structure
```
┌─────────────────────────────────────────────────────────┐
│                    Top Navigation                       │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│   Sidebar   │              Main Content                 │
│             │                                           │
│             │        ┌─────────┬─────────┬─────────┐    │
│             │        │  Stat   │  Stat   │  Stat   │    │
│             │        │  Card   │  Card   │  Card   │    │
│             │        └─────────┴─────────┴─────────┘    │
│             │                                           │
│             │        ┌─────────────────────────────┐    │
│             │        │      Recent Transactions    │    │
│             │        │                             │    │
│             │        └─────────────────────────────┘    │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

### 6.2 Responsive Breakpoints
- **Mobile (< 768px)**: Collapsible sidebar, stacked layout
- **Tablet (768px - 1024px)**: Sidebar overlay, 2-column grid
- **Desktop (> 1024px)**: Fixed sidebar, 3-column grid

---

## 7. Icons & Visual Elements

### 7.1 Icon Library
- **Primary**: Heroicons (outline and solid variants)
- **Secondary**: Lucide Icons
- **Custom**: Date and trading-themed icons

### 7.2 Icon Usage
```css
.icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-medium);
}

.icon-large {
  width: 2rem;
  height: 2rem;
}

.icon-primary {
  color: var(--primary-brown);
}
```

### 7.3 Custom Icons Needed
- 📅 Date product icon
- 🥜 Chickpea product icon
- 🍰 Cake product icon
- 📦 Warehouse icon
- 🏪 Store icon
- 💰 Money/Finance icon
- 📊 Chart/Analytics icon

---

## 8. Animations & Transitions

### 8.1 Micro-interactions
```css
/* Hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--shadow);
}

/* Loading states */
.loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Slide animations */
.slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

### 8.2 Page Transitions
- **Fade in/out**: 0.3s ease-in-out
- **Slide transitions**: 0.4s cubic-bezier(0.4, 0, 0.2, 1)
- **Scale effects**: 0.2s ease-out

---

## 9. RTL (Right-to-Left) Support

### 9.1 RTL Layout Adjustments
```css
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .sidebar {
  right: 0;
  left: auto;
}

[dir="rtl"] .nav-item {
  border-right: none;
  border-left: 3px solid transparent;
}

[dir="rtl"] .nav-item:hover,
[dir="rtl"] .nav-item.active {
  border-left-color: var(--amber);
}
```

### 9.2 RTL Typography
```css
[dir="rtl"] {
  font-family: 'Tajawal', 'Inter', sans-serif;
}

[dir="rtl"] .data-table th,
[dir="rtl"] .data-table td {
  text-align: right;
}
```

---

## 10. Accessibility Features

### 10.1 Color Contrast
- **AA Compliance**: All text meets WCAG 2.1 AA standards
- **High Contrast Mode**: Alternative color scheme for accessibility
- **Focus Indicators**: Clear focus states for keyboard navigation

### 10.2 Keyboard Navigation
- **Tab Order**: Logical tab sequence
- **Skip Links**: Quick navigation to main content
- **Keyboard Shortcuts**: Common actions accessible via keyboard

### 10.3 Screen Reader Support
- **ARIA Labels**: Proper labeling for screen readers
- **Semantic HTML**: Correct heading hierarchy and landmarks
- **Alt Text**: Descriptive alternative text for images

---

## 11. Performance Considerations

### 11.1 Loading States
```css
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 11.2 Image Optimization
- **WebP format** for modern browsers
- **Lazy loading** for images below the fold
- **Responsive images** with multiple sizes

---

## 12. Browser Support

### 12.1 Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### 12.2 Progressive Enhancement
- **Core functionality** works without JavaScript
- **Enhanced features** with modern browser support
- **Graceful degradation** for older browsers

---

## 13. Design Tokens

### 13.1 CSS Custom Properties
```css
:root {
  /* Colors */
  --primary-brown: #8B4513;
  --amber: #DAA520;
  --beige: #F5DEB3;
  
  /* Spacing */
  --space-4: 1rem;
  --space-8: 2rem;
  
  /* Typography */
  --font-size-lg: 1.125rem;
  --line-height-normal: 1.5;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}
```

---

## 14. Component Examples

### 14.1 Dashboard Stats Card
```html
<div class="stat-card">
  <div class="stat-icon">
    <svg class="icon icon-large icon-primary">...</svg>
  </div>
  <div class="stat-content">
    <h3 class="stat-value">1,234</h3>
    <p class="stat-label">Total Sales</p>
    <span class="stat-change positive">+12.5%</span>
  </div>
</div>
```

### 14.2 Product Card
```html
<div class="product-card">
  <div class="product-image">
    <img src="date-product.jpg" alt="Fresh Dates">
  </div>
  <div class="product-info">
    <h4 class="product-name">Fresh Dates</h4>
    <p class="product-category">Fruits</p>
    <div class="product-price">
      <span class="current-price">$15.99</span>
      <span class="old-price">$19.99</span>
    </div>
    <div class="product-stock">
      <span class="stock-indicator in-stock">In Stock</span>
      <span class="stock-quantity">45 units</span>
    </div>
  </div>
</div>
```

---

## 15. Implementation Guidelines

### 15.1 CSS Architecture
- **BEM Methodology** for class naming
- **Mobile-first** responsive design
- **Component-based** CSS organization
- **CSS Custom Properties** for theming

### 15.2 File Structure
```
styles/
├── base/
│   ├── reset.css
│   ├── typography.css
│   └── colors.css
├── components/
│   ├── buttons.css
│   ├── cards.css
│   ├── forms.css
│   └── navigation.css
├── layout/
│   ├── grid.css
│   ├── sidebar.css
│   └── header.css
├── pages/
│   ├── dashboard.css
│   ├── inventory.css
│   └── reports.css
└── utilities/
    ├── spacing.css
    ├── display.css
    └── rtl.css
```

---

*This design system provides a comprehensive foundation for building a modern, accessible, and culturally appropriate trading and distribution management system with a warm, date-inspired color palette and professional business aesthetics.*

