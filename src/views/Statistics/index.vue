<template>
  <div>
    <div class="statistics-header">
      <div class="general-info-area">
        <div class="general-info-item">
          <el-statistic group-separator="," :title="$t('statistics.thesisCount')">
            <template slot="formatter">
              <VueCountUp :start-value="0" :end-value="general.thesisCount" :duration="5"/>
            </template>
          </el-statistic>
        </div>
        <div class="general-info-item">
          <el-statistic group-separator="," :title="$t('statistics.categoryCount')">
            <template slot="formatter">
              <VueCountUp :start-value="0" :end-value="general.categoryCount" :duration="5"/>
            </template>
          </el-statistic>
        </div>
        <div class="general-info-item">
          <el-statistic group-separator="," :title="$t('statistics.relationshipCount')">
            <template slot="formatter">
              <VueCountUp :start-value="0" :end-value="general.categoryLinkCount" :duration="5"/>
            </template>
          </el-statistic>
        </div>
        <div class="general-info-item">
          <el-statistic group-separator="," :title="$t('statistics.userCount')">
            <template slot="formatter">
              <VueCountUp :start-value="0" :end-value="general.userCount" :duration="5"/>
            </template>
          </el-statistic>
        </div>
        <div class="general-info-item">
          <el-statistic group-separator="," :title="$t('statistics.uploadCount')">
            <template slot="formatter">
              <VueCountUp :start-value="0" :end-value="general.shareCount" :duration="5"/>
            </template>
          </el-statistic>
        </div>
      </div>
      <div class="time-countdown">
        <div class="note">
          <el-statistic ref="statistic" @finish="refreshStatistics" format="HH:mm:ss" :value="tomorrow" :title="$t('statistics.refreshCountdown')" time-indices></el-statistic>
        </div>
      </div>
    </div>
    <div class="statistics-content">
      <div class="line-chart-area">
        <div class="chart-title">{{ $t('statistics.yearLineChartTitle') }}</div>
        <div id="thesis-year-line-chart" style="height: 350px"></div>
      </div>
      <div class="pie-chart-area-group">
        <div class="pie-chart-area">
          <div class="chart-title">{{ $t('statistics.typePieChartTitle') }}</div>
          <div id="thesis-type-pie-chart" style="height: 350px"></div>
        </div>
        <div class="pie-chart-area">
          <div class="chart-title">{{ $t('statistics.copyrightPieChart') }}</div>
          <div id="thesis-copyright-pie-chart" style="height: 350px"></div>
        </div>
      </div>
      <div class="line-chart-area empty-status">
        <el-empty :image="require('@/assets/images/Red-Coming-Soon-Stamp.svg')" :description="$t('statistics.comingSoon')"></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import VueCountUp from 'vue-countupjs';
import i18n from "@/lang";

