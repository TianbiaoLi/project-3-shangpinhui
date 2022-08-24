// 品牌管理相关数据
import request from "@/utils/request";

// 获取分页列表 接口
export const reqTradeMarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });

// 添加品牌操作 /admin/product/baseTrademark/save post 品牌名、logo
// 修改品牌 /admin/product/baseTrademark/update put id,名称,logo
// 两者区别在于是否含有id
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    // 修改
    return request({
      url: "/admin/product/baseTrademark/update",
      method: "put",
      data: tradeMark,
    });
  } else {
    // 添加
    return request({
      url: "/admin/product/baseTrademark/save",
      method: "post",
      data: tradeMark,
    });
  }
};

// 删除品牌接口
export const reqDeleteTradeMark = (id) => request({url:`/admin/product/baseTradeMark/remove/${id}`,method:'delete'})
