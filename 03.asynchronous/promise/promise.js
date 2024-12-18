#!/usr/bin/env node

import timers from "timers/promises";

import {
  runSqlQueryPromise,
  getDatabasePromise,
  allDatabasePromise,
  closeDatabasePromise,
} from "./promisification-functions.js";

const createBooksTableWithoutError = () => {
  runSqlQueryPromise(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => {
      return runSqlQueryPromise(
        "INSERT INTO books (title) VALUES (?)",
        "JavaScript Primer",
      );
    })
    .then((result) => {
      console.log(result.lastID);
      return result.lastID;
    })
    .then((insertedId) => {
      return getDatabasePromise(
        "SELECT title FROM books WHERE id = ?",
        insertedId,
      );
    })
    .then((record) => {
      console.log(record);
    })
    .finally(() => {
      runSqlQueryPromise("DROP TABLE books");
    });
};
createBooksTableWithoutError();

await timers.setTimeout(100);

const createBooksTableWithError = () => {
  runSqlQueryPromise(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => {
      return runSqlQueryPromise(
        "INSERT INTO books (titlr) VALUES (?)",
        "JavaScript Primer",
      );
    })
    .catch((error) => {
      console.error(error.message);
    })
    .then(() => {
      return allDatabasePromise("SELECT * FROM book");
    })
    .catch((error) => {
      console.error(error.message);
    })
    .then(() => {
      runSqlQueryPromise("DROP TABLE books");
    })
    .finally(() => {
      closeDatabasePromise();
    });
};
createBooksTableWithError();
