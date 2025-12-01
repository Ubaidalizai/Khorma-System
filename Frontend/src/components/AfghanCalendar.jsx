import { useEffect, useMemo, useState } from "react";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import persianCalendar from "react-date-object/calendars/persian";
import persianLocale from "react-date-object/locales/persian_fa";
import gregorianCalendar from "react-date-object/calendars/gregorian";
import { toEnglishDigits } from "../utilies/helper";

// Custom Dari month names for Afghanistan
const DARI_MONTHS = [
  ["حمل", "ح"],
  ["ثور", "ث"],
  ["جوزا", "جو"],
  ["سرطان", "سر"],
  ["اسد", "اس"],
  ["سنبله", "سن"],
  ["میزان", "می"],
  ["عقرب", "عق"],
  ["قوس", "قو"],
  ["جدی", "جد"],
  ["دلو", "دل"],
  ["حوت", "حو"],
];

const DARI_WEEK_DAYS = [
  ["شنبه", "شن"],
  ["یکشنبه", "یک"],
  ["دوشنبه", "دو"],
  ["سه‌شنبه", "سه"],
  ["چهارشنبه", "چه"],
  ["پنجشنبه", "پن"],
  ["جمعه", "جم"],
];

const DARI_LOCALE = {
  ...persianLocale,
  name: "dari_fa",
  months: DARI_MONTHS,
  weekDays: DARI_WEEK_DAYS,
};

const DATE_INPUT_CLASS =
  "w-full bg-white border rounded-sm px-3 py-2 text-sm focus:outline-none  focus:border-amber-500 transition-colors";

const toPersianDateObject = (isoString) => {
  if (!isoString) return null;
  try {
    const gregorianDate = new DateObject({
      date: isoString,
      format: "YYYY-MM-DD",
      calendar: gregorianCalendar,
    });
    return gregorianDate.convert(persianCalendar, DARI_LOCALE);
  } catch (error) {
    return null;
  }
};

const toIsoString = (dateObject) => {
  if (!dateObject) return "";
  try {
    const clone = new DateObject(dateObject).convert(gregorianCalendar);
    return clone.format("YYYY-MM-DD");
  } catch {
    return "";
  }
};

const AfghanCalendar = ({
  label,
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
  className = "",
  inputClassName = "",
  error: errorMessage,
  disabled,
  clearable = true,
  name,
}) => {
  const [selectedDate, setSelectedDate] = useState(() =>
    toPersianDateObject(value)
  );
  const hasError = Boolean(errorMessage);

  useEffect(() => {
    setSelectedDate(toPersianDateObject(value));
  }, [value]);

  const inputClasses = useMemo(() => {
    const base = DATE_INPUT_CLASS;
    const stateClass = hasError
      ? "border-red-400 focus:ring-red-400 focus:border-red-400"
      : "border-gray-300 hover:border-gray-400";
    return `${base} ${stateClass} ${inputClassName}`.trim();
  }, [hasError, inputClassName]);

  const handleChange = (value) => {
    if (Array.isArray(value)) {
      setSelectedDate(null);
      onChange?.("");
      return;
    }

    if (!value) {
      setSelectedDate(null);
      onChange?.("");
      return;
    }

    let dateObject;

    if (value instanceof DateObject) {
      dateObject = value;
    } else if (typeof value === "string") {
      try {
        dateObject = new DateObject({
          date: toEnglishDigits(value),
          format: "YYYY/MM/DD",
          calendar: persianCalendar,
          locale: DARI_LOCALE,
        });
      } catch {
        dateObject = null;
      }
    } else {
      dateObject = null;
    }

    if (!dateObject) {
      setSelectedDate(null);
      onChange?.("");
      return;
    }

    setSelectedDate(dateObject);
    const isoString = toIsoString(dateObject);
    onChange?.(isoString);
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange?.("");
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="block text-[12px] font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <DatePicker
          className="w-full"
          value={selectedDate}
          onChange={handleChange}
          calendar={persianCalendar}
          locale={DARI_LOCALE}
          inputClass={inputClasses}
          placeholder={placeholder}
          format="YYYY/MM/DD"
          calendarPosition="bottom-center"
          fixMainPosition
          disabled={disabled}
          name={name}
        />
        {clearable && !disabled && selectedDate && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 left-2 flex items-center text-gray-400 hover:text-gray-600"
            aria-label="پاک کردن تاریخ"
          >
            ×
          </button>
        )}
      </div>
      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default AfghanCalendar;
