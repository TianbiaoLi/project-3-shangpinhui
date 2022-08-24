// API接口统一管理

// 引入 axios二次封装请求方式
import requests from "./request";
// 引入 mock请求数据方式
import mockRequests from "./mockAjax";

// 获取 三级联动接口
// /api/product/getBaseCategoryList get 无参数
// export const reqCategoryList = () => {
// 	// 发请求:axois发请求返回结果为Promise对象
// 	return requests({
// 		url: "/product/getBaseCategoryList",
// 		method: "get",
// 	});
// };
// 简写
export const reqCategoryList = () =>
	requests({ url: "/product/getBaseCategoryList", method: "get" });

// 获取 获取banner（mock）接口
export const reqGetBannerList = () =>
	mockRequests({ url: "/banner", method: "get" });

// 获取floor数据（moke）接口
export const reqFloorList = () => mockRequests.get("/floor");

// 获取搜索模块数据 post请求 带参数
// 当前接口传参params至少是一个空对象
export const reqGetSearchInfo = (params) =>
	requests({
		url: "/list",
		method: "post",
		data: params,
	});

// 获取商品详情接口 URL:/api/item/{skuid} get
export const reqGoodsInfo = (skuId) =>
	requests({ url: `/item/${skuId}`, method: "get" });

// 将产品添加到购物车 或 更新产品个数 /api/cart/addToCart/{skuId}/{skuNum} post
export const reqAddOrUpdateShopCar = (skuId, skuNum) =>
	requests({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: "post" });

// 获取购物车列表数据
export const reqCartList = () =>
	requests({ url: "/cart/cartList", method: "get" });

// 删除购物车数据
export const reqDeleteCartById = (skuId) =>
	requests({ url: `cart/deleteCart/${skuId}`, method: "delete" });

// 改变购物车商品选中状态
export const reqUpdateCheckedById = (skuId, isChecked) =>
	requests({ url: `/cart/checkCart/${skuId}/${isChecked}`, method: "get" });

// 获取验证码
export const reqGetCode = (phone) =>
	requests({ url: `/user/passport/sendCode/${phone}`, method: "get" });

// 用户注册 {phone,code,password}
export const reqUserRegister = (data) =>
	requests({ url: "/user/passport/register", data, method: "post" });

// 登录接口
export const reqUserLogin = (data) =>
	requests({ url: "/user/passport/login", data, method: "post" });

// 获取用户信息（登录后带有用户token）
export const reqUserInfo = () =>
	requests({ url: "/user/passport/auth/getUserInfo", method: "get" });

// 退出登录
export const reqLogout = () =>
	requests({ url: "/user/passport/logout", method: "get" });

// 获取用户地址信息
export const reqAddressInfo = () =>
	requests({
		url: "/user/userAddress/auth/findUserAddressList",
		method: "get",
	});

// 获取用户交易页商品信息清单
export const reqOrderInfo = () =>
	requests({ url: "/order/auth/trade", method: "get" });

// 提交订单
export const reqSubmitOrder = (tradeNo, data) =>
	requests({
		url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
		data,
		method: "post",
	});

// 获取订单支付信息
export const reqPayInfo = (orderId) =>
	requests({ url: `/payment/weixin/createNative/${orderId}`, method: "get" });

// 获取支付订单状态
export const reqPayStatus = (orderId) =>
	requests({
		url: `/payment/weixin/queryPayStatus/${orderId}`,
		method: "get",
	});

// 个人中心订单列表
export const reqMyOrderList = (page, limit) =>
	requests({ url: `/order/auth/${page}/${limit}`, method: "get" });
