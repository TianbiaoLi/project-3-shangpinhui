<template>
  <el-card>
    <!-- 头部 -->
    <div slot="header" class="header-line">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value" size="mini" class="radio-choose">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <!-- 饼图 -->
    <div class="charts" ref="charts"></div>
  </el-card>
</template>

<script scoped>
import echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    let myCharts = echarts.init(this.$refs.charts);
    myCharts.setOption({
      title: {
        text: "",
        subtext:'',
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outsize",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    myCharts.on("mouseover", (params) => {
      myCharts.setOption({
        title: {
          text: params.data.name,
          subtext: params.data.value,
        },
      });
    });
    myCharts.on("mouseout", (params) => {
      myCharts.setOption({
        title: {
          text: '',
          subtext: '',
        },
      });
    });
  },
};
</script>

<style scoped>
.header-line {
  padding: 5px 0;
  border-bottom: 2px solid #e4e7ed;
}
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.radio-choose {
  margin-top: -8px;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>
