<template>
	<div class="spec-preview">
		<!-- 左侧展示图 -->
		<img :src="imgObj.imgUrl" />
		<div class="event" @mousemove="handler"></div>
		<!-- 右侧放大图 -->
		<div class="big">
			<img :src="imgObj.imgUrl" ref="big" />
		</div>
		<!-- 遮罩层 -->
		<div class="mask" ref="mask"></div>
	</div>
</template>

<script>
export default {
	name: "Zoom",
	props: ["skuImageList"],
	data() {
		return {
			// 当前展示的是返回列表中的第几个图片
			currentIndex: 0,
		};
	},
	computed: {
		imgObj() {
			return this.skuImageList[this.currentIndex] || {};
		},
	},
	mounted() {
		// 全局事件总线，获取下方小图的index，用于展示大图
		this.$bus.$on("getIndex", (index) => {
			// 修改响应式数据，更新大图
			this.currentIndex = index;
		});
	},
	methods: {
		// 鼠标移动放大镜效果--遮罩层移动
		handler(e) {
			let mask = this.$refs.mask;
			let big = this.$refs.big;
			// 遮罩距左侧距离 = 鼠标对父元素左侧的距离 - 遮罩宽度/2
			let left = e.offsetX - mask.offsetWidth / 2;
			let top = e.offsetY - mask.offsetHeight / 2;
			// 修改遮罩层位置
			// 约束范围
			if (left <= 0) left = 0;
			if (left >= mask.offsetWidth) left = mask.offsetWidth; //大盒子的宽度=2*蒙版宽度，因此left不能大于1个蒙板宽度
			if (top <= 0) top = 1;
			if (top >= mask.offsetHeight) top = mask.offsetHeight; //大盒子的高度=2*蒙版高度，因此top不能大于1个蒙板高度
			mask.style.left = left + "px";
			mask.style.top = top + "px";
			// 修改放大镜图片位置
			big.style.left = -2 * left + "px"; //右侧放大图片尺寸为左侧展示图的2倍
			big.style.top = -2 * top + "px";
		},
	},
};
</script>

<style lang="less">
.spec-preview {
	position: relative;
	width: 400px;
	height: 400px;
	border: 1px solid #ccc;

	img {
		width: 100%;
		height: 100%;
	}

	.event {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 998;
	}

	.mask {
		width: 50%;
		height: 50%;
		background-color: rgba(0, 255, 0, 0.3);
		position: absolute;
		left: 0;
		top: 0;
		display: none;
	}

	.big {
		width: 100%;
		height: 100%;
		position: absolute;
		top: -1px;
		left: 100%;
		border: 1px solid #aaa;
		overflow: hidden;
		z-index: 998;
		display: none;
		background: white;

		img {
			width: 200%;
			max-width: 200%;
			height: 200%;
			position: absolute;
			left: 0;
			top: 0;
		}
	}

	.event:hover ~ .mask,
	.event:hover ~ .big {
		display: block;
	}
}
</style>
