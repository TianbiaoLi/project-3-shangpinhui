// 引入一级路由组件
// import Home from "@/pages/Home";
// import Search from "@/pages/Search";
// import Login from "@/pages/Login";
// import Register from "@/pages/Register";
// import Detail from "@/pages/Detail";
// import AddCartSuccess from "@/pages/AddCartSuccess";
// import ShopCart from "@/pages/ShopCart";
// import Trade from "@/pages/Trade";
// import Pay from "@/pages/Pay";
// import PaySuccess from "@/pages/PaySuccess";
// import Center from "@/pages/Center";
// 引入二级路由组件
// import MyOrder from "@/pages/Center/MyOrder";
// import GroupOrder from "@/pages/Center/GroupOrder";
// 路由配置信息
export default [
	{
		// 重定向，项目启动时，访问/，立即定向到首页
		path: "*",
		redirect: "/home",
	},
	{
		// 首页
		path: "/home",
		component: () => import("@/pages/Home"),
		meta: { showFooter: true },
	},
	{
		// 搜索页
		name: "search",
		path: "/search/:keyword?",
		component: () => import("@/pages/Search"),
		meta: { showFooter: true },
	},
	{
		// 登录页
		path: "/Login",
		component: () => import("@/pages/Login"),
		meta: { showFooter: false },
	},
	{
		// 注册页
		path: "/register",
		component: () => import("@/pages/Register"),
		meta: { showFooter: false },
	},
	{
		// 商品详情页
		path: "/detail/:skuid",
		component: () => import("@/pages/Detail"),
		meta: { showFooter: true },
	},
	{
		// 添加购物车成功
		name: "addcartsuccess",
		path: "/addcartsuccess",
		component: () => import("@/pages/AddCartSuccess"),
		meta: { showFooter: true },
	},
	{
		// 购物车
		path: "/shopcart",
		component: () => import("@/pages/ShopCart"),
		meta: { showFooter: true },
	},
	{
		// 交易页
		path: "/trade",
		component: () => import("@/pages/Trade"),
		meta: { showFooter: true },
		beforeEnter: (to, from, next) => {
			if (from.path == "/shopcart") {
				// 只有购物车页面可以前往交易页面
				next();
			} else {
				// 其他组件去往购物车，停在当前页面
				next(false);
			}
		},
	},
	{
		// 支付页面
		path: "/pay",
		component: () => import("@/pages/Pay"),
		meta: { showFooter: true },
		beforeEnter: (to, from, next) => {
			if (from.path == "/trade") {
				// 只有交易页面可以前往提价订单页面
				next();
			} else {
				// 其他组件去往购物车，停在当前页面
				next(false);
			}
		},
	},
	{
		// 支付成功页面
		path: "/paysuccess",
		component: () => import("@/pages/PaySuccess"),
		meta: { showFooter: true },
	},
	{
		// 个人中心页面
		path: "/center",
		component: () => import("@/pages/Center"),
		meta: { showFooter: true },
		children: [
			{
				// 重定向，个人中心默认访问myorder
				path: "/center",
				redirect: "/center/myorder",
			},
			{
				path: "myorder",
				component: () => import("@/pages/Center/MyOrder"),
			},
			{
				path: "grouporder",
				component: () => import("@/pages/Center/GroupOrder"),
			},
		],
	},
];
