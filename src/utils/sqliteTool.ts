const sqlite3 = require('sqlite3').verbose();

import path from 'path'

export class sqliteTool {
  db: any;
  status: boolean = false;
  url = path.join(process.cwd(), '/static/db/zmj.db');
  // 连接数据库
  open() {
    return new Promise<any>(async (resolve, reject) => {
      var _this = this;
      this.db = new sqlite3.Database(this.url, function (err: any, row: any) {
        if (err) throw err;
        resolve(_this.db);
      });
    });
  }
  async run(query: string) {
    return new Promise<void>((resolve, reject) => {
      this.db.run('begin transaction');
      try {
        this.db.run(query, function (err: any, row: any) {
          if (err) reject(err.message);
          else {
            resolve(row);
          }
        });
        this.db.run('commit');
      } catch {
        this.db.run('rollback');
      }
    });
  }
  async get(query: any, params: any) {
    return new Promise<void>((resolve, reject) => {
      this.db.get(query, params, function (err: any, row: any) {
        if (err) reject('Read error:' + err.message);
        else resolve(row);
      });
    });
  }

  async all(query: any, params: any = '') {
    if (params) {
      return new Promise<void>((resolve, reject) => {
        this.db.all(query, params, function (err: any, row: any) {
          if (err) reject('Read error1:' + err.message);
          else resolve(row);
        });
      });
    } else {
      const a = new Promise<void>((resolve, reject) => {
        this.db.all(query, function (err: any, row: any) {
          if (err) reject('Read error2:' + err.message + query);
          else resolve(row);
        });
      });
      return a;
    }
  }

  async each(query: any, params: any) {
    return new Promise<void>((resolve, reject) => {
      var _this = this;
      this.db.serialize(function () {
        _this.db.each(query, params, function (err: any, row: any) {
          if (err) reject('Read error: ' + err.message);
          else {
            resolve(row);
          }
        });
        _this.db.get('', function (err: any, row: any) {
          resolve(row);
        });
      });
    });
  }

  async close() {
    return new Promise<boolean>((resolve, reject) => {
      this.db.close(function (err: any, row: any) {
        if (err) reject('Read error: ' + err.message);
        else {
          resolve(true);
        }
      });
    });
  }
}
