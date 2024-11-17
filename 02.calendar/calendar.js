#!/usr/bin/env node

import minimist from "minimist";

let main = () => {
  const args = minimist(process.argv.slice(2));

  const options = {
    year: args.y,
    month: args.m,
  };
  generateCalendarDates(options);
};

let generateCalendarDates = (options) => {
  const today = new Date();
  const year = options["year"] || today.getFullYear();
  const month = options["month"] || today.getMonth() + 1;
  const firstDate = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0).getDate();

  showCalendar(year, month, firstDate, lastDay);
};

let showCalendar = (year, month, firstDate, lastDay) => {
  console.log(` ${month}月 ${year}年\n 日 月 火 水 木 金 土`);
  process.stdout.write("   ".repeat(firstDate.getDay()));

  Array.from(Array(lastDay).keys(), (x) => x + 1).forEach((date) => {
    const showedDate = date.toString().padStart(3, " ");

    if (new Date(year, month - 1, date).getDay() != 6) {
      process.stdout.write(showedDate);
    } else {
      console.log(showedDate);
    }
  });
  console.log();
};

main();
