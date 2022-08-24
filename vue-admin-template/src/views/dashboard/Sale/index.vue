<template>
  <el-card class="box-card" style="margin: 10px 0">
    <!-- header区域 -->
    <div slot="header" class="clearfix">
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <!-- 头部左侧内容 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span class="time" @click="setDay">今日</span>
        <span class="time" @click="setWeek">本周</span>
        <span class="time" @click="setMonth">本月</span>
        <span class="time" @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          value-format="yyyy-MM-dd"
          class="data"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
        >
        </el-date-picker>
      </div>
    </div>
    <!-- body区域 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <div class="list-card">
            <span class="rank-name">门店{{ title }}排名</span>
            <ul>
              <li>
                <span class="rindex">1</span>
                <span>肯德基</span>
                <span class="rvalue">323,234</span>
              </li>
              <li>
                <span class="rindex">2</span>
                <span>肯德基</span>
                <span class="rvalue">323,234</span>
              </li>
              <li>
                <span class="rindex">3</span>
                <span>肯德基</span>
                <span class="rvalue">323,234</span>
              </li>
              <li>
                <span>4</span>
                <span>肯德基</span>
                <span class="rvalue">323,234</span>
              </li>
              <li>
                <span>5</span>
                <span>肯德基</span>
                <span class="rvalue">323,234</span>
              </li>
              <li>
                <span>6</span>
                <span>肯德基</span>
                <span class="rvalue">323,234</span>
              </li>
              <li>
                <span>7</span>
                <span>肯德基</span>
                <span class="rvalue">323,234</span>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import dayjs from "dayjs";
import echarts from "echarts";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      mycharts: null,
      date: [],
    };
  },
  mounted() {
    // 加载图表
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title: {
        text: "销售额",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: this.listState.orderFullYearAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: this.listState.orderFullYear,
          color: "#5172CA",
          barWidth: 40,
        },
      ],
    });
  },
  computed: {
    // body右侧卡片标题
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  watch: {
    // title变化时，重新修改图标标题
    title() {
      this.showBarData();
    },
    // 获取数据之后立即展示
    listState() {
      this.showBarData();
    },
  },
  methods: {
    // 点击设置日期
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 展示中间部分柱形图
    showBarData() {
      this.mycharts.setOption({
        title: {
          text: this.title,
        },
        xAxis: {
          data:
            this.title == "销售额"
              ? this.listState.orderFullYearAxis
              : this.listState.userFullYearAxis,
        },
        series: {
          data:
            this.title == "销售额"
              ? this.listState.orderFullYear
              : this.listState.userFullYear,
        },
      });
    },
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
/* 头部 */
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right .time:hover {
  color: #409eff;
  cursor: pointer;
}
.data {
  width: 250px;
  margin: 0 20px;
}
.right span {
  margin: 0 10px;
}
.charts,
.list-card {
  width: 100%;
  height: 300px;
}
.list-card span {
  margin: 0 10px;
}
.rank-name {
  display: block;
  height: 20px;
  line-height: 20px;
  font-weight: 700;
  font-size: 17px;
}
ul {
  list-style: none;
  width: 100%;
  height: 280px;
}
ul li {
  height: 10%;
  margin: 10px 0;
}
ul li span:first-child {
  float: left;
  width: 20px;
  height: 20px;
  text-align: center;
}
.rindex {
  border-radius: 50%;
  background-color: #000;
  color: white;
}
.rvalue {
  float: right;
}
</style>
