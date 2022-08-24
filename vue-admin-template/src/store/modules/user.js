import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from "@/router";
import router from '@/router';

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    routes:[],
    roles:[],
    buttons:[],
    // 对比后需要最终展示的路由
    resultAsyncRoutes:[],
    // 最终用户展示的全部路由
    resultAllRoutes:[]
  };
};
const state = getDefaultState();
const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  // 存储用户信息
  SET_USERINFO:(state,userInfo)=>{
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.routes = userInfo.routes;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },
  // 最终计算出的异步路由
  SET_RESULTASYNCROUTES:(state,asyncRoutes)=>{
    // vuex保存当前用户的异步路由
    state.resultAsyncRoutes = asyncRoutes;
    // 计算当前用户要展现的所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes);
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes);
  }
};
const actions = {
  // 登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    let result = await login({ username: username.trim(), password: password });
    if (result.code == 20000) {
      const { data } = result;
      commit("SET_TOKEN", data.token);
      setToken(data.token);
      return "ok";
    } else {
      return Promise.reject(new Error("failed"));
    }
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response;
          // 存储用户全部信息
          commit("SET_USERINFO",data);
          commit("SET_RESULTASYNCROUTES",computedAsyncRoutes(asyncRoutes,data.routes));
          if (!data) {
            return reject("Verification failed, please Login again.");
          }
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};
// 定义展示用户路由的函数
const computedAsyncRoutes = (asyncRoutes,routes)=>{
  return asyncRoutes.filter(item=>{
    if(routes.indexOf(item.name)!=-1){
      // 子路由递归判断
      if(item.children&&item.children.length){
        item.children = computedAsyncRoutes(item.children,routes)
      }
      return true;
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
