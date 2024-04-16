<template>
  <div>
    <el-row>
      <el-col
        ><div style="margin: 10px 0" class="block">
          <el-input
            style="width: 200px"
            placeholder="请輸入部门id"
            suffix-icon="el-icon-search"
            size="medium"
            v-model="department_id"
          ></el-input>
          <el-select
            style="padding-left: 10px; padding-right: 10px"
            v-model="cost_type"
            size="medium"
            placeholder="请选择能耗类型"
          >
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.value
              }}</span>
            </el-option>
          </el-select>
          <el-date-picker
            style="padding-left: 10px"
            v-model="start_end_date"
            size="medium"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>

          <el-button class="ml-5" type="primary" @click="analysis" size="medium"
            >开始分析</el-button
          >
          <el-button class="ml-5" type="warning" @click="reset" size="medium"
            >重置</el-button
          >
        </div></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="11"
        ><el-card
          ><div
            id="systemPie"
            style="width: 100%; height: 400px"
          ></div></el-card
      ></el-col>
      <el-col :span="10"
        ><el-card
          ><div
            id="devicePie"
            style="width: 100%; height: 400px"
          ></div></el-card
      ></el-col>
    </el-row>
    <el-row>
      <el-col :span="21"
        ><el-card
          ><div
            id="AxisAlignwithTick"
            style="width: 100%; height: 350px"
          ></div></el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      types: [
        {
          value: "econsumption",
          label: "电",
        },
        {
          value: "wconsumption",
          label: "水",
        },
        {
          value: "gconsumption",
          label: "天燃气",
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      department_id: "",
      cost_type: "",
      start_end_date: "",

      option_system: {
        title: {
          text: "系统耗能计量占比",
          subtext: "单位显示",
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
            name: "Access From",
            type: "pie",
            radius: "57%",
            data: [
              // { value: 1048, name: "Search Engine" },
              { name: "系统1", value: 735 },
              { value: 580, name: "系统2" },
              { value: 484, name: "系统3" },
              { value: 300, name: "系统4" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      option_device: {
        title: {
          text: "设备占比",
          subtext: "耗能类型",
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
            name: "Access From",
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "Search Engine" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      },
      option_trend: {
        title: {
          text: "具体计量趋势",
          subtext: "单位显示",
          left: "center",
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
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
            data: [10, 52, 200, 334, 390, 330, 220],
          },
        ],
      },
    };
  },

  mounted() {
    this.showSystemPie();
    this.showDevicePie();
    this.showTrend();
  },
  methods: {
    analysis() {
      // console.log(this.department_id);
      // console.log(this.cost_type);
      // console.log(this.start_end_date[1]);
      this.loadPie();
    },
    loadPie() {
      if (
        this.department_id === "" ||
        this.cost_type === "" ||
        this.start_end_date === ""
      ) {
        this.$message.warning("请检查条件查询参数是否为空");
      } else {
        this.updateSystemPie();
        this.updateDevicePie();
        // this.showDevicePie();
        // this.showTrend();
      }
    },
    reset() {
      this.department_id = "";
      this.cost_type = "";
      this.start_end_date = "";
      this.loadPie();
    },
    showSystemPie() {
      var chartDom = document.getElementById("systemPie");
      var myChart = echarts.init(chartDom);
      myChart.setOption(this.option_system);
    },
    updateSystemPie() {
      this.request
        .get("/" + this.cost_type + "/systemPie", {
          params: {
            department_id: this.department_id,
            start_date: this.start_end_date[0],
            end_date: this.start_end_date[1],
          },
        })
        .then((res) => {
          if (res.code === "200") {
            if (res.data.length === 0) {
              this.$message.info("该时间段对应能耗数据为空");
            } else {
              this.option_system.series[0].data = res.data;
              switch (this.cost_type) {
                case "econsumption":
                  this.option_system.title.subtext = "单位 : kWh";
                  break;
                case "wconsumption":
                  this.option_system.title.subtext = "单位 : m³";
                  break;
                case "gconsumption":
                  this.option_system.title.subtext = "单位 : m³";
                  break;
              }
              var chartDom = document.getElementById("systemPie");
              var myChart = echarts.init(chartDom);
              myChart.setOption(this.option_system);
            }
          }
        });
    },
    showDevicePie() {
      var chartDom = document.getElementById("devicePie");
      var myChart = echarts.init(chartDom);
      // this.request.get("/");
      myChart.setOption(this.option_device);
    },
    updateDevicePie() {
      this.request
        .get("/device/devicePie", {
          params: {
            department_id: this.department_id,
            cost_type: this.cost_type,
          },
        })
        .then((res) => {
          if (res.code === "200") {
            if (res.data.length === 0) {
              this.$message.info("该部门此类型设备信息为空");
            } else {
              this.option_device.series[0].data = res.data;
              switch (this.cost_type) {
                case "econsumption":
                  this.option_device.title.subtext = "用电设备";
                  break;
                case "wconsumption":
                  this.option_device.title.subtext = "用水设备";
                  break;
                case "gconsumption":
                  this.option_device.title.subtext = "用气设备";
                  break;
              }
              var chartDom = document.getElementById("devicePie");
              var myChart = echarts.init(chartDom);
              myChart.setOption(this.option_device);
            }
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    showTrend() {
      var chartDom = document.getElementById("AxisAlignwithTick");
      var myChart = echarts.init(chartDom);
      myChart.setOption(this.option_trend);
    },
    updateTrend() {
      this.request
        .get("/" + this.cost_type + "/trend", {
          params: {
            department_id: this.department_id,
            start_date: this.start_end_date[0],
            end_date: this.start_end_date[1],
          },
        })
        .then((res) => {
          if (res.code === "200") {
            if (res.data.length === 0) {
              this.$message.info("该时间段对应能耗数据为空");
            } else {
              this.option_trend.xAxis[0].data = res.data.xAxisArray;
              this.option_trend.series[0].data = res.data.valueArray;
              switch (this.cost_type) {
                case "econsumption":
                  this.option_trend.title.subtext = "单位 : kWh";
                  break;
                case "wconsumption":
                  this.option_trend.title.subtext = "单位 : m³";
                  break;
                case "gconsumption":
                  this.option_trend.title.subtext = "单位 : m³";
                  break;
              }
              var chartDom = document.getElementById("AxisAlignwithTick");
              var myChart = echarts.init(chartDom);
              myChart.setOption(this.option_trend);
            }
          }
        });
    },
  },
};
</script>

<style></style>
