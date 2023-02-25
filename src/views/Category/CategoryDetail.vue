<template>
  <div class="category-detail">
    <div class="parent-cat-tag-area">
      <template v-for="obj of parentCats">
        <el-tag class="parent-cat-tag" type="info" effect="plain" @click="$router.push('/category/id/' + obj.id)">
          <span>{{ $i18n.locale === 'zh' ? obj.zhName : obj.enName }}</span>
        </el-tag>
      </template>
    </div>
    <div class="category-detail-header">
      <el-row>
        <el-col :span="18" class="category-detail-header-left">
          <h1>{{ this.mainTitle }}</h1>
          <h4 style="padding-top: 5px">{{ this.subTitle }}</h4>
        </el-col>
        <el-col :span="6" class="category-detail-header-right">
          <el-button v-if="this.userRights >= 1" type="warning" @click="openOperateDrawer" plain>
            {{ $t('thesis.operation') }}
          </el-button>
          <el-button v-if="this.userRights === 0" type="warning" @click="toSharePage" plain>
            {{ $t('thesis.share') }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="sub-cat-table-area">
      <h3>{{ $t('category.subCatsCount') }}（{{ this.subCatCount }}）</h3>
      <div class="sub-cat-table">
        <CategoryTable :tableData="subCatTableData" :loading="subCatLoading" @getSelection="getSubCatSelection" @getSortCol="getSubCatSortCol"></CategoryTable>
      </div>
    </div>
    <div class="sub-thesis-table-area">
      <h3>{{ $t('category.thesesCount') }}（{{ this.subThesisCount }}）</h3>
      <div class="sub-thesis-table">
        <ThesisTable :tableData="subThesisTableData" :loading="subThesisLoading" @getSelection="getSubThesisSelection" @getSortCol="getSubThesisSortCol" @refreshList="getCategoryTheses"></ThesisTable>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import CategoryTable from "@/components/CategoryTable.vue";
import i18n from "@/lang";
import ThesisTable from "@/components/ThesisTable.vue";

export default {
  components: {
    ThesisTable,
    CategoryTable
  },
  computed: {
    ...mapState('UserInfo', ['userRights'])
  },
  watch: {
    '$i18n.locale'() {
      this.generateCategoryDetails();
    },
    '$route': 'generateCategoryDetails'
  },
  created() {
    this.generateCategoryDetails();
  },
  data() {
    return {
      catId: 1,
      mainTitle: "",
      subTitle: "",
      parentCats: [],
      subCatLoading: true,
      subCatTableData: [],
      selectedSubCats: {},
      subThesisLoading: true,
      subThesisTableData: [],
      selectedSubTheses: {},
      subCatCount: 0,
      subThesisCount: 0,
      subCatSortCol: '',
      subCatSortOrder: '',
      thesesSortCol: '',
      thesesSortOrder: '',
    }
  },
  methods: {
    generateCategoryDetails() {
      this.catId = this.$route.params.id;
      this.getCategoryInfo();
      this.getCategoryParentCats();
      this.getCategorySubCats();
      this.getCategoryTheses();
    },
    getCategoryInfo() {
      this.$api.getCategoryInfo(this.catId).then(res => {
        if(res.data.code === 200) {
          if(i18n.locale === "zh") {
            this.mainTitle = res.data.data.zhName;
            this.subTitle = res.data.data.enName;
          } else {
            this.mainTitle = res.data.data.enName;
            this.subTitle = res.data.data.zhName;
          }
          this.subCatCount = res.data.data.catSubCats;
          this.subThesisCount = res.data.data.catTheses;
        } else if(res.data.code === 305) {
          this.$message.error(i18n.tc('category.categoryIdNotExist'));
          this.$router.push("/category/list");
        }
      }).catch(() => {
        this.$message.error(i18n.tc('category.invalidId'));
        this.$router.push("/category/list");
      });
    },
    async getCategoryParentCats() {
      let res = await this.$api.getCategoryParentCats(this.catId);
      if(res.data.code === 200) {
        this.parentCats = res.data.data;
      }
    },
    async getCategorySubCats() {
      let res = await this.$api.getCategoryChildCats(this.catId, this.subCatSortCol, this.subCatSortOrder);
      if(res.data.code === 200) {
        this.subCatTableData = res.data.data;
        this.subCatLoading = false;
      }
    },
    async getCategoryTheses() {
      let res = await this.$api.getCategoryTheses(this.catId, this.thesesSortCol, this.thesesSortOrder);
      if(res.data.code === 200) {
        this.subThesisTableData = res.data.data;
        this.subThesisLoading = false;
      }
    },
    openOperateDrawer() {
      console.log("openOperateDrawer()");
    },
    toSharePage() {
      this.$router.push("/thesis/share");
    },
    getSubCatSelection(val) {
      this.selectedSubCats = val;
    },
    getSubThesisSelection(val) {
      this.selectedSubTheses = val;
    },
    getSubCatSortCol(val) {
      this.subCatSortCol = val.sortCol;
      this.subCatSortOrder = val.sortOrder;
      this.getCategorySubCats();
    },
    getSubThesisSortCol(val) {
      this.thesesSortCol = val.sortCol;
      this.thesesSortOrder = val.sortOrder;
      this.getCategoryTheses();
    }
  }
}
</script>

<style lang="less" scoped>
.category-detail {
  min-height: 500px;
  margin-top: 10px;
  margin-left:  10%;
  margin-right: 10%;
}
.parent-cat-tag-area {
  line-height: 50px;
  .parent-cat-tag {
    cursor: pointer;
    margin-right: 10px;
    font-size: 1.1em;
  }
  .parent-cat-tag:hover {
    color: dodgerblue;
  }
  .parent-cat-tag:active {
    color: darkorange;
  }
}
.category-detail-header {
  min-height: 50px;
  .category-detail-header-right {
    padding-top: 5px;
    text-align: right;
  }
}
.sub-cat-table-area {
  margin-top: 25px;
  .sub-cat-table {
    margin-top: 25px;
  }
}
.sub-thesis-table-area {
  margin-top: 25px;
  margin-bottom: 25px;
  .sub-thesis-table {
    margin-top: 25px;
  }
}
</style>