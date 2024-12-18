#!/usr/bin/env node

import timers from "timers/promises";
import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

const createBooksTable = (callback) => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    () => {
      callback();
    },
  );
};

const insertBookTitle = (title, callback) => {
  db.run("INSERT INTO books (title) VALUES (?)", title, function () {
    callback(this.lastID);
  });
};

const findBookColumnById = (id, callback) => {
  db.get("SELECT title FROM books WHERE id = ?", id, (_, record) => {
    callback(record);
  });
};

const mainWithoutError = () => {
  createBooksTable(() => {
    insertBookTitle("JavaScript Primer", (lastId) => {
      console.log(lastId);
      findBookColumnById(lastId, (record) => {
        console.log(record);
        db.run("DROP TABLE books");
      });
    });
  });
};
mainWithoutError();

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
            console.error(error.message);
          }
          db.all("SELECT * FROM book", (error) => {
            if (error) {
              console.error(error.message);
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
