#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import {
  runSqlQueryPromise,
  getDatabasePromise,
  allDatabasePromise,
  closeDatabasePromise,
} from "./promisification-functions.js";

const mainWithoutError = () => {
  runSqlQueryPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() =>
      runSqlQueryPromise(
        db,
        "INSERT INTO books (title) VALUES (?)",
        "JavaScript Primer",
      ),
    )
    .then((result) => {
      console.log(result.lastID);
      return getDatabasePromise(
        db,
        "SELECT title FROM books WHERE id = ?",
        result.lastID,
      );
    })
    .then((record) => {
      console.log(record);
    })
    .finally(() => {
      runSqlQueryPromise(db, "DROP TABLE books");
    });
};

const mainWithError = () => {
  runSqlQueryPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  )
    .then(() =>
      runSqlQueryPromise(
        db,
        "INSERT INTO books (titlr) VALUES (?)",
        "JavaScript Primer",
      ),
    )
    .catch((error) => {
      console.error(error.message);
    })
    .then(() => allDatabasePromise(db, "SELECT * FROM book"))
    .catch((error) => {
      console.error(error.message);
    })
    .then(() => runSqlQueryPromise(db, "DROP TABLE books"))
    .finally(() => {
      closeDatabasePromise(db);
    });
};

const db = new sqlite3.Database(":memory:");
mainWithoutError();
await timers.setTimeout(100);
mainWithError();