export default {
  components: {
    VueCountUp
  },
  watch: {
    '$i18n.locale'() {
      this.generateThesisCopyrightPieChart();
      this.generateThesisTypePieChart();
    }
  },
  data() {
    return {
      tomorrow: Date.now() + (new Date().setHours(23, 59, 59) - Date.now()),
      general: {
        categoryCount: null,
        categoryLinkCount: null,
        shareCount: null,
        thesisCount: null,
        userCount: null
      },
      thesisYear: [],
      thesisYearChart: null,
      thesisYearChartOption: {},
      thesisCopyrightData: {},
      thesisTypeData: {}
    }
  },
  mounted() {
    this.generateContent();
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    async generateContent() {
      let res = await this.$api.getStatisticsData();
      if(res.data.code === 200) {
        this.general = res.data.data.general;
        this.thesisYear = res.data.data.year;
        this.thesisCopyrightData = res.data.data.copyright;
        this.thesisTypeData = res.data.data.thesisType;
        this.generateYearLineChart();
        this.generateThesisCopyrightPieChart();
        this.generateThesisTypePieChart();
      }
    },
    handleResize() {
      this.thesisYearChart.resize();
    },
    generateYearLineChart() {
      const x_data = [];
      const y_data = [];
      for(let key in this.thesisYear) {
        x_data.push(key);
        y_data.push(this.thesisYear[key]);
      }

      const chartDom = document.getElementById('thesis-year-line-chart');
      this.thesisYearChart = echarts.init(chartDom);
      this.thesisYearChartOption = {
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          data: x_data
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          formatter: function (params) {
            return i18n.tc('statistics.year') + params.name + '<br/>' + i18n.tc('statistics.count') + params.value;
          }
        },
        series: [
          {
            data: y_data,
            type: 'line',
            smooth: true
          }
        ]
      };
      this.thesisYearChartOption && this.thesisYearChart.setOption(this.thesisYearChartOption);
    },
    generateThesisCopyrightPieChart() {
      const pie_data = [];
      for(let key in this.thesisCopyrightData) {
        let name = "";
        if(i18n.locale === "zh") {
          switch (key) {
            case "allRightsReserved": name = "保留所有权利"; break;
            case "openAccess" : name = "开放获取"; break;
            case "publicDomain" : name = "公有领域"; break;
          }
        } else if(i18n.locale === "en") {
          switch (key) {
            case "allRightsReserved": name = "All Rights Reserved"; break;
            case "openAccess" : name = "Open Access"; break;
            case "publicDomain" : name = "Public Domain"; break;
          }
        }
        const obj = {
          value: this.thesisCopyrightData[key],
          name: name
        }
        pie_data.push(obj);
      }
      const chartDom = document.getElementById('thesis-copyright-pie-chart');
      const myChart = echarts.init(chartDom);
      let option;
      option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: '20'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: pie_data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      option && myChart.setOption(option);
    },
    generateThesisTypePieChart() {
      const pie_data = [];
      for(let key in this.thesisTypeData) {
        let name = "";
        if(i18n.locale === "zh") {
          switch (key) {
            case "journal": name = "期刊论文"; break;
            case "collection" : name = "辑刊论文"; break;
            case "chapter" : name = "专章论文"; break;
            case "newspaper" : name = "报刊论文"; break;
          }
        } else if(i18n.locale === "en") {
          switch (key) {
            case "journal": name = "Journal Paper"; break;
            case "collection" : name = "Collection Paper"; break;
            case "chapter" : name = "Book Chapter"; break;
            case "newspaper" : name = "Newspaper Thesis"; break;
          }
        }
        const obj = {
          value: this.thesisTypeData[key],
          name: name
        }
        pie_data.push(obj);
      }
      const chartDom = document.getElementById('thesis-type-pie-chart');
      const myChart = echarts.init(chartDom);
      let option;
      option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: '20'
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: pie_data,
            label: {
              show: false
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      option && myChart.setOption(option);
    },
    refreshStatistics() {
      this.$message({
        duration: 5000,
        message: i18n.tc('statistics.dataRefreshed'),
        type: 'success'
      });
      this.generateContent();
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style lang="less" scoped>
.statistics-header {
  margin: 30px 10% 10px 10%;
  width: 80%;
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.general-info-area {
  padding-left: 20px;
  padding-right: 40px;
  padding-bottom: 20px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  display: inline-flex;
  flex-wrap: wrap;
  .general-info-item {
    width: 100px;
    margin-top: 20px;
    padding-left: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.time-countdown {
  padding: 20px;
  margin-left: auto;
}
div.note {
  position: relative;
  padding: 20px;
  border: 2px solid #ccc;
  background-color: #fff;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  text-align: justify;
}
div.note:after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 80%;
  border: 10px solid transparent;
  border-top: 10px solid #ccc;
}

.statistics-content {
  margin: 0 10% 30px 10%;
}
.line-chart-area {
  margin-top: 40px;
  height: 400px;
  min-width: 400px;
  border: 2px solid #ccc;
  background-color: #fff;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}
.pie-chart-area-group {
  margin-top: 40px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  justify-items: center;
}
.pie-chart-area {
  width: 400px;
  height: 400px;
  border: 2px solid #ccc;
  background-color: #fff;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}
@media (max-width: 1030px) {
  .pie-chart-area-group {
    grid-template-columns: 1fr;
  }
}
.empty-status {
  display: flex;
  justify-content: center;
  align-items: center;
}
.chart-title {
  text-align: center;
  padding-top: 20px;
  font-size: 1.3em;
}
</style>