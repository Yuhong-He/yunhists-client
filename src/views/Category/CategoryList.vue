<template>
  <div class="category-list">
    <div class="category-header">
      <el-row>
        <el-col :span="12" class="category-btn-left">
          <el-input v-model="catName" :placeholder="$t('category.searchCatName')" @change="changeQuery(catName)" clearable>
            <el-button slot="append" icon="el-icon-search" @click="searchTitle"></el-button>
          </el-input>
          <el-button type="primary" class="home-cat-btn" @click="$router.push('/category/id/1')" plain>{{ $t('category.homeCat') }}</el-button>
        </el-col>
        <el-col :span="12" class="category-btn-right">
          <el-button v-if="this.userRights >= 1" type="warning" @click="openOperateDrawer" plain>
            {{ $t('category.operate') }}
          </el-button>
          <el-button v-if="this.userRights >= 1" type="primary" @click="toAddPage" plain>
            {{ $t('category.add') }}
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
    <div class="category-table">
      <CategoryTable :tableData="tableData" :loading="loading" @getSelection="getSelection" @getSortCol="getSortCol"></CategoryTable>
    </div>
    <div class="category-pagination">
      <Pagination :total="total" :pageSize="parseInt(pageSize)" :currentPage="parseInt(page)"
                  @getPagination="getPagination"></Pagination>
    </div>
    <el-drawer
        :visible.sync="operateCats"
        direction="rtl"
        ref="drawer"
    >
      <div class="category-list-operate-drawer">
        <div class="category-list-operate-drawer-header">
          <span>{{ $t('category.batchOperate') }}</span>
        </div>
        <div class="category-list-operate-drawer-info">
          <p style="font-weight: bold;">{{ $t('category.forFollowingCats') }}</p>
          <ul>
            <li v-for="item in this.selectedCats" v-if="$i18n.locale === 'zh'">{{ item.zhName }}</li>
            <li v-for="item in this.selectedCats" v-if="$i18n.locale === 'en'">{{ item.enName }}</li>
          </ul>
        </div>
        <div class="category-list-choose-operate">
          <el-collapse v-model="chooseOperate" accordion>
            <el-collapse-item :title="$t('category.addNewCommonParentCats')" name="1">
              <div class="category-list-operate-drawer-select">
                <CategorySelector style="width: 100%;" @getCategories="getCategories"></CategorySelector>
              </div>
              <div class="category-list-operate-drawer-btn">
                <el-button @click="operateCats = false">{{ $t('category.cancel') }}</el-button>
                <el-button type="primary" @click="updateCategories">{{ $t('category.confirm') }}</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

      </div>
    </el-drawer>

    <el-backtop></el-backtop>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import i18n from "@/lang";
import _ from "lodash";
import CategoryTable from "@/components/CategoryTable.vue";
import Pagination from "@/components/Pagination.vue";
import CategorySelector from "@/components/CategorySelector.vue";
import {authError} from "@/utils/user";

