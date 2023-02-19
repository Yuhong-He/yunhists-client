<template>
  <div class="thesis-list">
    <div class="thesis-header">
      <el-row>
        <el-col :span="4">
          <span class="thesis-list-title">论文列表</span>
        </el-col>
        <el-col :span="8">
          <el-input v-model="query.title" placeholder="搜索标题" @change="changeQuery(query.title)" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchTitle"></el-button>
          </el-input>
        </el-col>
        <el-col :span="12" class="thesis-btn-right">
          <el-button v-if="this.userRights >= 1" type="warning" @click="openOperateDrawer" plain>
            操作
          </el-button>
          <el-button v-if="this.userRights >= 1" type="primary" @click="toAddPage" plain>
            新增
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
      <el-table :data="tableData" border style="width: 100%" empty-text="暂无数据"
                @selection-change="changeSelection" @sort-change="changeTableSort">
        <el-table-column v-if="this.userRights >= 1" type="selection" width="39"></el-table-column>
        <el-table-column prop="author" label="作者" width="120" sortable="custom"></el-table-column>
        <el-table-column prop="title" label="标题" width="270" sortable="custom"></el-table-column>
        <el-table-column prop="publication" label="刊物" width="240" sortable="custom"></el-table-column>
        <el-table-column prop="thesisIssue" label="年期" width="90" sortable="custom">
          <template v-slot="scope">
            {{ handleThesisIssue(scope.row.thesisIssue) }}
          </template>
        </el-table-column>
        <el-table-column prop="categories" label="分类">
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
        <el-table-column label="Operation" width="163">
          <template v-slot="scope">
            <el-button size="mini" icon="el-icon-s-management" plain circle></el-button>
            <el-button size="mini" icon="el-icon-download" type="success" plain circle></el-button>
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

    <el-backtop></el-backtop>
  </div>
</template>

<script>
import {mapState} from "vuex";
import i18n from "@/lang";
import _ from "lodash";
import Pagination from "@/components/Pagination.vue";
import {handleThesisIssue} from "@/utils/thesis";

export default {
  computed: {
    ...mapState('UserInfo', ['userRights']),
    options() {
      return [{
        value: '5',
        label: '5行'
      }, {
        value: '10',
        label: '10行'
      }, {
        value: '20',
        label: '20行'
      }, {
        value: '50',
        label: '50行'
      }, {
        value: '100',
        label: '100行'
      }]
    }
  },
  components: {
    Pagination
  },
  data() {
    return {
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      sortCol: '',
      sortOrder: '',
      sizeVal: '',
      selectedTheses: {},
      query: {
        author: "",
        title: "",
        publication: "",
        year: ""
      }
    }
  },
  created() {
    this.getThesisList();
  },
  watch: {
    '$i18n.locale'() {
      this.refreshRoute();
    }
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
        }
      }
    },
    initialData() {
      this.page = this.$route.query.page;
      this.pageSize = this.$route.query.size;
      this.sizeVal = this.pageSize;
      this.catName = this.$route.query.query;
      this.sortCol = this.$route.query.sortCol;
      this.sortOrder = this.$route.query.sortOrder;
    },
    refreshRoute() {
      const obj = {
        lang: i18n.locale,
        page: this.page.toString(),
        size: this.pageSize.toString(),
        query: this.thesisTitle,
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
      this.refreshRoute();
    },
    searchTitle() {
      this.page = 1;
      this.refreshRoute();
    },
    openOperateDrawer() {
      console.log("openOperateDrawer()");
    },
    toAddPage() {
      this.$router.push("/thesis/add");
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
  line-height: 50px;
  .thesis-list-title {
    font-size: 2em;
    font-weight: bold;
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
  margin-top: 10px;
  min-height: 420px;
}
.thesis-pagination {
  font-size: 1.5em;
  line-height: 50px;
  margin-top: 10px;
  padding-top: 10px;
  text-align: center;
}
</style>