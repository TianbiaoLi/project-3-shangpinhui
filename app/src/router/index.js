// 配置路由
import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "@/store";
// 使用插件
Vue.use(VueRouter);

// 重写push、replace方法
// 保存原方法
let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;
VueRouter.prototype.push = function (location, resolve, reject) {
	// 如果配置了跳转回调，则使用回调
	if (resolve && reject) {
		originPush.call(this, location, resolve, reject);
	} else {
		// 如果未配置，回调内容置空，但要有回调
		originPush.call(
			this,
			location,
			() => {},
			() => {}
		);
	}
};
VueRouter.prototype.replace = function (location, resolve, reject) {
	// 如果配置了跳转回调，则使用回调
	if (resolve && reject) {
		originReplace.call(this, location, resolve, reject);
	} else {
		// 如果未配置，回调内容置空，但要有回调
		originReplace.call(
			this,
			location,
			() => {},
			() => {}
		);
	}
};

// 配置路由
let router = new VueRouter({
	// 配置路由
	routes,
	// 跳转后回到页面顶部
	scrollBehavior(to, from, savedPosition) {
		return { y: 0 };
	},
});

// 全局守卫
router.beforeEach(async (to, from, next) => {
	// 用户登录才有token，是用户是否登录的凭证
	let token = store.state.user.token;
	// 用户信息
	// 用name属性而不是userInfo对象，因为对象为空，判断起来永远是true，不正确
	let name = store.state.user.userInfo.name;

	// 去往某个页面
	// 有过登录，拿到token（本次登录存进去的/上次登录存到本地的）
	if (token) {
		// 去往登录页
		if (to.path == "/login") {
			//已经登陆过，不需要再登录
			next("/");
		} else {
			// 去往其他页
			// 如果用户名已有
			if (name) {
				next();
			} else {
				// 没有用户名（特别指刷新浏览器，vuex数据清空）
				// 根据已有的token，重新找接口获取用户信息并存起来
				// 获取用户信息在首页展示（带有token去获取）
				try {
					// 获取用户信息成功
					await store.dispatch("getUserInfo");
					next();
				} catch (error) {
					// 获取用户信息失败（如token过期）
					// 清除用户信息（行为与退出登录相同）
					await store.dispatch("userLogout");
					// 重新登录
					next("/login");
				}
			}
		}
	} else {
		// 未登陆过
		let toPath = to.path;
		if (
			toPath.indexOf("/trade") != -1 ||
			toPath.indexOf("/pay") != -1 ||
			toPath.indexOf("/center") != -1
		) {
			// 将准备前往的个人页面记录下来，登录成功后跳转至相应页面
			next("/login?redirect=" + toPath);
		} else {
			next();
		}
	}
	next();
});
export default router;
