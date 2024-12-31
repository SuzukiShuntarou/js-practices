#!/usr/bin/env node

import minimist from "minimist";
import CommandLineInterface from "./commandlineinterface.js";
import MemoOptions from "./memooptions.js";

class Memo {
  constructor(args) {
    this.memoOptions = new MemoOptions(args);
  }

  async exec() {
    const cli = new CommandLineInterface();
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
const memo = new Memo(args);
await memo.exec();
