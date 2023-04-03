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
              <VueCountUp :start-value="0" :end-value="general.uploadCount" :duration="5"/>
            </template>
          </el-statistic>
        </div>
      </div>
      <div class="time-countdown">
        <div class="note">
          <div style="font-size: 13px; color: dimgrey">{{ $t('statistics.refreshCountdown') }}</div>
          <div style="text-align: center; font-size: 20px; cursor: help">
            <el-popover
                placement="top"
                trigger="hover"
                :content="$t('statistics.refreshCountdownPopup')">
              <span slot="reference">{{ tomorrow }}</span>
            </el-popover>
          </div>
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
<!--      <div class="line-chart-area empty-status">-->
<!--        <el-empty :image="require('@/assets/images/Red-Coming-Soon-Stamp.svg')" :description="$t('statistics.comingSoon')"></el-empty>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import VueCountUp from 'vue-countupjs';
import moment from 'moment';
import 'moment-timezone';
import i18n from "@/lang";
import {generalError, getTitle, unexpectedError} from "@/utils/general";

export default {
  created() {
    document.title = getTitle("statistics");
  },
  components: {
    VueCountUp
  },
  watch: {
    '$i18n.locale'() {
      document.title = getTitle("statistics");
      this.generateThesisCopyrightPieChart();
      this.generateThesisTypePieChart();
    }
  },
  data() {
    return {
      tomorrow: "00:00:00",
      general: {
        categoryCount: null,
        categoryLinkCount: null,
        uploadCount: null,
        thesisCount: null,
        userCount: null
      },
      thesisYear: [],
      thesisYearChart: null,
      thesisTypePieChart: null,
      thesisCopyrightPieChart: null,
      thesisYearChartOption: {},
      thesisCopyrightData: {},
      thesisTypeData: {}
    }
  },
  mounted() {
    this.countdown();
    this.generateContent();
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    countdown() {
      const deadline = moment.utc().add(1, 'days').set({hour: 15, minute: 59, second: 59, millisecond: 0});
      setInterval(() => {
        const offset = moment().utcOffset();
        const diff = deadline.diff(moment().utcOffset(offset), 'seconds');
        const duration = moment.duration(diff, 'seconds');
        const hours = duration.hours().toString().padStart(2, '0');
        const minutes = duration.minutes().toString().padStart(2, '0');
        const seconds = duration.seconds().toString().padStart(2, '0');
        this.tomorrow = hours + ':' + minutes + ':' + seconds;
        if(this.tomorrow === "00:00:00") {
          if(this.$router.currentRoute.name === "Statistics") {
            this.refreshStatistics();
          }
        }
      }, 1000);
    },
    generateContent() {
      this.$api.getStatisticsData().then(res => {
        if(res.data.code === 200) {
          this.general = res.data.data.general;
          this.thesisYear = res.data.data.year;
          this.thesisCopyrightData = res.data.data.copyright;
          this.thesisTypeData = res.data.data.thesisType;
          this.generateYearLineChart();
          this.generateThesisCopyrightPieChart();
          this.generateThesisTypePieChart();
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
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
      if (this.thesisYearChart != null && this.thesisYearChart !== "" && this.thesisYearChart !== undefined) {
        this.thesisYearChart.dispose();
      }
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
      if (this.thesisCopyrightPieChart != null && this.thesisCopyrightPieChart !== "" && this.thesisCopyrightPieChart !== undefined) {
        this.thesisCopyrightPieChart.dispose();
      }
      this.thesisCopyrightPieChart = echarts.init(chartDom);
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
      option && this.thesisCopyrightPieChart.setOption(option);
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
      if (this.thesisTypePieChart != null && this.thesisTypePieChart !== "" && this.thesisTypePieChart !== undefined) {
        this.thesisTypePieChart.dispose();
      }
      this.thesisTypePieChart = echarts.init(chartDom);
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
      option && this.thesisTypePieChart.setOption(option);
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