#!/usr/bin/env node

import timers from "timers/promises";

import {
  runDatabasePromise,
  getDatabasePromise,
  allDatabasePromise,
  closeDatabasePromise,
} from "./promisification-functions.js";

const createBooksTableWithoutError = () => {
  runDatabasePromise(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => {
      return runDatabasePromise(
        "INSERT INTO books (title) VALUES (?)",
        "JavaScript Primer",
      );
    })
    .then((result) => {
      const insertedId = result.lastID;
      console.log(insertedId);
      return insertedId;
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
      runDatabasePromise("DROP TABLE books");
    });
};
createBooksTableWithoutError();

await timers.setTimeout(100);

const createBooksTableWithError = () => {
  runDatabasePromise(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => {
      return runDatabasePromise(
        "INSERT INTO books (titlr) VALUES (?)",
        "JavaScript Primer",
      );
    })
    .catch((error) => {
      console.log(error.message);
    })
    .then(() => {
      return allDatabasePromise("SELECT * FROM book");
    })
    .catch((error) => {
      console.log(error.message);
    })
    .then(() => {
      runDatabasePromise("DROP TABLE books");
    })
    .finally(() => {
      closeDatabasePromise();
    });
};
createBooksTableWithError();
