<template>
	<div>
		<Header></Header>
		<!-- 路由组件出口 -->
		<router-view></router-view>
		<Footer v-show="$route.meta.showFooter"></Footer>
	</div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
export default {
	name: "App",
	components: {
		Header,
		Footer,
	},
	mounted() {
		// 在app中保证仅执行一次
		this.$store.dispatch("categoryList"); // 挂载后向服务器获取三级联动菜单数据
	},
};
</script>

<style scoped></style>
