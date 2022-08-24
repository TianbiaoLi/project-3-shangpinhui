// home模块vuex仓库

// 导入三级联动数据接口，获取数据
import { reqCategoryList, reqGetBannerList, reqFloorList } from "@/api";

// 存储数据
// 数据默认初始值应和服务器返回数据形式保持一致
const state = {
	// home页三级菜单数据
	categoryList: [],
	// home页轮播图数据
	bannerList: [],
	// home页floor数据
	floorList: [],
};

// 将获取的数据存到state中
const mutations = {
	// 将home页三级菜单数据存储到state
	CATEGORYLIST(state, categoryList) {
		state.categoryList = categoryList.slice(0, categoryList.length - 1);
	},
	// 将home页轮播图数据存储到state
	GETBANNERLIST(state, bannerList) {
		state.bannerList = bannerList;
	},
	// 将home页floor数据存储到state
	GETFLOORLIST(state, floorList) {
		state.floorList = floorList;
	},
};

// 将要执行的行为以及相关的参数发给mutation
const actions = {
	//通过API里面的接口函数调用，向服务器发送请求，获取数据
	async categoryList({ commit }) {
		let result = await reqCategoryList();
		if (result.code == 200) {
			commit("CATEGORYLIST", result.data); // 将数据发给mutations
		}
	},
	// 获取首页轮播图数据
	async getBannerList({ commit }) {
		let result = await reqGetBannerList();
		if (result.code == 200) {
			commit("GETBANNERLIST", result.data);
		}
	},
	// 获取floor数据
	async getFloorList({ commit }) {
		let result = await reqFloorList();
		if (result.code == 200) {
			commit("GETFLOORLIST", result.data);
		}
	},
};

// 计算属性
const getters = {};

export default {
	state,
	mutations,
	actions,
	getters,
};
