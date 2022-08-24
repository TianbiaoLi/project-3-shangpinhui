// sku模块接口
import request from "@/utils/request";

// 获取sku列表数据
export const reqSkuList = (page, limit) =>
  request({ url: `/admin/product/list/${page}/${limit}`, method: "get" });

// sku上架
export const skuSale = (skuId) =>
  request({ url: `admin/product/onSale/${skuId}`, method: "get" });

// sku下架
export const skuCancel = (skuId) =>
  request({ url: `admin/product/cancelSale/${skuId}`, method: "get" });

// 获取sku详情
export const reqSkuById = (skuId) =>
  request({ url: `admin/product/getSkuById/${skuId}`, method: "get" });
