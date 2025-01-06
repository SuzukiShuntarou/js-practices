#!/usr/bin/env node

import minimist from "minimist";
import MemoCommandLineInterface from "./memocommandlineinterface.js";
import MemoOptions from "./memooptions.js";

class Memo {
  constructor(args, databaseName) {
    this.memoOptions = new MemoOptions(args);
    this.databaseName = databaseName;
  }

  async exec() {
    const cli = new MemoCommandLineInterface(this.databaseName);
    try {
      await cli.build();
      if (this.memoOptions.isList()) {
        await cli.showTitles();
      } else if (this.memoOptions.isRead()) {
        await cli.showContent();
      } else if (this.memoOptions.isDelete()) {
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
