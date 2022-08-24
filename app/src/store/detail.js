// details模块vuex仓库

// 获取数据接口
import { reqGoodsInfo, reqAddOrUpdateShopCar } from "@/api";
// 获取临时身份
import { getUUID } from "@/utils/uuid_token";
const state = {
	goodInfo: {},
	// 游客临时身份
	uuid_token: getUUID(),
};
const mutations = {
	GETGOODINFO(state, goodInfo) {
		state.goodInfo = goodInfo;
	},
};
const actions = {
	// 获取产品信息
	async getGoodInfo({ commit }, skuId) {
		let result = await reqGoodsInfo(skuId);
		if (result.code == 200) {
			commit("GETGOODINFO", result.data);
		}
	},
	// 将产品添加到购物车，因为服务器没有返回数据，因此不需要存储
	async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
		let result = await reqAddOrUpdateShopCar(skuId, skuNum);
		if (result.code == 200) {
			return "ok";
		} else {
			return Promise.reject(new Error("failed"));
		}
	},
};
// 简化数据
const getters = {
	// 路径导航
	categoryView(state) {
		return state.goodInfo.categoryView || {};
	},
	// 放大镜及右侧详情
	skuInfo(state) {
		return state.goodInfo.skuInfo || {};
	},
	// 产品售卖属性
	spuSaleAttrList(state) {
		return state.goodInfo.spuSaleAttrList || [];
	},
};
export default {
	state,
	mutations,
	actions,
	getters,
};
