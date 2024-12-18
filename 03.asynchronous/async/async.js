#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";
import {
  runSqlQueryPromise,
  getDatabasePromise,
  allDatabasePromise,
  closeDatabasePromise,
} from "../promise/promisification-functions.js";

const db = new sqlite3.Database(":memory:");

const createBooksTableWithoutError = async () => {
  await runSqlQueryPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  const result = await runSqlQueryPromise(
    db,
    "INSERT INTO books (title) VALUES (?)",
    "JavaScript Primer",
  );
  console.log(result.lastID);
  const record = await getDatabasePromise(
    db,
    "SELECT title FROM books WHERE id = ?",
    result.lastID,
  );
  console.log(record);
  await runSqlQueryPromise(db, "DROP TABLE books");
};
createBooksTableWithoutError();

await timers.setTimeout(100);

const handleSqliteError = (error) => {
  if (error instanceof Error && error.code?.startsWith("SQLITE_")) {
    console.error(error.message);
  } else {
    throw error;
  }
};

const createBooksTableWithError = async () => {
  await runSqlQueryPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  );
  try {
    await runSqlQueryPromise(
      db,
      "INSERT INTO books (titlr) VALUES (?)",
      "JavaScript Primer",
    );
  } catch (error) {
    handleSqliteError(error);
  }
  try {
    await allDatabasePromise(db, "SELECT * FROM book");
  } catch (error) {
    handleSqliteError(error);
  }
  try {
    await runSqlQueryPromise(db, "DROP TABLE books");
  } finally {
    await closeDatabasePromise(db);
  }
};
createBooksTableWithError();
