import { orderInfo } from "../dal/orderInfo";
import { OrderStatus } from "../type/orderStatus";
import { querySkuMapperData } from './skuMapper';

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

/**
 * 为导入的新数据填充缺失的 skuMapperId
 * 如果 newData 中某一项没有 skuMapperId，则从已有订单中查找相同 skuId 的 skuMapperId 并填充
 */

export async function fillMissingSkuMapper(newData: any[]) {
  if (!newData || newData.length === 0) return;

  // 1. 从传入数据中找出缺少 skuMapperId 的 skuId 列表（去重、trim）
  const missingSkuIdsSet = new Set<string>();
  for (const item of newData) {
    if (item && item.skuId && (!item.skuMapperId || item.skuMapperId === '')) {
      const sku = ('' + item.skuId).trim();
      if (sku) missingSkuIdsSet.add(sku);
    }
  }

  const missingSkuIds = Array.from(missingSkuIdsSet);
  console.log('[fillMissingSkuMapper] 需要填充的 skuId 列表:', missingSkuIds);
  if (missingSkuIds.length === 0) {
    console.log('[fillMissingSkuMapper] 无需填充 skuMapperId');
    return;
  }

  // 2. 查询 skuMapper 表，获取这些 skuId 对应的 mapping（由于 ddl 没有 IN 查询接口，这里先查询全部然后筛选）
  const allMappers = await querySkuMapperData({});
  const skuToMapper: Record<string, string> = {};
  if (allMappers && allMappers.length) {
    for (const m of allMappers) {
      if (m && m.sku) {
        const key = ('' + m.sku).trim();
        // 优先使用未禁用且第一个出现的映射
        if (!skuToMapper[key] && m.disabled !== 1) {
          skuToMapper[key] = m.id;
        }
      }
    }
  }

  // 3. 回填 newData 中缺失的 skuMapperId
  let filledCount = 0;
  for (const item of newData) {
    if (item && item.skuId && (!item.skuMapperId || item.skuMapperId === '')) {
      const key = ('' + item.skuId).trim();
      const mapped = skuToMapper[key];
      if (mapped) {
        item.skuMapperId = mapped;
        filledCount++;
      }
    }
  }

  console.log(`[fillMissingSkuMapper] 填充完成，总需填充: ${missingSkuIds.length}, 实际填充: ${filledCount}`);
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