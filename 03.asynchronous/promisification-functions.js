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

export function getDatabasePromise(database, query, param) {
  return new Promise((resolve, reject) => {
    database.get(query, param, (error, record) => {
      if (error) {
        reject(error);
      } else {
        resolve(record);
      }
    });
  });
}

export function allDatabasePromise(database, query, param) {
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
