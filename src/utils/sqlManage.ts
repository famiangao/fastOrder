import { sqliteTool } from "@/utils/sqliteTool";

export class sqlManage {
  db: any;
  sqlite: sqliteTool;

  constructor() {
    this.sqlite = new sqliteTool();
  }

  async open() {
    if (!this.db) {
      this.db = await this.sqlite.open();
    }
    return this.db;
  }

  async close() {
    if (this.db) {
      await this.sqlite.close();
      this.db = null;
    }
  }

  // 检查并补全数据字段
  async checkData(normData: any, data: any) {
    const result: any = { ...normData };
    for (const key in normData) {
      result[key] = data[key] !== undefined ? data[key] : normData[key];
    }
    return result;
  }

  // 新增数据
  async addData(table: string, data: any) {
    await this.open();
    const keys = Object.keys(data);
    const values = keys.map(k => data[k]);
    const placeholders = keys.map(() => '?').join(',');
    const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`;
    await this.sqlite.run(sql, values);
    return true;
  }

  // 删除数据
  async delData(table: string, where: any) {
    await this.open();
    const keys = Object.keys(where);
    const conditions = keys.map(k => `${k} = ?`).join(' AND ');
    const sql = `DELETE FROM ${table} WHERE ${conditions}`;
    await this.sqlite.run(sql, keys.map(k => where[k]));
    return true;
  }

  // 修改数据
  async updateData(table: string, data: any, where: any) {
    await this.open();
    const setKeys = Object.keys(data);
    const setStr = setKeys.map(k => `${k} = ?`).join(', ');
    const whereKeys = Object.keys(where);
    const whereStr = whereKeys.map(k => `${k} = ?`).join(' AND ');
    const sql = `UPDATE ${table} SET ${setStr} WHERE ${whereStr}`;
    await this.sqlite.run(sql, [...setKeys.map(k => data[k]), ...whereKeys.map(k => where[k])]);
    return true;
  }

  // 查询单条数据
  async getData(table: string, where: any) {
    await this.open();
    const keys = Object.keys(where);
    const conditions = keys.map(k => `${k} = ?`).join(' AND ');
    const sql = `SELECT * FROM ${table} WHERE ${conditions} LIMIT 1`;
    const row = await this.sqlite.get(sql, keys.map(k => where[k]));
    return row;
  }

  // 查询列表/分页
  async queryData(table: string, options: any = {}, fields: string = '*') {
    await this.open();
    let sql = `SELECT ${fields} FROM ${table}`;
    let params: any[] = [];
    if (options.where) {
      const whereKeys = Object.keys(options.where);
      if (whereKeys.length > 0) {
        sql += ' WHERE ' + whereKeys.map(k => `${k} = ?`).join(' AND ');
        params = whereKeys.map(k => options.where[k]);
      }
    }
    if (options.orderString) {
      sql += ` ORDER BY ${options.orderString} ${options.order === 1 ? 'DESC' : 'ASC'}`;
    }
    if (options.pageSize && options.pageNum) {
      sql += ` LIMIT ? OFFSET ?`;
      params.push(Number(options.pageSize), (Number(options.pageNum) - 1) * Number(options.pageSize));
    }
    const rows = await this.sqlite.all(sql, params);
    return rows;
  }
}
