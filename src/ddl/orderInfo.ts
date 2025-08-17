import { orderInfo } from "../dal/orderInfo";
import { OrderStatus } from "../type/orderStatus";

const order = new orderInfo();

export async function queryOrderInfoData(params: any) {
  return await order.queryData(params);
}

export async function queryOrdersByStatus(status: OrderStatus) {
  return await order.queryByStatus(status);
}

export async function queryOrderInfoBySkuIds(skuIds: string[]) {
  return await order.queryBySkuIds(skuIds);
}

export async function addOrderInfoData(data: any) {
  // 确保新增数据默认为未执行状态
  if (!data.status) {
    data.status = OrderStatus.UNFINISH;
  }
  return await order.addData(data);
}

export async function updateOrderInfoData(id: string, data: any) {
  return await order.updateData(id, data);
}

export async function deleteOrderInfoData(id: string) {
  return await order.deleteData(id);
}

/**
 * 更新订单状态
 * @param id 订单ID
 * @param status 订单状态
 * @returns 
 */
export async function updateOrderStatus(id: string, status: OrderStatus) {
  return await order.updateData(id, { status });
} 