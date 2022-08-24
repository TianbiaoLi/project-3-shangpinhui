// 交易页数据仓库

import { reqAddressInfo, reqOrderInfo } from "@/api";

const state = {
	// 用户地址信息
	address: [],
	orderInfo: {},
};
const mutations = {
	// 获取用户地址信息
	GETUSERADDRESS(state, address) {
		state.address = address;
	},
	// 获取商品清单
	GETORDERINFO(state, orderInfo) {
		state.orderInfo = orderInfo;
	},
};
const actions = {
	// 获取用户地址信息
	async getUserAddress({ commit }) {
		let result = await reqAddressInfo();
		if (result.code == 200) {
			commit("GETUSERADDRESS", result.data);
		}
	},
	// 获取用户交易页商品信息清单
	async getOrderInfo({ commit }) {
		let result = await reqOrderInfo();
		if (result.code == 200) {
			commit("GETORDERINFO", result.data);
		}
	},
};
const getters = {};

export default {
	state,
	mutations,
	actions,
	getters,
};
