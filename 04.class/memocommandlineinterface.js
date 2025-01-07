#!/usr/bin/env node

import minimist from "minimist";
import readline from "readline";
import enquirer from "enquirer";
import MemoDatabase from "./memodatabase.js";

class MemoCommandLineInterface {
  constructor(args, databaseName) {
    this.memoOptions = {
      list: args.l,
      read: args.r,
      delete: args.d,
    };
    this.db = new MemoDatabase(databaseName);
  }

  async exec() {
    try {
      await this.#build();
      if (this.memoOptions.list) {
        await this.#showTitles();
      } else if (this.memoOptions.read) {
        await this.#showContent();
      } else if (this.memoOptions.delete) {
        await this.#deleteMemo();
      } else {
        await this.#createMemo();
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      await this.#close();
    }
  }

  async #build() {
    await this.db.createMemosTable();
    this.reader = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  async #createMemo() {
    const inputs = await this.#readInputs();
    const title = inputs[0] === "" ? "NoTitle" : inputs[0];
    const content = inputs.slice(1).join("\n");
    await this.db.insertRecord(title, content);
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

  async #showTitles() {
    const memos = await this.db.loadMemos();
    memos.forEach((memo) => console.log(memo.title));
  }

  async #showContent() {
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

  async #deleteMemo() {
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

  async #close() {
    await this.db.close();
    this.reader.close();
  }
}

const args = minimist(process.argv.slice(2));
const databaseName = "memos.sqlite3";
const memocli = new MemoCommandLineInterface(args, databaseName);
await memocli.exec();
