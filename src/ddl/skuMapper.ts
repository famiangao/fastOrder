import { skuMapper } from "../dal/skuMapper";

const mapper = new skuMapper();

export async function querySkuMapperData(params: any) {
  return await mapper.queryData(params);
}

export async function addSkuMapperData(data: any) {
  return await mapper.addData(data);
}

export async function updateSkuMapperData(id: string, data: any) {
  return await mapper.updateData(id, data);
}

export async function deleteSkuMapperData(id: string) {
  return await mapper.deleteData(id);
} 