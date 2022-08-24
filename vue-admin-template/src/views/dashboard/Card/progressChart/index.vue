<template>
<div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: "ProgressChart",
  mounted(){
    // 初始化echarts实例
    let barCharts = echarts.init(this.$refs.charts);
    barCharts.setOption({
      xAxis:{
        show:false,
        min:0,
        max:1,
      },
      yAxis:{
        show:false,
        type:'category',
      },
      series:[
        {
          type:'bar',
          data:[0.78],
          color:'#97C02B',
          barWidth:10,
          showBackground:true,
          backgroundStyle:{
            color:'#ddd'
          },
          label:{
            show:true,
            formatter:'|',
            position:'right',
          }
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
