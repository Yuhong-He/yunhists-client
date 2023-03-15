<template>
  <div class="thesis-list">
    <div class="thesis-header">
      <el-row>
        <el-col :span="10" class="thesis-btn-left">
          <el-input v-model="titleVal" :placeholder="$t('thesis.searchTitle')" @change="changeQuery(titleVal)" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchTitle"></el-button>
          </el-input>
          <el-button type="primary" class="advanced-search-btn" @click="openAdvancedSearch = true" plain>{{ $t('thesis.advancedSearch') }}</el-button>
        </el-col>
        <el-col :span="14" class="thesis-btn-right">
          <el-button v-if="this.userRights >= 1" type="warning" @click="openOperateDrawer" plain>
            {{ $t('thesis.operation') }}<font-awesome-icon class="btn-icon" icon="fa-solid fa-screwdriver-wrench" />
          </el-button>
          <el-button v-if="this.userRights >= 1" type="primary" @click="toAddPage" plain>
            {{ $t('thesis.add') }}<font-awesome-icon class="btn-icon" icon="fa-solid fa-plus" />
          </el-button>
          <el-button v-if="this.userRights === 0" type="warning" @click="toUploadPage" plain>
            {{ $t('thesis.upload') }}<font-awesome-icon class="btn-icon" icon="fa-solid fa-upload" />
          </el-button>
          <el-button v-if="tableData.length > 0" type="success" plain @click="prepareExport">
            {{ $t('thesis.export') }}<font-awesome-icon class="btn-icon" icon="fa-solid fa-file-export" />
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

    <el-drawer
        :visible.sync="operateTheses"
        direction="rtl"
        ref="drawer"
    >
      <div class="thesis-list-operate-drawer">
        <div class="thesis-list-operate-drawer-header">
          <span>{{ $t('thesis.batchOperate') }}</span>
        </div>
        <div class="thesis-list-operate-drawer-info">
          <p style="font-weight: bold;">{{ $t('thesis.forFollowingTheses') }}</p>
          <ul>
            <li v-for="item in this.selectedTheses">{{ item.title }}</li>
          </ul>
        </div>
        <div class="thesis-list-choose-operate">
          <el-collapse v-model="chooseOperate" accordion>
            <el-collapse-item :title="$t('thesis.addNewCommonParentCats')" name="1">
              <div class="thesis-list-operate-drawer-select">
                <CategorySelector style="width: 100%;" @getCategories="getCategories"></CategorySelector>
              </div>
              <div class="thesis-list-operate-drawer-btn">
                <el-button @click="operateTheses = false">{{ $t('thesis.cancel') }}</el-button>
                <el-button type="primary" @click="updateTheses">{{ $t('category.confirm') }}</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-drawer>

    <el-dialog :title="$t('thesis.export')" :visible.sync="openExportPanel" width="30%">
      <div>{{ $t('thesis.exportInfo') }}</div>
      <div style="text-align: center; padding-top: 30px">
        <el-radio-group v-model="exportFormat" size="small" fill="#FF8000">
          <el-radio-button label="xls"></el-radio-button>
          <el-radio-button label="csv"></el-radio-button>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <div style="display: inline-flex">
          <el-button @click="openExportPanel = false" style="margin-right: 10px">{{ $t('thesis.cancel') }}</el-button>
          <download-excel v-if="exportFormat === 'xls'" :data="exportData" name="data.xls">
            <el-button type="primary" @click="openExportPanel = false">{{ $t('thesis.confirm') }}</el-button>
          </download-excel>
          <downloadCSV v-if="exportFormat === 'csv'" :data="exportData" name="data.csv">
            <el-button type="primary" @click="openExportPanel = false">{{ $t('thesis.confirm') }}</el-button>
          </downloadCSV>
        </div>
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
import CategorySelector from "@/components/CategorySelector.vue";
import {generateErrorMsg} from "@/utils/category";
import {generalError, getTitle, unexpectedError} from "@/utils/general";

