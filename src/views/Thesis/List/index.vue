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
          <el-button v-if="userRights >= 1" type="warning" @click="openOperateDrawer" plain>
            {{ $t('thesis.operation') }}
          </el-button>
          <el-button v-if="userRights >= 1" type="primary" @click="toAddPage" plain>
            {{ $t('thesis.add') }}
          </el-button>
          <el-button v-if="userRights === 0" type="warning" @click="toSharePage" plain>
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
      <el-table :data="tableData" border style="width: 100%" :empty-text="$t('thesis.noData')" v-loading="loading"
                @selection-change="changeSelection" @sort-change="changeTableSort">
        <el-table-column v-if="userRights >= 1" type="selection" width="39"></el-table-column>
        <el-table-column prop="author" :label="$t('thesis.author')" width="120" sortable="custom"></el-table-column>
        <el-table-column prop="title" :label="$t('thesis.title')" width="210" sortable="custom"></el-table-column>
        <el-table-column prop="publication" :label="$t('thesis.publication')" width="150" sortable="custom"></el-table-column>
        <el-table-column prop="thesisIssue" :label="$t('thesis.yearIssue')" width="90" sortable="custom">
          <template v-slot="scope">
            {{ handleThesisIssue(scope.row.thesisIssue) }}
          </template>
        </el-table-column>
        <el-table-column prop="categories" style="min-width: 210px;" :label="$t('thesis.category')">
          <template v-slot="scope">
            <ul>
              <li v-for="category of scope.row.categories">
                <el-link :href="'/category/id/' + category.id">
                  <span v-if="$i18n.locale === 'zh'">{{ category.zhName }}</span>
                  <span v-if="$i18n.locale === 'en'">{{ category.enName }}</span>
                </el-link>
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column :label="$t('thesis.operation')" :width="operation_col_width">
          <template v-slot="scope">
            <el-button size="mini" icon="el-icon-s-management" @click="citeThesis(scope.row.id)" plain circle></el-button>
            <el-button size="mini" icon="el-icon-download" @click="thesisOnlinePublishInfo(scope.row.id)" type="success" plain circle></el-button>
            <el-button v-if="userRights >= 1" size="mini" icon="el-icon-edit" type="primary" plain circle></el-button>
            <el-button v-if="userRights >= 1" size="mini" icon="el-icon-delete" type="danger" plain circle></el-button>
          </template>
        </el-table-column>
      </el-table>
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

    <el-dialog :title="$t('thesis.reference')" :lock-scroll="false" :append-to-body="true" :visible.sync="openCitePanel" width="60%" top="8vh">
      <el-form :model="citeForm">
        <el-form-item :label="$t('thesis.vancouver')">
          <el-input v-model="citeForm.vancouver" autocomplete="off" readonly>
            <el-popover
                slot="append"
                placement="right"
                trigger="click">
              <div style="text-align: center;">{{ $t('thesis.copySuccess') }}</div>
              <el-button slot="reference" icon="el-icon-copy-document" @click="copyReference(citeForm.vancouver)"></el-button>
            </el-popover>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.harvard')">
          <el-input v-model="citeForm.harvard" autocomplete="off" readonly>
            <el-popover
                slot="append"
                placement="right"
                trigger="click">
              <div style="text-align: center;">{{ $t('thesis.copySuccess') }}</div>
              <el-button slot="reference" icon="el-icon-copy-document" @click="copyReference(citeForm.harvard)"></el-button>
            </el-popover>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.gbt7714')">
          <el-input v-model="citeForm.gbt7714" autocomplete="off" readonly>
            <el-popover
                slot="append"
                placement="right"
                trigger="click">
              <div style="text-align: center;">{{ $t('thesis.copySuccess') }}</div>
              <el-button slot="reference" icon="el-icon-copy-document" @click="copyReference(citeForm.gbt7714)"></el-button>
            </el-popover>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.wikipedia')">
          <el-input v-model="citeForm.wikipedia" autocomplete="off" readonly>
            <el-popover
                slot="append"
                placement="right"
                trigger="click">
              <div style="text-align: center;">{{ $t('thesis.copySuccess') }}</div>
              <el-button slot="reference" icon="el-icon-copy-document" @click="copyReference(citeForm.wikipedia)"></el-button>
            </el-popover>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="openCitePanel = false">{{ $t('thesis.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('thesis.downloadThesis')" :lock-scroll="false" :append-to-body="true" :visible.sync="openDownloadPanel" width="30%">
      <div class="online-publish-info"><span v-if="$i18n.locale === 'zh'">《{{ this.title }}》</span><span style="font-style: oblique;" v-else>{{ this.title }}</span>{{ this.copyright }}<span v-if="this.onlinePublisher.length > 0">{{ $t('thesis.onlinePublisherIs') }}<span class="online-publisher">{{ this.onlinePublisher }}</span></span><span v-if="this.onlinePublisher.length > 0">{{ $t('thesis.pleaseClick') }}<a :href="this.url" target="_blank">{{ $t('thesis.link') }}</a>{{ $t('thesis.goToPublisherPage') }}<span v-if="this.copyrightStatus === 0">{{ $t('thesis.purchase') }}</span><span v-else>{{ $t('thesis.toDownload') }}</span></span>{{ $t('thesis.dote') }}</div>
      <div v-if="this.copyrightStatus === 2" style="margin-top: 20px;">{{ $t('thesis.weHaveResource') }}<span class="span-link" v-if="userRights === 0 || userRights >= 1" @click="getDownloadInfo()">{{ $t('thesis.click') }}</span><span class="span-link" v-else @click="$router.push('/login')">{{ $t('thesis.login') }}</span>{{ $t('thesis.toDownload') }}{{ $t('thesis.dote') }}</div>
      <div v-else style="margin-top: 20px;">{{ $t('thesis.sorryCopyrightNoResource') }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="openDownloadPanel = false">{{ $t('thesis.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$t('thesis.downloadThesis')" :lock-scroll="false" :append-to-body="true" :visible.sync="confirmDownloadPanel" width="30%">
      <div>{{ $t('thesis.youHave') }}<span style="font-weight: bold; color: green;">{{ this.remain }}</span>{{ $t('thesis.downloadChance') }}</div>
      <div style="margin-top: 20px;">{{ $t('thesis.youCanIncreaseDownload') }}<span class="span-link" @click="toSharePage">{{ $t('thesis.shareThesis') }}</span>{{ $t('thesis.youCanIncreaseDownload2') }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDownloadPanel = false">{{ $t('thesis.cancel') }}</el-button>
        <el-button type="success" @click="doDownload">{{ $t('thesis.download') }}</el-button>
      </div>
    </el-dialog>

    <el-backtop></el-backtop>
  </div>
</template>

<script>
import {mapState} from "vuex";
import i18n from "@/lang";
import _ from "lodash";
import Pagination from "@/components/Pagination.vue";
import {handleThesisIssue} from "@/utils/thesis";
import {authError} from "@/utils/user";
import OSS from "ali-oss";
import {oss} from "@/utils/oss";

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
    Pagination
  },
  data() {
    return {
      loading: true,
      tableData: [],
      operation_col_width: 90,
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
      openCitePanel: false,
      citeForm: {
        vancouver: "",
        harvard: "",
        gbt7714: "",
        wikipedia: ""
      },
      openDownloadPanel: false,
      title: "",
      onlinePublisher: "",
      url: "",
      copyright: "",
      copyrightStatus: 0,
      confirmDownloadPanel: false,
      downloadThesisId: 0,
      remain: 0
    }
  },
  created() {
    this.getThesisList();
  },
  mounted() {
    if(this.userRights >= 1) {
      this.operation_col_width = 163;
    }
  },
  watch: {
    '$i18n.locale'() {
      this.refreshRoute();
    },
  },
  methods: {
    i18n() {
      return i18n
    },
    handleThesisIssue,
    async getThesisList() {
      if(Object.getOwnPropertyNames(this.$route.query).length === 0) {
        this.refreshRoute();
      } else {
        this.initialData();
        this.refreshRoute();
        let res = await this.$api.getThesisList(this.page, this.pageSize, this.query, this.sortCol, this.sortOrder);
        if(res.data.code === 200) {
          this.tableData = res.data.data.records;
          this.total = res.data.data.total;
          this.loading = false;
        }
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
        this.getThesisList();
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
    changeSelection(selection) {
      this.selectedTheses = selection;
    },
    changeTableSort(column) {
      this.sortCol = column.prop;
      if(column.order === "ascending") {
        this.sortOrder = "ASC";
      } else {
        this.sortOrder = "DESC";
      }
      this.page = 1;
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
    async citeThesis(id) {
      let res = await this.$api.getReference(id);
      if(res.data.code === 200) {
        this.citeForm = res.data.data;
        this.openCitePanel = true;
      } else {
        await this.$alert(i18n.tc('thesis.oops'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
      }
    },
    copyReference(val) {
      this.$copyText(val);
    },
    async thesisOnlinePublishInfo(id) {
      this.downloadThesisId = id;
      let res = await this.$api.getOnlinePublishInfo(id);
      if(res.data.code === 200) {
        this.title = res.data.data.title;
        this.onlinePublisher = res.data.data.onlinePublisher;
        this.url = res.data.data.url;
        this.copyrightStatus = res.data.data.copyrightStatus;

        if(i18n.locale !== "zh") {
          if(this.onlinePublisher === "中国知网") {
            this.onlinePublisher = "CNKI";
          } else if(this.onlinePublisher === "维普资讯") {
            this.onlinePublisher = "CQVIP";
          } else if(this.onlinePublisher === "自主出版") {
            this.onlinePublisher = "Self Publish";
          }
        }
        if(this.copyrightStatus === 0) {
          this.copyright = i18n.tc('thesis.publisherAllRights');
        } else if (this.copyrightStatus === 1) {
          this.copyright = i18n.tc('thesis.isOpenAccess');
        } else if (this.copyrightStatus === 2) {
          this.copyright = i18n.tc('thesis.isPublicDomain');
        }
        this.openDownloadPanel = true;
      } else {
        await this.$alert(i18n.tc('thesis.oops'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
      }
    },
    async getDownloadInfo() {
      let res = await this.$api.getDownloadNum();
      if(res.data.code === 200) {
        this.remain = res.data.data.remain;
        this.confirmDownloadPanel = true;
      } else {
        authError(res.data.code);
      }
    },
    async doDownload() {
      let res = await this.$api.getFileName(this.downloadThesisId);
      if(res.data.code === 200) {
        const fileName = res.data.data.file;
        const suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
        const regex = /[\\/:*?"<>|]/g;
        const title = this.title.replaceAll(regex, "_") + "." + suffix;
        const response = {
          'content-disposition': `attachment; filename=${encodeURIComponent(title)}`
        }
        const url = new OSS(oss).signatureUrl(fileName, {response});
        window.open(url, '_blank');
        this.confirmDownloadPanel = false;
        this.openDownloadPanel = false;
      } else if(res.data.code === 401) {
        await this.$alert(i18n.tc('thesis.noMoreDownload'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
      } else if(res.data.code === 407) {
        await this.$alert(i18n.tc('thesis.oops'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
      } else {
        authError(res.data.code);
      }
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
.online-publish-info {
  .online-publisher {
    font-weight: bold;
  }
  a {
    text-decoration: none;
    font-weight: bold;
  }
  a:link {
    color: blue;
  }
  a:visited {
    color: blue;
  }
  a:hover {
    color: dodgerblue;
  }
  a:active {
    color: darkorange;
  }
}
.span-link {
  font-weight: bold;
  color: blue;
  cursor: pointer;
}
.el-dialog__body div {
  word-break: normal;
}
/deep/ .el-table .cell {
  word-break: normal;
}
</style>