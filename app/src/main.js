import Vue from "vue";
import App from "./App.vue";

// 引入路由
import router from "@/router";
// 引入vuex数据仓库
import store from "@/store";

// 三级联动组件--全局组件
import TypeNav from "@/components/TypeNav";
Vue.component(TypeNav.name, TypeNav); // 参数：组件名，哪一个组件
// 轮播图--全局组件
import Carousel from "@/components/Carousel";
Vue.component(Carousel.name, Carousel);
// 分页器--全局组件
import Pagination from "@/components/Pagination";
Vue.component(Pagination.name, Pagination);

// 按需引入elementUI
import { Button, MessageBox } from "element-ui";
// 全局注册
Vue.component(Button.name, Button);
// 挂载到原型上
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

// 引入MockServer.js ------mock数据
import "@/moke/mockServe";
// 引入swiper样式（全局多处用到轮播图）
import "swiper/css/swiper.css";
Vue.config.productionTip = false;

// 统一引入接口api文件里面的全部请求函数
import * as API from "@/api";

// 引入图片
import atm from "@/assets/1.gif";
// 引入图片懒加载插件
import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload, {
	// 懒加载默认图片
	loading: atm,
});

// 引入表单校验插件
import "@/plugins/validate";
new Vue({
	render: (h) => h(App),
	beforeCreate() {
		// 配置全局事件总线
		Vue.prototype.$bus = this;
		Vue.prototype.$API = API;
	},
	// 注册路由信息，之后组件带有$route，$router属性
	router,
	// 注册vuex数据仓库，之后组件带有$store属性
	store,
}).$mount("#app");
