<template>
<div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: "BarChart",
  mounted(){
    // 初始化echarts实例
    let barCharts = echarts.init(this.$refs.charts);
    barCharts.setOption({
      xAxis:{
        show:false,
        type:'category'
      },
      yAxis:{
        show:false
      },
      series:[
        {
          type:'bar',
          data:[10,17,33,12,28,9,25,36,25,52,29,33],
          color:'#5172CA'
        }
      ],
      grid:{
        left:0,
        top:0,
        right:0,
        bottom:0
      },
      tooltip:{}
    })
  }
};
</script>

<style scoped>
.charts{
  width: 100%;
  height: 100%;
}
</style>
