<template>
	<!-- 轮播图全局组件 -->
	<div class="swiper-container" ref="floor1Swiper">
		<div class="swiper-wrapper">
			<div
				class="swiper-slide"
				v-for="(carousel, index) in list"
				:key="carousel.id"
			>
				<img :src="carousel.imgUrl" />
			</div>
		</div>
		<!-- 如果需要分页器 -->
		<div class="swiper-pagination"></div>

		<!-- 如果需要导航按钮 -->
		<div class="swiper-button-prev"></div>
		<div class="swiper-button-next"></div>
	</div>
</template>

<script>
import Swiper from "swiper";
export default {
	name: "Carousel",
	props: ["list"],
	watch: {
		list: {
			immediate: true,
			handler() {
				this.$nextTick(() => {
					// swiper实例化 此处在mounted是因为数据不是发请求获取的，而是父组件传递的，因此已经有了结构
					var mySwiper = new Swiper(this.$refs.floor1Swiper, {
						loop: true, // 循环模式选项
						// 如果需要分页器
						pagination: {
							el: ".swiper-pagination",
							clickable: true,
						},
						// 如果需要前进后退按钮
						navigation: {
							nextEl: ".swiper-button-next",
							prevEl: ".swiper-button-prev",
						},
					});
				});
			},
		},
	},
};
</script>

<style></style>
