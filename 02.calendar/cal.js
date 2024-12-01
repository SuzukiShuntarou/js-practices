#!/usr/bin/env node

import minimist from "minimist";

const main = () => {
  const args = minimist(process.argv.slice(2));

  const calendarOptions = {
    year: args.y,
    month: args.m,
  };
  const yearmonthOptions = generateCalendarYearMonth(calendarOptions);
  showCalendar(yearmonthOptions);
};

const generateCalendarYearMonth = (calendarOptions) => {
  const today = new Date();
  const year = calendarOptions.year ?? today.getFullYear();
  const month = calendarOptions.month ?? today.getMonth() + 1;

  return { year, month };
};

const showCalendar = (yearmonthOptions) => {
  const year = yearmonthOptions.year;
  const month = yearmonthOptions.month;
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0);

  console.log(`${" ".repeat(6)}${month}月 ${year}`);
  console.log("日 月 火 水 木 金 土");
  process.stdout.write("   ".repeat(firstDate.getDay()));

  const SATURDAY = 6;
  for (
    const currentDate = new Date(firstDate);
    currentDate <= lastDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const formattedDate = currentDate.getDate().toString().padStart(2, " ");

    process.stdout.write(formattedDate);
    if (currentDate.getDay() == SATURDAY) {
      console.log(" ");
    } else if (currentDate < lastDate) {
      process.stdout.write(" ");
    }
  }
  console.log();
};

main();
