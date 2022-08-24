<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: "LineChart",
  mounted(){
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      xAxis:{
        show:false,
        type:'category'
      },
      yAxis:{
        show:false
      },
      series:[
        {
          type:'line',
          data:[10,7,33,12,88,9],
          itemStyle:{
            opacity:0
          },
          lineStyle:{
            color:'#8E75EF'
          },
          areaStyle:{
            color:{
              type:'linear',
              x:0,
              y:0,
              x2:0,
              y2:1,
              colorStops:[
                {
                  offset:0,
                  color:'rgba(161, 139, 247, 0.8)',
                },
                {
                  offset:0.8,
                  color:'white'
                },
              ],
              global:false,
            }
          },
          smooth:true
        }
      ],
      grid:{
        left:0,
        top:0,
        right:0,
        bottom:0
      },
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
