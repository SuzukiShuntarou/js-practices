import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

export function runDatabasePromise(query, param) {
  return new Promise((resolve, reject) => {
    db.run(query, param, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this);
      }
    });
  });
}

export function getDatabasePromise(query, param) {
  return new Promise((resolve, reject) => {
    db.get(query, param, (error, record) => {
      if (error) {
        reject(error);
      } else {
        resolve(record);
      }
    });
  });
}

export function allDatabasePromise(query, param) {
  return new Promise((resolve, reject) => {
    db.all(query, param, (error, records) => {
      if (error) {
        reject(error);
      } else {
        resolve(records);
      }
    });
  });
}

export function closeDatabasePromise() {
  return new Promise((resolve, reject) => {
    db.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
