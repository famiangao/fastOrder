// -- skuMapper definition

// CREATE TABLE skuMapper (
// 	id TEXT NOT NULL,
// 	sku TEXT NOT NULL,
// 	url TEXT NOT NULL,
// 	disabled INTEGER DEFAULT (0) NOT NULL, 
//  skuName TEXT NOT NULL,
// 	CONSTRAINT pidMapper_pk PRIMARY KEY (id)
// );

import { sqlManage } from "@/utils/sqlManage";
import { uuid } from "@/utils";

const sql = new sqlManage();
export class skuMapper {
  obj = ["id", "sku", "url", "disabled", "skuName"];

  normData = {
    id: "",
    sku: "",
    url: "",
    disabled: 0,
    skuName: ""
  };

  tableName: string = "skuMapper";
  
  // 查询全部数据、分页查询
  /**
   *
   * @param data {pageSize数量 pageNum页码,order: 0 升序 1 降序，orderString:根据那个字段进行排序}  可传空 为空时返回全部数据
   * @returns
   */
  public async queryData(data: any = { pageSize: "", pageNum: "", order: 0, orderString: "" }) {
    return await sql.queryData(this.tableName, data, this.obj.join(","));
  }

  // 新增数据
  public async addData(data: any) {
    data = await sql.checkData(this.normData, data);
    data.id = uuid();
    return await sql.addData(this.tableName, data);
  }

  // 修改数据
  public async updateData(id: string, data: any) {
    const { sku, url, disabled, skuName } = data;
    return await sql.updateData(this.tableName, { sku, url, disabled, skuName }, { id });
  }

  // 删除数据
  public async deleteData(id: string) {
    return await sql.delData(this.tableName, { id });
  }
}