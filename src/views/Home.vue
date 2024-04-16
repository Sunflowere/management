<template>
  <el-row>
    <el-col :span="10">
      <el-card>
        <div id="main" style="width: 500px; height: 400px"></div>
      </el-card>
    </el-col>
    <el-col :span="10">
      <el-card>
        <div id="pie" style="width: 500px; height: 400px"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Home",
  methods: {
    showEcharts() {
      var option = {
        title: {
          text: "各月份会员数量统计",
          subtext: "趋势图",
          left: "center",
        },
        xAxis: {
          type: "category",
          data: ["十一月份", "十二月份", "一月份", "二月份"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "line",
          },
          {
            data: [],
            type: "bar",
          },
        ],
      };

      var chartDom = document.getElementById("main");
      var myChart = echarts.init(chartDom);
      
      this.request.get("/eEcharts/members").then((res) => {
        // 填空
        // option.xAxis.data = res.data.x
        option.series[0].data = res.data;
        option.series[1].data = res.data;
        // 数据准备完毕之后再set
        myChart.setOption(option);
      });

      var pieOption = {
        title: {
          text: "各季度会员数量统计",
          subtext: "比例图",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            type: "pie",
            radius: "60%",
            label: {
              //饼图图形上的文本标签
              normal: {
                show: true,
                position: "inner", //标签的位置
                textStyle: {
                  fontWeight: 300,
                  fontSize: 14, //文字的字体大小
                  color: "#fff",
                },
                formatter: "{d}%",
              },
            },
            data: [], // 填空
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      
      var pieDom = document.getElementById("pie");
      var pieChart = echarts.init(pieDom);

      this.request.get("/eEcharts/members").then((res) => {
        pieOption.series[0].data = [
          { name: "十一月份", value: res.data[0] },
          { name: "十二月份", value: res.data[1] },
          { name: "一月份", value: res.data[2] },
          { name: "二月份", value: res.data[3] },
        ];
        pieChart.setOption(pieOption);
      });
    },
  },
  mounted() {
    this.showEcharts();
  },
};
</script>

<style></style>
