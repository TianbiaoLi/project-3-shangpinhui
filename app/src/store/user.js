// 登录注册数据仓库

// 获取数据接口
import {
	reqGetCode,
	reqUserRegister,
	reqUserLogin,
	reqUserInfo,
	reqLogout,
} from "@/api";
// token存取
import { setToken, getToken, removeToken } from "@/utils/token";

const state = {
	code: "",
	token: getToken(),
	userInfo: {},
};
const mutations = {
	// 存储验证码（非真实场景，用于模拟用户获取验证码）
	GETCODE(state, code) {
		state.code = code;
	},
	// 存储用户token
	USERLOGIN(state, token) {
		state.token = token;
	},
	// 存储用户信息
	GETUSERONFI(state, userInfo) {
		state.userInfo = userInfo;
	},
	// 退出登录，清除信息
	CLEAR(state) {
		state.token = "";
		state.userInfo = {};
		removeToken();
	},
};
const actions = {
	// 获取验证码
	async getCode({ commit }, phone) {
		let result = await reqGetCode(phone);
		if (result.code == 200) {
			commit("GETCODE", result.data);
			return "ok";
		} else {
			return Promise.reject(new Error("failed"));
		}
	},
	// 用户注册
	async userRegister({ commit }, user) {
		let result = await reqUserRegister(user);
		if (result.code == 200) {
			return "ok";
		} else {
			return Promise.reject(new Error("failed"));
		}
	},
	// 用户登录
	async userLogin({ commit }, data) {
		// 服务器下发token
		let result = await reqUserLogin(data);
		if (result.code == 200) {
			// 存储token
			commit("USERLOGIN", result.data.token);
			// 持久化存储token
			setToken(result.data.token);
			return "ok";
		} else {
			return Promise.reject(new Error("failed"));
		}
	},
	// （登录后带token）获取用户信息
	async getUserInfo({ commit }) {
		let result = await reqUserInfo();
		// 存储用户信息
		if (result.code == 200) {
			commit("GETUSERONFI", result.data);
			return "ok";
		} else {
			return Promise.reject(new Error("failed"));
		}
	},
	// 退出登录
	async userLogout({ commit }) {
		let result = await reqLogout();
		// 清除token及用户信息
		if (result.code == 200) {
			commit("CLEAR");
			return "ok";
		} else {
			return Promise.reject(new Error("failed"));
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
