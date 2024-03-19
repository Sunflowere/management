<template>
  <div>
    <el-row>
      <el-col :span="20">
        <el-row>
          <el-col :span="3">
            <el-row>
              <el-card>
                <div id="select_department" style="width: 100%; height: 60px">
                  <h6
                    style="
                      font-size: medium;
                      text-align: center;
                      padding-bottom: 5px;
                    "
                  >
                    请选择部门
                  </h6>
                  <el-select
                    style="width: 100px"
                    v-model="id"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="department in departments"
                      :key="department.id"
                      :label="department.name"
                      :value="department.id"
                    >
                    </el-option>
                  </el-select>
                </div>
              </el-card>
            </el-row>
            <el-row>
              <el-card>
                <div id="total_department" style="width: 100%; height: 200px">
                  <el-descriptions
                    title="部门信息"
                    direction="vertical"
                    :column="1"
                    border
                  >
                    <el-descriptions-item
                      label="名称"
                      labelStyle="font-weight: bold; color: black"
                      >{{ department.name }}</el-descriptions-item
                    >
                    <el-descriptions-item
                      label="地址"
                      labelStyle="font-weight: bold; color: black"
                      >{{ department.address }}</el-descriptions-item
                    >
                  </el-descriptions>
                </div>
              </el-card>
            </el-row>
          </el-col>
          <el-card>
            <div id="day" style="width: 100%; height: 300px">
              24小时用电数据
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-card>
              <div style="text-align: center; font-weight: bold">
                年度用电数据
              </div>
              <div id="year" style="width: 500px; height: 300px">
                年度用电数据
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card>
              <div style="text-align: center; font-weight: bold">
                近三年用电数据对比
              </div>
              <div id="four_year" style="width: 500px; height: 300px">
                近三年用电数据对比
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="4">
        <el-row>
          <el-card shadow="always">
            <div id="total_day" style="width: 500px; height: 190px">
              <span style="text-align: center; padding-right: 10px"
                >当日总用电</span
              >
              <i class="el-icon-sunny"></i>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card>
            <div id="total_year" style="width: 500px; height: 190px">
              <span style="text-align: center; padding-right: 10px"
                >当月总用电</span
              >
              <i class="el-icon-stopwatch"></i>
            </div>
          </el-card>
        </el-row>
        <el-row>
          <el-card>
            <div id="total_four" style="width: 500px; height: 200px">
              <span style="text-align: center; padding-right: 10px"
                >当年总用电</span
              >
              <i class="el-icon-timer"></i>
            </div>
          </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "ElectricityVisualization",
  data() {
    return {
      id: 2,
      departments: [],
      department: {},
    };
  },
  created() {
    this.getDepartments();
    this.getDepartment(this.id);
  },
  watch: {
    id(newId) {
      this.getDepartment(newId);
      this.showDayEcharts();
      this.showYearEcharts();
      this.showThreeYearEcharts();
    }
  },
  methods: {
    getDepartment(id) {
      this.request.get("/department/departmentIfo/" + id).then((res) => {
        this.department = res.data;
        console.log(this.department);
      });
    },
    getDepartments() {
      this.request.get("/department/search").then((res) => {
        this.departments = res;
      });
    },
    showDayEcharts() {
      var chartDomDay = document.getElementById("day");
      var myChartDay = echarts.init(chartDomDay);
      var option_day;

      option_day = {
        title: {
          text: "24小时用电值趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          data: [
            "总用电",
            "照明插座系统",
            "动力系统",
            "暖通空调系统",
            "特殊区域用电",
          ],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "1%",
          right: "1%",
          bottom: "2%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: [
              "13:00-15:00",
              "15:00-17:00",
              "17:00-19:00",
              "19:00-21:00",
              "21:00-23:00",
              "23:00-1:00",
              "1:00-3:00",
              "3:00-5:00",
              "5:00-7:00",
              "7:00-9:00",
              "9:00-11:00",
              "11:00-13:00",
            ],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "总用电",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "照明插座系统",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "动力系统",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "暖通空调系统",
            type: "line",
            stack: "Total",
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "特殊区域用电",
            type: "line",
            stack: "Total",
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {},
            emphasis: {
              focus: "series",
            },
            data: [],
          },
        ],
      };
      this.request.get("/echarts/departmentIfo/" + this.id).then((res) => {
        option_day.series[0].data = res.data[0];
        option_day.series[1].data = res.data[1];
        option_day.series[2].data = res.data[2];
        option_day.series[3].data = res.data[3];
        option_day.series[4].data = res.data[4];
        myChartDay.setOption(option_day);
      });
    },
    showYearEcharts() {
      var chartDomYear = document.getElementById("year");
      var myChartYear = echarts.init(chartDomYear);
      var option_year;

      option_year = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        grid: {
          left: "0%",
          right: "5%",
          bottom: "1%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月",
            ],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            name: "总用电",
            type: "bar",
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "暖通空调系统",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "照明插座系统",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "动力系统",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "特殊区域用电 ",
            type: "bar",
            stack: "Ad",
            emphasis: {
              focus: "series",
            },
            data: [],
          },
        ],
      };
      this.request.get("/echarts/yearDepartmentIfo/" + this.id).then((res) => {
        if (res.code === "200") {
          option_year.series[0].data = res.data[0];
          option_year.series[1].data = res.data[3];
          option_year.series[2].data = res.data[1];
          option_year.series[3].data = res.data[2];
          option_year.series[4].data = res.data[4];
        }
        myChartYear.setOption(option_year);
      });
    },
    showThreeYearEcharts() {
      var app = {};

      var chartDom = document.getElementById("four_year");
      var myChart = echarts.init(chartDom);
      var option_threeYear;

      option_threeYear = {
        legend: {},
        tooltip: {},
        grid: {
          left: "1%",
          right: "5%",
          bottom: "2%",
          containLabel: true,
        },
        dataset: {
          source: [
            ["product", "2021", "2022", "2023"],
            ["01", 43.3, 85.8, 200.2],
            ["02", 83.1, 73.4, 55.1],
            ["03", 86.4, 65.2, 82.5],
            ["05", 72.4, 53.9, 39.1],
            ["06", 72.4, 53.9, 39.1],
            ["07", 72.4, 53.9, 39.1],
            ["08", 72.4, 53.9, 39.1],
            ["09", 72.4, 53.9, 39.1],
            ["10", 72.4, 53.9, 39.1],
            ["11", 72.4, 53.9, 39.1],
            ["12", 72.4, 53.9, 39.1],
          ],
        },
        xAxis: { type: "category" },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
      };
      var i;
      for (i = 1; i <= 12; i++) {
        option_threeYear.dataset.source[i] = [];
        option_threeYear.dataset.source[i][0] = '0' + i;
      }
      this.request.get("/echarts/source/" + this.id).then((res) => {
        if (res.code === "200") {
          option_threeYear.dataset.source[0][1] = res.data.dataYear[2];
          option_threeYear.dataset.source[0][2] = res.data.dataYear[1];
          option_threeYear.dataset.source[0][3] = res.data.dataYear[0];
          var i, j;
          for (i = 1; i <= 12; i++) {
            for (j = 1; j <= 3; j++) {
              option_threeYear.dataset.source[i][j] =
                res.data.list[j - 1][i - 1];
            }
          }
          console.log(option_threeYear.dataset.source);
        }
        myChart.setOption(option_threeYear);
      });
    },
  },
  mounted() {
    this.showDayEcharts();
    this.showYearEcharts();
    this.showThreeYearEcharts();
  },
};
</script>

<style scoped>
.my-label {
  background: rgb(29, 234, 18) f;
}
.visualization {
  display: flex;
  flex-wrap: wrap;
}

.chart-container {
  flex: 1;
  margin: 10px;
}

.total-data {
  width: 100%;
  text-align: center;
}
</style>
