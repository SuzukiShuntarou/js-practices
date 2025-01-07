#!/usr/bin/env node

import minimist from "minimist";
import MemoCommandLineInterface from "./memocommandlineinterface.js";

class Memo {
  constructor(args, databaseName) {
    this.memoOptions = {
      list: args.l,
      read: args.r,
      delete: args.d,
    };
    this.databaseName = databaseName;
  }

  async exec() {
    const cli = new MemoCommandLineInterface(this.databaseName);
    try {
      await cli.build();
      if (this.memoOptions.list) {
        await cli.showTitles();
      } else if (this.memoOptions.read) {
        await cli.showContent();
      } else if (this.memoOptions.delete) {
        await cli.deleteMemo();
      } else {
        await cli.createMemo();
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      await cli.close();
    }
  }
}

const args = minimist(process.argv.slice(2));
const databaseName = "memos.sqlite3";
const memo = new Memo(args, databaseName);
await memo.exec();
