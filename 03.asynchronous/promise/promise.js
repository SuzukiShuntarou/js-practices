#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import {
  runSqlQueryPromise,
  getDatabasePromise,
  allDatabasePromise,
  closeDatabasePromise,
} from "./promisification-functions.js";

const db = new sqlite3.Database(":memory:");

const createBooksTableWithoutError = () => {
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
      return result.lastID;
    })
    .then((insertedId) =>
      getDatabasePromise(
        db,
        "SELECT title FROM books WHERE id = ?",
        insertedId,
      ),
    )
    .then((record) => {
      console.log(record);
    })
    .finally(() => {
      runSqlQueryPromise(db, "DROP TABLE books");
    });
};
createBooksTableWithoutError();

await timers.setTimeout(100);

const createBooksTableWithError = () => {
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
    .then(() => {
      runSqlQueryPromise(db, "DROP TABLE books");
    })
    .finally(() => {
      closeDatabasePromise(db);
    });
};
createBooksTableWithError();