export default {
  data() {
    return {
      loading: true,
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 10,
      catName: "",
      sizeVal: '',
      sortCol: '',
      sortOrder: '',
      selectedCats: {},
      operateCats: false,
      newCategoriesId: [],
      newCategories: [],
      chooseOperate: 1
    }
  },
  components: {
    CategoryTable,
    Pagination,
    CategorySelector
  },
  computed: {
    ...mapState('UserInfo', ['userRights']),
    ...mapState('Settings', ['categoryListTips']),
    options() {
      return [{
        value: '5',
        label: '5' + i18n.tc('category.rows')
      }, {
        value: '10',
        label: '10' + i18n.tc('category.rows')
      }, {
        value: '20',
        label: '20' + i18n.tc('category.rows')
      }, {
        value: '50',
        label: '50' + i18n.tc('category.rows')
      }, {
        value: '100',
        label: '100' + i18n.tc('category.rows')
      }]
    }
  },
  created() {
    this.getCategoryList();
  },
  watch: {
    '$i18n.locale'() {
      this.refreshRoute();
    }
  },
  mounted() {
    if(this.categoryListTips === "") {
      this.showTips();
    }
  },
  methods: {
    ...mapMutations('Settings', ['setCategoryListTips']),
    async getCategoryList() {
      if(Object.getOwnPropertyNames(this.$route.query).length === 0) {
        this.refreshRoute();
      } else {
        this.initialData();
        this.refreshRoute();
        await this.$api.getCategoryList(i18n.locale, this.page,
            this.pageSize, this.catName, this.sortCol, this.sortOrder).then(res => {
          if(res.data.code === 200) {
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
      this.catName = this.$route.query.query;
      this.sortCol = this.$route.query.sortCol;
      this.sortOrder = this.$route.query.sortOrder;
    },
    refreshRoute() {
      const obj = {
        lang: i18n.locale,
        page: this.page.toString(),
        size: this.pageSize.toString(),
        query: this.catName,
        sortCol: this.sortCol,
        sortOrder: this.sortOrder
      }
      if(!_.isEqual(this.$route.query, obj)) {
        this.$router.push({
          path: '/category/list',
          query: obj
        });
        this.getCategoryList();
      }
    },
    searchTitle() {
      this.page = 1;
      this.refreshRoute();
    },
    toAddPage() {
      this.$router.push("/category/add");
    },
    changeSize(val) {
      this.page = 1;
      this.pageSize = val;
      this.refreshRoute();
    },
    changeQuery(val) {
      this.catName = val;
      this.refreshRoute();
    },
    getPagination(page) {
      this.page = page;
      this.refreshRoute();
    },
    openOperateDrawer() {
      this.checkToken();
      if(!_.isEmpty(this.selectedCats)) {
        this.operateCats = true;
      } else {
        this.$message({
          message: i18n.tc('category.selectCategory'),
          type: 'warning'
        });
      }
    },
    async checkToken() {
      let res = await this.$api.validateToken();
      if(res.data.code !== 200) {
        authError(res.data.code);
      }
    },
    getCategories(val) {
      this.newCategoriesId = val;
      this.getNewCategoryNames(val.toString());
    },
    updateCategories() {
      if(!_.isEmpty(this.newCategoriesId)) {
        const childCat = [];
        this.selectedCats.forEach(e => {
          childCat.push(e.id);
        });
        this.addCatALot(childCat, this.newCategoriesId);
      } else {
        this.$alert(i18n.tc('category.selectParentCat'), {
          confirmButtonText: i18n.tc('category.confirm'),
          callback: () => {}
        });
      }
    },
    async addCatALot(childCat, parentCat) {
      let res = await this.$api.addCatALot({"categories": childCat, "theses": [], "parentCats": parentCat});
      if(res.data.code === 200) {
        if(_.isEmpty(res.data.data.failed)) {
          this.operateCats = false;
          this.$message({
            message: i18n.tc('category.batchSuccess'),
            type: 'success'
          });
          await this.getCategoryList();
        } else {
          this.operateCats = false;
          const errorMsg = this.generateErrorMsg(res.data.data.failed);
          this.$notify.error({
            title: i18n.tc('category.error'),
            dangerouslyUseHTMLString: true,
            duration: 0,
            message: errorMsg
          });
          await this.getCategoryList();
        }
      } else {
        authError(res.data.code);
      }
    },
    async getNewCategoryNames(val) {
      let res = await this.$api.getCategoryByIds(val);
      if(res.data.code === 200) {
        this.newCategories = res.data.data;
      }
    },
    generateErrorMsg(val) {
      let msg = "<p><span style='font-weight: bold'>" + i18n.tc('category.followingFails') +
          "</span>" + "</p><p><ul style='list-style-type: circle;'>";
      val.forEach(ele => {
        if(ele.reason === 1) { // child cat not exist
          const childCat = this.getCatName(ele.catFromId, this.selectedCats);
          msg += "<li>" + i18n.tc('category.selectedCat') + "<span style='font-weight: bold; color: darkgreen;'>" +
              childCat + "</span>" + i18n.tc('category.notInDatabase') + "</li>";
        } else if (ele.reason === 2) { // parent cat not exist
          const parentCat = this.getCatName(ele.catToId, this.newCategories);
          msg += "<li>" + i18n.tc('category.selectedCat') + "<span style='font-weight: bold; color: darkgreen;'>" +
              parentCat + "</span>" + i18n.tc('category.notInDatabase') + "</li>";
        } else {
          const childCat = this.getCatName(ele.catFromId, this.selectedCats);
          const parentCat = this.getCatName(ele.catToId, this.newCategories);
          const reason = this.generateFailReason(ele.reason);
          msg += "<li><span style='font-weight: bold; color: darkgreen;'>" + childCat + "</span>" +
              i18n.tc('category.connectTo') + "<span style='font-weight: bold; color: darkgreen;'>" +
              parentCat + "</span>" + i18n.tc('category.failedBecause') + reason + "</li>";
        }
      });
      msg += "</ul></p>";
      return msg;
    },
    getCatName(val, obj) {
      let name = "ERROR";
      for(const ele of obj) {
        if(ele.id === val) {
          if(i18n.locale === "zh") {
            name = ele.zhName;
          } else {
            name = ele.enName;
          }
          break;
        }
      }
      return name;
    },
    generateFailReason(val) {
      if(val === 3) {
        return i18n.tc('category.canNotBeCatItself');
      } else if(val === 4) {
        return i18n.tc('category.relationExist');
      }
    },
    showTips() {
      this.$notify({
        title: i18n.tc('category.tips'),
        message: i18n.tc('category.clickGoToDetailPage'),
        duration: 0
      });
      this.setCategoryListTips("ok");
    },
    getSelection(val) {
      this.selectedCats = val;
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
.category-list {
  min-height: 500px;
  margin-top: 30px;
  margin-left:  10%;
  margin-right: 10%;
}
.category-header {
  line-height: 50px;
  .category-btn-left {
    display: inline-flex;
    .home-cat-btn {
      margin-left: 10px;
    }
  }
  .category-btn-right {
    text-align: right;
    .page-size-selector {
      margin-left: 10px;
      width: 120px;
    }
  }
}
.category-table {
  margin-top: 10px;
  min-height: 420px;
}
.category-pagination {
  font-size: 1.5em;
  line-height: 50px;
  margin-top: 10px;
  padding-top: 10px;
  text-align: center;
}
.category-list-operate-drawer {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  padding-left: 10%;
  padding-right: 10%;
  .category-list-operate-drawer-header {
    font-size: 1.5em;
    font-weight: bold;
    line-height: 50px;
  }
  .category-list-operate-drawer-info {
    text-align: left;
    font-size: 1.2em;
    line-height: 25px;
    ul {
      list-style-type: circle;
    }
  }
  .category-list-choose-operate {
    margin-top: 10px;
    .category-list-operate-drawer-select {
      margin: 10px;
    }
    .category-list-operate-drawer-btn {
      margin-top: 20px;
    }
  }
}
/deep/ .el-table .cell {
  word-break: normal;
}
</style>