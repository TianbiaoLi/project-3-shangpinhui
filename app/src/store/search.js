// search模块vuex仓库

// 导入数据接口
import { reqGetSearchInfo } from "@/api";

const state = {
	searchList: {},
};
const mutations = {
	GETSEARCHLIST(state, searchList) {
		state.searchList = searchList;
	},
};
const actions = {
	// 获取search模块数据
	async getSearchList({ commit }, params) {
		let result = await reqGetSearchInfo(params);
		if (result.code == 200) {
			commit("GETSEARCHLIST", result.data);
		}
	},
};
// 简化数据
const getters = {
	// 当前形参state是当前仓库的state
	goodsList(state) {
		return state.searchList.goodsList || [];
	},
	trademarkList(state) {
		return state.searchList.trademarkList;
	},
	attrsList(state) {
		return state.searchList.attrsList;
	},
};
export default {
	state,
	mutations,
	actions,
	getters,
};
