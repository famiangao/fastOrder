import path from 'path';
import { getDatabasePath } from './pathHelper';
const sqlite3 = require('sqlite3').verbose();

export class sqliteTool {
  db: any;
  status: boolean = false;
  
  url = getDatabasePath();

  // 连接数据库
  open() {
    console.log('尝试打开数据库:', this.url);
    
    return new Promise<any>((resolve, reject) => {
      this.db = new sqlite3.Database(this.url, (err: any) => {
        if (err) reject(err);
        else resolve(this.db);
      });
    });
  }

  // 支持带参数的run
  async run(query: string, params: any[] = []) {
    return new Promise<any>((resolve, reject) => {
      const db = this.db;
      db.run('BEGIN TRANSACTION');
      db.run(query, params, function (err: any) {
        if (err) {
          db.run('ROLLBACK');
          reject(err.message);
        } else {
          db.run('COMMIT');
          resolve(undefined);
        }
      });
    });
  }

  // 支持带参数的get
  async get(query: string, params: any[] = []) {
    return new Promise<any>((resolve, reject) => {
      this.db.get(query, params, function (err: any, row: any) {
        if (err) reject('Read error:' + err.message);
        else resolve(row);
      });
    });
  }

  // 支持带参数的all
  async all(query: string, params: any[] = []) {
    return new Promise<any[]>((resolve, reject) => {
      this.db.all(query, params, function (err: any, rows: any[]) {
        if (err) reject('Read error:' + err.message);
        else resolve(rows);
      });
    });
  }

  // each方法可选
  async each(query: string, params: any[] = []) {
    return new Promise<any[]>((resolve, reject) => {
      const results: any[] = [];
      this.db.each(query, params, function (err: any, row: any) {
        if (err) reject('Read error: ' + err.message);
        else results.push(row);
      }, function (err: any, count: number) {
        if (err) reject('Read error: ' + err.message);
        else resolve(results);
      });
    });
  }

  async close() {
    return new Promise<boolean>((resolve, reject) => {
      this.db.close(function (err: any) {
        if (err) reject('Read error: ' + err.message);
        else resolve(true);
      });
    });
  }
}
