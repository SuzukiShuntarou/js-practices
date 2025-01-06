import sqlite3 from "sqlite3";

class MemoDatabase {
  constructor(name) {
    this.db = new sqlite3.Database(name);
  }

  async createMemosTable() {
    try {
      await this.#runSqlQueryPromise(
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
      await this.#runSqlQueryPromise(
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
      return await this.#allRecordsPromise(
        this.db,
        "SELECT * FROM memos ORDER BY id ASC",
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  async deleteRecord(id) {
    try {
      return await this.#runSqlQueryPromise(
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
      await this.#closeDatabasePromise(this.db);
    } catch (error) {
      console.error(error.message);
    }
  }

  #runSqlQueryPromise(database, query, param) {
    return new Promise((resolve, reject) => {
      database.run(query, param, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }

  #allRecordsPromise(database, query, param) {
    return new Promise((resolve, reject) => {
      database.all(query, param, (error, records) => {
        if (error) {
          reject(error);
        } else {
          resolve(records);
        }
      });
    });
  }

  #closeDatabasePromise(database) {
    return new Promise((resolve, reject) => {
      database.close((error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

export default MemoDatabase;
