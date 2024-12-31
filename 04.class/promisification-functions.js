export function runSqlQueryPromise(database, query, param) {
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

export function allRecordsPromise(database, query, param) {
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

export function closeDatabasePromise(database) {
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
