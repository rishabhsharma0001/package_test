import React, { useState } from "react";
import "./index.css";

export interface TileChartProps {
  data: {
    date: string;
    status?: "present" | "late" | "absent";
  }[];
  range?: 3 | 6 | 12; // Default to 12 months
}

// Helper function to get the number of days in a month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// date will come in 2024-04-30T18:35:53.575Z ISO format
// so we need to filter out all the months and years and days
const getFormattedDate = (date: string) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth(); // Month is zero-based
  const day = dateObj.getDate();
  return { year, month, day };
};

const TileChart: React.FC<TileChartProps> = ({ data, range = 12 }) => {
  const getColor = (status?: "present" | "late" | "absent") => {
    switch (status) {
      case "present":
        return "bg-present";
      case "late":
        return "bg-late";
      case "absent":
        return "bg-absent";
      default:
        return "bg-default";
    }
  };

  const currentDate = new Date();
  const startMonth =
    currentDate.getMonth() - range >= 0
      ? currentDate.getMonth() - range
      : 12 + currentDate.getMonth() - range;
  const startYear =
    currentDate.getMonth() - range >= 0
      ? currentDate.getFullYear()
      : currentDate.getFullYear() - 1;
  const endMonth = currentDate.getMonth();
  const endYear = currentDate.getFullYear();

  const groupedData = data.reduce((acc, curr) => {
    const formattedDate = getFormattedDate(curr.date);
    const key = `${formattedDate.year}-${formattedDate.month}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({ day: formattedDate.day, status: curr.status });
    return acc;
  }, {} as { [key: string]: { day: number; status?: "present" | "late" | "absent" }[] });

  const allMonths = [];
  let currentMonth = startMonth;
  let currentYear = startYear;

  while (
    currentYear < endYear ||
    (currentYear === endYear && currentMonth <= endMonth)
  ) {
    const key = `${currentYear}-${currentMonth}`;
    allMonths.push(key);
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }
  const [popup, setPopup] = useState<{
    x: number;
    y: number;
    content: string;
  } | null>(null);
  const [popupTimeout, setPopupTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    content: string
  ) => {
    if (popupTimeout) clearTimeout(popupTimeout);
    const rect = event.currentTarget.getBoundingClientRect();
    setPopupTimeout(
      setTimeout(() => {
        setPopup({ x: rect.left, y: rect.top - 3, content }); // Position the popup relative to the element
      }, 100)
    ); // Delay before showing the popup
  };

  const handleMouseLeave = () => {
    if (popupTimeout) clearTimeout(popupTimeout);
    setPopupTimeout(
      setTimeout(() => {
        setPopup(null);
      }, 100)
    ); // Delay before hiding the popup
  };
  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return (
    <div className="tile-chart">
      {allMonths.map((key) => {
        const [year, month] = key.split("-").map(Number) as [number, number];
        const daysInMonth = getDaysInMonth(year, month);
        const monthData = groupedData[key] || [];

        return (
          <div key={key} className="month-container">
            <span className="month-lable">
              {new Date(year, month).toLocaleString("default", {
                month: "short",
              })}
            </span>
            <div className="day-tiles">
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (day) => {
                  const status = monthData.find((d) => d.day === day)?.status;
                  const dateObj = new Date(year, month, day);
                  const date = `${dateObj.getDate()}${getOrdinalSuffix(
                    dateObj.getDate()
                  )} ${dateObj.toLocaleString("default", {
                    month: "short",
                  })} ${String(year).slice(-2)}`;
                  return (
                    <div
                      key={day}
                      className={`day-tile ${getColor(status)}`}
                      onMouseEnter={(event) => handleMouseEnter(event, date)}
                      onMouseLeave={handleMouseLeave}
                    ></div>
                  );
                }
              )}
            </div>
          </div>
        );
      })}
      {popup && (
        <div
          className="popup"
          style={{ position: "fixed", top: popup.y, left: popup.x }}
        >
          {popup.content}
        </div>
      )}
    </div>
  );
};

export default TileChart;
