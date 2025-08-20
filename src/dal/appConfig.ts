import { sqlManage } from "@/utils/sqlManage";
import { uuid } from "@/utils";

const sql = new sqlManage();

export class appConfig {
  obj = ["id", "configKey", "configValue", "description", "createTime", "updateTime"];

  normData = {
    id: "",
    configKey: "",
    configValue: "",
    description: "",
    createTime: "",
    updateTime: ""
  };

  tableName: string = "appConfig";

  // 查询全部配置
  public async queryData(data: any = { pageSize: "", pageNum: "", order: 0, orderString: "" }) {
    return await sql.queryData(this.tableName, data, this.obj.join(","));
  }

  // 根据key获取配置
  public async getConfig(key: string): Promise<string | null> {
    await sql.open();
    const sqlQuery = `SELECT configValue FROM ${this.tableName} WHERE configKey = ?`;
    const rows = await sql.sqlite.all(sqlQuery, [key]);
    return rows && rows.length > 0 ? rows[0].configValue : null;
  }

  // 设置配置
  public async setConfig(key: string, value: string, description?: string): Promise<boolean> {
    await sql.open();
    const existing = await this.getConfig(key);
    
    if (existing) {
      // 更新现有配置
      const updateSql = `UPDATE ${this.tableName} SET configValue = ?, description = ?, updateTime = ? WHERE configKey = ?`;
      await sql.sqlite.run(updateSql, [value, description || '', new Date().toISOString(), key]);
    } else {
      // 插入新配置
      const newConfig = {
        id: uuid(),
        configKey: key,
        configValue: value,
        description: description || '',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      };
      await sql.addData(this.tableName, newConfig);
    }
    return true;
  }

  // 新增配置
  public async addData(data: any) {
    const completeData = { ...this.normData, ...data };
    await sql.addData(this.tableName, completeData);
  }

  // 删除配置
  public async deleteConfig(key: string): Promise<boolean> {
    await sql.open();
    const deleteSql = `DELETE FROM ${this.tableName} WHERE configKey = ?`;
    await sql.sqlite.run(deleteSql, [key]);
    return true;
  }

  // 更新配置
  public async updateData(searchParam: any, data: any) {
    await sql.updateData(this.tableName, data, searchParam);
  }
}