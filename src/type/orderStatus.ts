/**
 * @description: 订单状态枚举
 */
export enum OrderStatus {
  FINISH = 'finish',
  UNFINISH = 'unfinish'
}

/**
 * @description: 订单状态标签映射
 */
export const OrderStatusLabel: Record<OrderStatus, string> = {
  [OrderStatus.FINISH]: '已执行',
  [OrderStatus.UNFINISH]: '未执行'
}; 