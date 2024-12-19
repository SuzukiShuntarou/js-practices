#!/usr/bin/env node

import sqlite3 from "sqlite3";
import {
  runSqlQueryPromise,
  getDatabasePromise,
  allDatabasePromise,
  closeDatabasePromise,
} from "../promise/promisification-functions.js";

const db = new sqlite3.Database(":memory:");

const mainWithoutError = async () => {
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
await mainWithoutError();

const handleSqliteError = (error) => {
  if (error instanceof Error && error.code?.startsWith("SQLITE_")) {
    console.error(error.message);
  } else {
    throw error;
  }
};

const mainWithError = async () => {
  try {
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
  } finally {
    await runSqlQueryPromise(db, "DROP TABLE books");
    await closeDatabasePromise(db);
  }
};
await mainWithError();
