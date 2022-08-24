// 对axios二次封装 moke数据

// 引入axios
import axios from "axios";
// 引入进度条
import nProgress from "nprogress";
// 引入进度条样式
import "nprogress/nprogress.css";
// 1.利用axios对象的方法create，去创建一个axios实例
// 2.request就是axios，只不过稍微配置一下
const requests = axios.create({
	// 配置对象
	// 基础路径
	baseURL: "/mock",
	// 请求超时
	timeout: 5000,
});

// 请求拦截器
requests.interceptors.request.use((config) => {
	// config:配置对象，对象里面有headers请求头属性
	// 进度条开始
	nProgress.start();
	return config;
});

// 响应拦截器
requests.interceptors.response.use(
	(res) => {
		// 成功回调函数
		// 进度条结束
		nProgress.done();
		return res.data;
	},
	() => {
		// 响应失败的回调函数
		return Promise.reject(new Error("failed"));
	}
);
export default requests;
