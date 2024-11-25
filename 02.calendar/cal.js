#!/usr/bin/env node

import minimist from "minimist";

const main = () => {
  const args = minimist(process.argv.slice(2));

  const options = {
    year: args.y,
    month: args.m,
  };
  const [year, month, firstDate, lastDate] = generateCalendarDates(options);
  showCalendar(year, month, firstDate, lastDate);
};

const generateCalendarDates = (options) => {
  const today = new Date();
  const year = options.year ?? today.getFullYear();
  const month = options.month ?? today.getMonth() + 1;
  const firstDate = new Date(year, month - 1, 1);
  const lastDate = new Date(year, month, 0);

  return [year, month, firstDate, lastDate];
};

const showCalendar = (year, month, firstDate, lastDate) => {
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

    if (currentDate.getDay() != SATURDAY) {
      process.stdout.write(formattedDate);
      if (currentDate < lastDate) {
        process.stdout.write(" ");
      }
    } else {
      console.log(formattedDate);
    }
  }
  console.log();
};

main();
