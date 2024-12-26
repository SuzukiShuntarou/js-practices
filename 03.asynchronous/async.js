#!/usr/bin/env node

import sqlite3 from "sqlite3";
import {
  runSqlQueryPromise,
  getRecordPromise,
  searchRecordsPromise,
  closeDatabasePromise,
} from "./promisification-functions.js";

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
  const record = await getRecordPromise(
    db,
    "SELECT title FROM books WHERE id = ?",
    result.lastID,
  );
  console.log(record);
  await runSqlQueryPromise(db, "DROP TABLE books");
};

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
      await searchRecordsPromise(db, "SELECT * FROM book");
    } catch (error) {
      handleSqliteError(error);
    }
    await runSqlQueryPromise(db, "DROP TABLE books");
  } finally {
    await closeDatabasePromise(db);
  }
};

const db = new sqlite3.Database(":memory:");
await mainWithoutError();
await mainWithError();
