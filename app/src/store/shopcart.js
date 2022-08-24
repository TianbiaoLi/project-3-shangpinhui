// 购物车模块vuex数据仓库

// 导入数据接口
import { reqCartList, reqDeleteCartById, reqUpdateCheckedById } from "@/api";

const state = {
	cartList: [],
};
const mutations = {
	GETCARTLIST(state, cartList) {
		state.cartList = cartList;
	},
};
const actions = {
	// 获取购物车列表数据
	async getCartList({ commit }) {
		let result = await reqCartList();
		if (result.code == 200) {
			commit("GETCARTLIST", result.data);
		}
	},
	// 删除购物车商品，纯接口，无返回数据
	async deleteCartListBySkuId({ commit }, skuId) {
		let result = await reqDeleteCartById(skuId);
		if (result.code == 200) {
			return "ok";
		} else {
			return Promise.reject(new Error("failed"));
		}
	},
	// 修改购物车产品选中状态
	async updateCheckedById({ commit }, { skuId, isChecked }) {
		let result = await reqUpdateCheckedById(skuId, isChecked);
		if (result.code == 200) {
			return "ok";
		} else {
			return Promise.reject(new Error("failed"));
		}
	},
	// 删除全部勾选产品
	// 从上下文获取dispatch及数据，之后进行遍历调用删除单个商品的action
	deleteAllCheckedCart({ dispatch, getters }) {
		let PromiseAll = [];
		getters.cartList.cartInfoList.forEach((item) => {
			let promise =
				item.isChecked == 1
					? dispatch("deleteCartListBySkuId", item.skuId)
					: "";
			PromiseAll.push(promise);
		});
		return Promise.all(PromiseAll);
	},
	// 修改全部产品状态
	updateAllCartChecked({ dispatch, state }, isChecked) {
		let PromiseAll = [];
		state.cartList[0].cartInfoList.forEach((item) => {
			let promise = dispatch("updateCheckedById", {
				skuId: item.skuId,
				isChecked,
			});
			PromiseAll.push(promise);
		});
		return Promise.all(PromiseAll);
	},
};
const getters = {
	// 简化获取的数据
	cartList(state) {
		return state.cartList[0] || {};
	},
	cartInfoList(state) {
		return state.cartList.cartInfoList || [];
	},
};
export default {
	state,
	mutations,
	actions,
	getters,
};
