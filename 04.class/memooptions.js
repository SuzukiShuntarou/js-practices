class MemoOptions {
  constructor(args) {
    this.options = {
      list: args.l,
      read: args.r,
      delete: args.d,
    };
  }
  isList() {
    return this.options.list;
  }
  isRead() {
    return this.options.read;
  }
  isDelete() {
    return this.options.delete;
  }
}

export default MemoOptions;
