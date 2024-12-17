#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

const createBooksTableWithoutError = () => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run(
        "INSERT INTO books (title) VALUES (?)",
        "JavaScript Primer",
        function () {
          const insertedId = this.lastID;
          console.log(insertedId);
          db.get(
            "SELECT title FROM books WHERE id = ?",
            insertedId,
            (_, record) => {
              console.log(record);
              db.run("DROP TABLE books");
            },
          );
        },
      );
    },
  );
};
createBooksTableWithoutError();

await timers.setTimeout(100);

const createBooksTableWithError = () => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run(
        "INSERT INTO books (titlr) VALUES (?)",
        "JavaScript Primer",
        (error) => {
          if (error) {
            console.log(error.message);
          }
          db.all("SELECT * FROM book", (error) => {
            if (error) {
              console.log(error.message);
            }
            db.run("DROP TABLE books", () => {
              db.close();
            });
          });
        },
      );
    },
  );
};
createBooksTableWithError();