export default {
  computed: {
    ...mapState('User', ['userRights']),
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
    CategorySelector,
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
      },
      operateTheses: false,
      newCategoriesId: [],
      newCategories: [],
      chooseOperate: 1,
      openExportPanel: false,
      exportFormat: "xls",
      exportData: []
    }
  },
  created() {
    document.title = getTitle("thesisList");
    this.getThesisList();
  },
  watch: {
    '$i18n.locale'() {
      document.title = getTitle("thesisList");
      this.refreshRoute();
    },
    '$route': 'getThesisList'
  },
  methods: {
    i18n() {
      return i18n
    },
    getThesisList() {
      if(Object.getOwnPropertyNames(this.$route.query).length === 0) {
        this.refreshRoute();
      } else {
        this.initialData();
        this.refreshRoute();
        this.$api.getThesisList(this.page, this.pageSize, this.query, this.sortCol, this.sortOrder).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data.records;
            this.total = res.data.data.total;
            this.loading = false;
            window.scrollTo(0, 0);
          } else {
            generalError(res.data);
          }
        }).catch(res => {
          unexpectedError(res);
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
    toAddPage() {
      this.$router.push("/thesis/add");
    },
    toUploadPage() {
      this.$router.push("/thesis/upload");
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
    getSortCol(val) {
      this.sortCol = val.sortCol;
      this.sortOrder = val.sortOrder;
      this.page = 1;
      this.refreshRoute();
    },
    getSelection(val) {
      this.selectedTheses = val;
    },
    openOperateDrawer() {
      if(!_.isEmpty(this.selectedTheses)) {
        this.operateTheses = true;
      } else {
        this.$message({
          message: i18n.tc('thesis.selectThesis'),
          type: 'warning'
        });
      }
    },
    getCategories(val) {
      this.newCategoriesId = val;
      if(!_.isEmpty(this.newCategoriesId)) {
        this.getNewCategoryNames(val.toString());
      }
    },
    getNewCategoryNames(val) {
      this.$api.getCategoryByIds(val).then(res => {
        if(res.data.code === 200) {
          this.newCategories = res.data.data;
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    updateTheses() {
      if(!_.isEmpty(this.newCategoriesId)) {
        const childTheses = [];
        this.selectedTheses.forEach(e => {
          childTheses.push(e.id);
        });
        this.addCatALot(childTheses, this.newCategoriesId);
      } else {
        this.$alert(i18n.tc('thesis.selectParentCat'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
      }
    },
    addCatALot(childTheses, parentCat) {
      this.$api.addCatALot({"categories": [], "theses": childTheses, "parentCats": parentCat}).then(res => {
        if(res.data.code === 200) {
          if(_.isEmpty(res.data.data.failed)) {
            this.operateTheses = false;
            this.$message({
              message: i18n.tc('thesis.batchSuccess'),
              type: 'success'
            });
            this.getThesisList();
          } else {
            this.operateTheses = false;
            const errorMsg = generateErrorMsg(res.data.data.failed, {}, this.selectedTheses, this.newCategories);
            this.$notify.error({
              title: i18n.tc('thesis.error'),
              dangerouslyUseHTMLString: true,
              duration: 0,
              message: errorMsg
            });
            this.getThesisList();
          }
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    prepareExport() {
      this.exportData = [];
      for(let item of this.tableData) {
        const obj = {
          author: item.author,
          title: item.title,
          publication: item.publication,
          year: item.thesisIssue.year,
          volume: item.thesisIssue.volume,
          issue: item.thesisIssue.issue
        };
        this.exportData.push(obj);
      }
      this.openExportPanel = true;
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
    .btn-icon {
      padding-left: 5px;
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
.thesis-list-operate-drawer {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  padding-left: 10%;
  padding-right: 10%;
  .thesis-list-operate-drawer-header {
    font-size: 1.5em;
    font-weight: bold;
    line-height: 50px;
  }
  .thesis-list-operate-drawer-info {
    text-align: left;
    font-size: 1.2em;
    line-height: 25px;
    ul {
      list-style-type: circle;
    }
  }
  .thesis-list-choose-operate {
    margin-top: 10px;
    .thesis-list-operate-drawer-select {
      margin: 10px;
    }
    .thesis-list-operate-drawer-btn {
      margin-top: 20px;
    }
  }
}
</style>