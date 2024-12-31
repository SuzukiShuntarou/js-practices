import readline from "readline";
import enquirer from "enquirer";
import database from "./database.js";

class CommandLineInterface {
  constructor() {
    this.db = new database();
  }

  async build() {
    await this.db.createMemosTable();
    this.reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async createMemo() {
    const inputs = await this.#readInputs();
    await this.db.insertRecord(inputs);
  }

  #readInputs() {
    let inputLines = [];
    return new Promise((resolve, reject) => {
      this.reader.on("line", (inputs) => {
        inputLines.push(inputs);
      });
      this.reader.on("close", () => {
        resolve(inputLines);
      });
      this.reader.on("error", (error) => {
        reject(error);
      });
    });
  }

  async showTitles() {
    const memos = await this.db.loadMemos();
    memos.forEach((memo) => console.log(memo.title));
  }

  async showContent() {
    const memos = await this.db.loadMemos();
    await enquirer.prompt({
      type: "select",
      message: "Choose a note you want to see:",
      choices: memos,
      footer() {
        return `\n${this.focused.content}`;
      },
    });
  }

  async deleteMemo() {
    const memos = await this.db.loadMemos();
    const response = await enquirer.prompt({
      type: "select",
      name: "id",
      message: "Choose a memo you want to delete:",
      choices: memos,
      result() {
        return this.focused.id;
      },
    });
    await this.db.deleteRecord(response.id);
  }

  async close() {
    await this.db.close();
    this.reader.close();
  }
}

export default CommandLineInterface;
