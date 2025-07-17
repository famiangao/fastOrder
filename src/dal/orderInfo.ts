import { sqlManage } from "@/utils/sqlManage";
import { uuid } from "@/utils";

const sql=new sqlManage();
export class orderInfo {
  obj = ['id', 'orderId', 'address', 'skuId','skuMapperId'];

  normData = {
    id: '',
    orderId: '',
    address: '',
    skuId: '',
    skuMapperId:''
  };

  
  tableName: string = 'orderInfo';
  // 查询全部数据、分页查询
  /**
   *
   * @param data {pageSize数量 pageNum页码,oeder: 0 升序 1 降序，orderSring:根据那个字段进行排序}  可传空 为空时返回全部数据
   * @returns
   */
  public async queryData(data: any = { pageSize: '', pageNum: '', order: 0, orderString: '' }) {
    return await sql.queryData(this.tableName, data, String(this.obj));
  }

  // 新增数据

  public async addData(data: any) {
    data = await sql.checkData(this.normData, data);
    data.id = uuid();
    return await sql.addData('orderInfo', data);
  }
}