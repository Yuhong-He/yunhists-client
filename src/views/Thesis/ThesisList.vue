<template>
  <div class="thesis-list">
    <div class="thesis-header">
      <el-row>
        <el-col :span="12" class="thesis-btn-left">
          <el-input v-model="titleVal" :placeholder="$t('thesis.searchTitle')" @change="changeQuery(titleVal)" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchTitle"></el-button>
          </el-input>
          <el-button type="primary" class="advanced-search-btn" @click="openAdvancedSearch = true" plain>{{ $t('thesis.advancedSearch') }}</el-button>
        </el-col>
        <el-col :span="12" class="thesis-btn-right">
          <el-button v-if="this.userRights >= 1" type="warning" @click="openOperateDrawer" plain>
            {{ $t('thesis.operation') }}
          </el-button>
          <el-button v-if="this.userRights >= 1" type="primary" @click="toAddPage" plain>
            {{ $t('thesis.add') }}
          </el-button>
          <el-button v-if="this.userRights === 0" type="warning" @click="toSharePage" plain>
            {{ $t('thesis.share') }}
          </el-button>
          <el-select v-model="sizeVal" class="page-size-selector" @change="changeSize(sizeVal)">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <div class="thesis-table">
      <ThesisTable :tableData="tableData" :loading="loading" @getSelection="getSelection" @getSortCol="getSortCol" @refreshList="getThesisList"></ThesisTable>
    </div>
    <div class="thesis-pagination">
      <Pagination :total="total" :pageSize="parseInt(pageSize)" :currentPage="parseInt(page)"
                  @getPagination="getPagination"></Pagination>
    </div>

    <el-dialog :title="$t('thesis.advancedSearch')" :visible.sync="openAdvancedSearch" width="30%">
      <el-form :model="searchForm">
        <el-form-item :label="$t('thesis.author')" label-width="80px">
          <el-input v-model="searchForm.author" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.title')" label-width="80px">
          <el-input v-model="searchForm.title" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.publication')" label-width="80px">
          <el-input v-model="searchForm.publication" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.year')" label-width="80px">
          <el-input v-model="searchForm.year" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openAdvancedSearch = false">{{ $t('thesis.cancel') }}</el-button>
        <el-button type="primary" @click="advancedSearch">{{ $t('thesis.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import i18n from "@/lang";
import _ from "lodash";
import ThesisTable from "@/components/ThesisTable.vue";
import Pagination from "@/components/Pagination.vue";

export default {
  computed: {
    ...mapState('UserInfo', ['userRights']),
    options() {
      return [{
        value: '5',
        label: '5' + i18n.tc('thesis.rows')
      }, {
        value: '10',
        label: '10' + i18n.tc('thesis.rows')
      }, {
        value: '20',
        label: '20' + i18n.tc('thesis.rows')
      }, {
        value: '50',
        label: '50' + i18n.tc('thesis.rows')
      }, {
        value: '100',
        label: '100' + i18n.tc('thesis.rows')
      }]
    }
  },
  components: {
    ThesisTable,
    Pagination
  },
  data() {
    return {
      loading: true,
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      sortCol: '',
      sortOrder: '',
      sizeVal: '',
      selectedTheses: {},
      titleVal: "",
      query: {
        author: "",
        title: "",
        publication: "",
        year: ""
      },
      searchForm: {
        author: "",
        title: "",
        publication: "",
        year: ""
      },
      openAdvancedSearch: false,
      citeForm: {
        vancouver: "",
        harvard: "",
        gbt7714: "",
        wikipedia: ""
      }
    }
  },
  created() {
    this.getThesisList();
  },
  watch: {
    '$i18n.locale'() {
      this.refreshRoute();
    },
    '$route': 'getThesisList'
  },
  methods: {
    i18n() {
      return i18n
    },
    async getThesisList() {
      if(Object.getOwnPropertyNames(this.$route.query).length === 0) {
        this.refreshRoute();
      } else {
        this.initialData();
        this.refreshRoute();
        await this.$api.getThesisList(this.page, this.pageSize, this.query, this.sortCol, this.sortOrder).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.records;
            this.total = res.data.data.total;
            this.loading = false;
          }
        }).catch(() => {
          this.$message.error(i18n.tc('thesis.invalidParamInPath'));
          this.$router.push("/");
        });
      }
    },
    initialData() {
      this.page = this.$route.query.page;
      this.pageSize = this.$route.query.size;
      this.sizeVal = this.pageSize;
      this.query.author = this.$route.query.author;
      this.query.title = this.$route.query.title;
      this.titleVal = this.$route.query.title;
      this.query.publication = this.$route.query.publication;
      this.query.year = this.$route.query.year;
      this.sortCol = this.$route.query.sortCol;
      this.sortOrder = this.$route.query.sortOrder;
    },
    refreshRoute() {
      const obj = {
        lang: i18n.locale,
        page: this.page.toString(),
        size: this.pageSize.toString(),
        author: this.query.author,
        title: this.query.title,
        publication: this.query.publication,
        year: this.query.year,
        sortCol: this.sortCol,
        sortOrder: this.sortOrder
      }
      if(!_.isEqual(this.$route.query, obj)) {
        this.$router.push({
          path: '/thesis/list',
          query: obj
        });
      }
    },
    changeQuery(val) {
      this.query.title = val;
      this.query.author = "";
      this.query.publication = "";
      this.query.year = "";
      this.refreshRoute();
    },
    searchTitle() {
      this.query.title = this.titleVal;
      this.query.author = "";
      this.query.publication = "";
      this.query.year = "";
      this.page = 1;
      this.refreshRoute();
    },
    openOperateDrawer() {
      console.log("openOperateDrawer()");
    },
    toAddPage() {
      this.$router.push("/thesis/add");
    },
    toSharePage() {
      this.$router.push("/thesis/share");
    },
    changeSize(val) {
      this.page = 1;
      this.pageSize = val;
      this.refreshRoute();
    },
    getPagination(page) {
      this.page = page;
      this.refreshRoute();
    },
    advancedSearch() {
      this.titleVal = "";
      this.query = this.searchForm;
      this.searchForm = {
        author: "",
        title: "",
        publication: "",
        year: ""
      };
      this.openAdvancedSearch = false;
      this.refreshRoute();
    },
    getSelection(val) {
      this.selectedTheses = val;
      console.log(this.selectedTheses);
    },
    getSortCol(val) {
      this.sortCol = val.sortCol;
      this.sortOrder = val.sortOrder;
      this.page = 1;
      this.refreshRoute();
    }
  }
}
</script>

<style lang="less" scoped>
.thesis-list {
  min-height: 500px;
  margin-top: 30px;
  margin-left:  10%;
  margin-right: 10%;
}
.thesis-header {
  .thesis-btn-left {
    display: inline-flex;
    .advanced-search-btn {
      margin-left: 10px;
    }
  }
  .thesis-btn-right {
    text-align: right;
    .page-size-selector {
      margin-left: 10px;
      width: 120px;
    }
  }
}
.thesis-table {
  margin-top: 25px;
  min-height: 420px;
}
.thesis-pagination {
  font-size: 1.5em;
  line-height: 50px;
  margin-top: 10px;
  padding-top: 10px;
  text-align: center;
}
.el-dialog__body div {
  word-break: normal;
}
</style>