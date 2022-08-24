<template>
	<div class="type-nav">
		<div class="container">
			<div @mouseleave="leaveShow" @mouseenter="enterShow">
				<h2 class="all">全部商品分类</h2>
				<!-- 三级联动 -->
				<transition name="sort">
					<div class="sort" v-show="show">
						<div class="all-sort-list2" @click="goSearch">
							<div
								class="item"
								v-for="(c1, index) in categoryList"
								:key="c1.categoryId"
								@mouseenter="changeIndex(index)"
								:class="{ cur: currentIndex == index }"
							>
								<h3>
									<a
										:data-categoryName="c1.categoryName"
										:data-category1Id="c1.categoryId"
										>{{ c1.categoryName }}</a
									>
								</h3>
								<!-- 二级、三级分类 -->
								<div
									class="item-list clearfix"
									:style="{
										display:
											currentIndex == index
												? 'block'
												: 'none',
									}"
								>
									<div
										class="subitem"
										v-for="(c2, index) in c1.categoryChild"
										:key="c2.categoryId"
									>
										<dl class="fore">
											<dt>
												<a
													:data-categoryName="
														c2.categoryName
													"
													:data-category2Id="
														c2.categoryId
													"
													>{{ c2.categoryName }}</a
												>
											</dt>
											<dd>
												<em
													v-for="(
														c3, index
													) in c2.categoryChild"
													:key="c3.categoryId"
												>
													<a
														:data-categoryName="
															c3.categoryName
														"
														:data-category3Id="
															c3.categoryId
														"
														>{{
															c3.categoryName
														}}</a
													>
												</em>
											</dd>
										</dl>
									</div>
								</div>
							</div>
						</div>
					</div>
				</transition>
			</div>
			<nav class="nav">
				<a href="###">服装城</a>
				<a href="###">美妆馆</a>
				<a href="###">尚品汇超市</a>
				<a href="###">全球购</a>
				<a href="###">闪购</a>
				<a href="###">团购</a>
				<a href="###">有趣</a>
				<a href="###">秒杀</a>
			</nav>
		</div>
	</div>
</template>

<script>
import { mapState } from "vuex";
import { throttle } from "lodash";
export default {
	name: "TypeNav",
	data() {
		return {
			currentIndex: -1,
			show: true,
		};
	},
	// 组件挂载完毕，向服务器发送请求，获取数据
	mounted() {
		if (this.$route.path !== "/home") this.show = false; // 三级联动菜单显示条件
	},
	computed: {
		...mapState({
			categoryList: (state) => state.home.categoryList, // 名:值 mapState中state即为仓库
		}),
	},
	methods: {
		// 鼠标进入，修改响应式数据currentIndex
		changeIndex: throttle(function (index) {
			// 添加节流
			this.currentIndex = index;
		}, 50),
		// 点击目录，跳转到search页面
		goSearch(e) {
			// 获取元素
			let element = e.target;
			// 元素节点的dataset属性可以获取该节点的自定义属性与属性值
			let { categoryname, category1id, category2id, category3id } =
				element.dataset;
			// 有categoryname的一定是a标签，用于跳转
			if (categoryname) {
				// 路由跳转参数
				let location = { name: "search" };
				let query = { categoryName: categoryname };
				if (category1id) {
					// 一级分类
					query.category1Id = category1id;
				} else if (category2id) {
					// 二级分类
					query.category2Id = category2id;
				} else {
					// 三级分类
					query.category3Id = category3id;
				}
				// 整理参数
				// 判断：如果路由中有params参数，也要传递
				if (this.$route.params) {
					location.params = this.$route.params;
					location.query = query;
					this.$router.push(location);
				}
			}
		},
		// 鼠标进入
		enterShow() {
			if (this.$route.path !== "/home") {
				this.show = true;
			}
		},
		// 鼠标离开
		leaveShow() {
			this.currentIndex = -1;
			if (this.$route.path !== "/home") {
				this.show = false;
			}
		},
	},
};
</script>

<style scoped lang="less">
.type-nav {
	border-bottom: 2px solid #e1251b;

	.container {
		width: 1200px;
		margin: 0 auto;
		display: flex;
		position: relative;

		.all {
			width: 210px;
			height: 45px;
			background-color: #e1251b;
			line-height: 45px;
			text-align: center;
			color: #fff;
			font-size: 14px;
			font-weight: bold;
		}

		.nav {
			a {
				height: 45px;
				margin: 0 22px;
				line-height: 45px;
				font-size: 16px;
				color: #333;
			}
		}

		.sort {
			position: absolute;
			left: 0;
			top: 45px;
			width: 210px;
			height: 461px;
			position: absolute;
			background: #fafafa;
			z-index: 999;
			// overflow: hidden;

			.all-sort-list2 {
				.item {
					h3 {
						line-height: 30px;
						font-size: 14px;
						font-weight: 400;
						overflow: hidden;
						padding: 0 20px;
						margin: 0;

						a {
							color: #333;
						}
					}

					.item-list {
						display: none;
						position: absolute;
						width: 734px;
						min-height: 460px;
						background: #f7f7f7;
						left: 210px;
						border: 1px solid #ddd;
						top: 0;
						z-index: 9999 !important;

						.subitem {
							float: left;
							width: 650px;
							padding: 0 4px 0 8px;

							dl {
								border-top: 1px solid #eee;
								padding: 6px 0;
								overflow: hidden;
								zoom: 1;

								&.fore {
									border-top: 0;
								}

								dt {
									float: left;
									width: 54px;
									line-height: 22px;
									text-align: right;
									padding: 3px 6px 0 0;
									font-weight: 700;
								}

								dd {
									float: left;
									width: 415px;
									padding: 3px 0 0;
									overflow: hidden;

									em {
										float: left;
										height: 14px;
										line-height: 14px;
										padding: 0 8px;
										margin-top: 5px;
										border-left: 1px solid #ccc;
									}
								}
							}
						}
					}

					// &:hover {
					// 	.item-list {
					// 		display: block;
					// 	}
					// }
				}
				.cur {
					background: skyblue;
				}
			}
		}

		// 三级联动菜单出现隐藏动画
		// 过渡动画开始状态
		.sort-enter {
			opacity: 0.5;
			// height: 0;
		}
		// 过度动画结束状态
		.sort-enter-to {
			// height: 461px;
			opacity: 1;
		}
		// 定义动画进入时间、速率
		.sort-enter-active {
			transition: all 0.5s linear;
		}
	}
}
a:hover {
	cursor: pointer;
}
</style>
