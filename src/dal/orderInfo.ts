// -- orderInfo definition

// CREATE TABLE orderInfo (
// 	id TEXT NOT NULL,
// 	orderId TEXT NOT NULL,
// 	address TEXT,
// 	skuId TEXT NOT NULL, skuMapperId TEXT, status TEXT,
// 	CONSTRAINT orderInfo_pk PRIMARY KEY (id)
// );


import { sqlManage } from "@/utils/sqlManage";
import { uuid } from "@/utils";
import { OrderStatus } from "@/type/orderStatus";

const sql = new sqlManage();
export class orderInfo {
  obj = ["id", "orderId", "address", "skuId", "skuMapperId", "status"];

  normData = {
    id: "",
    orderId: "",
    address: "",
    skuId: "",
    skuMapperId: "",
    status: ""
  };

  tableName: string = "orderInfo";
  // 查询全部数据、分页查询
  /**
   *
   * @param data {pageSize数量 pageNum页码,order: 0 升序 1 降序，orderString:根据那个字段进行排序}  可传空 为空时返回全部数据
   * @returns
   */
  public async queryData(data: any = { pageSize: "", pageNum: "", order: 0, orderString: "" }) {
    return await sql.queryData(this.tableName, data, this.obj.join(","));
  }

  // 根据skuId列表查询订单
  public async queryBySkuIds(skuIds: string[]) {
    if (!skuIds || skuIds.length === 0) {
      return [];
    }
    
    await sql.open();
    const placeholders = skuIds.map(() => '?').join(',');
    const sqlQuery = `SELECT ${this.obj.join(',')} FROM ${this.tableName} WHERE skuId IN (${placeholders})`;
    const rows = await sql.sqlite.all(sqlQuery, skuIds);
    return rows;
  }

  // 根据状态查询订单
  public async queryByStatus(status: OrderStatus) {
    await sql.open();
    const sqlQuery = `SELECT ${this.obj.join(',')} FROM ${this.tableName} WHERE status = ?`;
    const rows = await sql.sqlite.all(sqlQuery, [status]);
    return rows;
  }

  // 新增数据
  public async addData(data: any) {
    data = await sql.checkData(this.normData, data);
    data.id = uuid();
    // 设置默认状态为未执行
    data.status = data.status || OrderStatus.UNFINISH;
    return await sql.addData(this.tableName, data);
  }

  // 修改数据
  public async updateData(id: string, data: any) {
    const { orderId, address, skuId, skuMapperId, status } = data;
    return await sql.updateData(this.tableName, { orderId, address, skuId, skuMapperId, status }, { id });
  }

  // 删除数据
  public async deleteData(id: string) {
    return await sql.delData(this.tableName, { id });
  }
}