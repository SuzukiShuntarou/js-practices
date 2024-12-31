import sqlite3 from "sqlite3";
import {
  runSqlQueryPromise,
  allRecordsPromise,
  closeDatabasePromise,
} from "./promisification-functions.js";

class Database {
  constructor() {
    this.db = new sqlite3.Database("memos.sqlite3");
  }

  async createMemosTable() {
    try {
      await runSqlQueryPromise(
        this.db,
        "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,content TEXT NOT NULL)",
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  async insertRecord(inputs) {
    const title = inputs[0] === "" ? "NoTitle" : inputs[0];
    const content = inputs.slice(1).join("\n");
    try {
      await runSqlQueryPromise(
        this.db,
        "INSERT INTO memos (title, content) VALUES (?, ?)",
        [title, content],
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  async loadMemos() {
    try {
      return await allRecordsPromise(this.db, "SELECT * FROM memos");
    } catch (error) {
      console.error(error.message);
    }
  }

  async deleteRecord(id) {
    try {
      return await runSqlQueryPromise(
        this.db,
        "DELETE FROM memos WHERE id = ?",
        id,
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  async close() {
    try {
      await closeDatabasePromise(this.db);
    } catch (error) {
      console.error(error.message);
    }
  }
}

export default Database;
