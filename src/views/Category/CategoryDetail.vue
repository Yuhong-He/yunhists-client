<template>
  <div class="category-detail">
    <div class="parent-cat-tag-area">
      <span class="parent-cat-header">{{ $t('category.parentCat') }}</span>
      <template v-if="updateParentCat === false">
        <el-tag class="parent-cat-tag" type="info" effect="plain" v-for="obj of parentCats"
                @click="$router.push('/category/id/' + obj.id)">
          <span>{{ $i18n.locale === 'zh' ? obj.zhName : obj.enName }}</span>
        </el-tag>
        <span class="category-parent-cat-edit-btn" v-if="this.userRights >= 1">
          <span class="text-nowrap">
            <span class="edit-bracket">[</span>
            <el-link type="primary" :underline="false" @click="updateParentCat = true">{{ $t('category.edit') }}</el-link>
            <span class="edit-bracket">]</span>
          </span>
        </span>
      </template>
      <template v-if="updateParentCat === true">
        <el-tag class="parent-cat-tag-edit" :key="tag" v-for="tag in updateParentCats" type="info" effect="plain" closable
                @close="removeCat(tag)">
          <span>{{ tag }}</span>
        </el-tag>
        <el-autocomplete
            class="input-new-tag"
            v-if="selectNewParentCat"
            v-model="newParentCat"
            :fetch-suggestions="querySearchAsync"
            :highlight-first-item="true"
            :trigger-on-focus="false"
            :placeholder="$t('category.searchCategory')"
            ref="saveTagInput"
            size="small"
            @input="searchCategory"
            @select="handleSelectConfirm"
        >
        </el-autocomplete>
        <el-button v-else class="button-new-tag" size="small" @click="showSelectNewParentCat">+ {{ $t('category.add') }}</el-button>
        <span class="category-parent-cat-edit-btn">
          <span class="text-nowrap">
            <span class="edit-bracket">[</span>
            <el-link type="info" :underline="false" @click="cancelUpdateParentTag">{{ $t('category.cancel') }}</el-link>
            <span class="edit-bracket">]</span>
          </span>
          <span class="text-nowrap">
            <span class="edit-bracket">[</span>
            <el-link type="primary" :underline="false" @click="saveUpdateParentTag">{{ $t('category.save') }}</el-link>
            <span class="edit-bracket">]</span>
          </span>
        </span>
      </template>
    </div>
    <el-divider></el-divider>
    <div class="category-detail-header">
      <el-row>
        <el-col :span="18" class="category-detail-header-left">
          <span class="main-title-area">
            <span class="main-title">{{ this.mainTitle }}</span>
            <span class="category-name-edit-btn" v-if="this.userRights >= 1">
              <span class="edit-bracket">[</span>
              <el-link type="primary" :underline="false" @click="updateCatNamePanel = true">{{ $t('category.edit') }}</el-link>
              <span class="edit-bracket">]</span>
            </span>
          </span>
          <h4 style="padding-top: 5px">{{ this.subTitle }}</h4>
        </el-col>
        <el-col :span="6" class="category-detail-header-right">
          <el-button v-if="this.userRights >= 1 && (this.subCatCount > 0 || this.subThesisCount > 0)"
                     type="warning" @click="openOperateDrawer" plain>
            {{ $t('category.operate') }}
          </el-button>
          <el-button v-if="this.userRights >= 1 && (this.subCatCount === 0 && this.subThesisCount === 0)"
                     type="danger" @click="openConfirmDeletePanel = true" plain>
            {{ $t('category.delete') }}
          </el-button>
          <el-button v-if="this.userRights === 0" type="warning" @click="toSharePage" plain>
            {{ $t('thesis.share') }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="sub-cat-table-area">
      <h3>{{ $t('category.subCats') }}（{{ this.subCatCount }}）</h3>
      <div class="sub-cat-table">
        <CategoryTable :tableData="subCatTableData" :loading="subCatLoading" @getSelection="getSubCatSelection" @getSortCol="getSubCatSortCol"></CategoryTable>
      </div>
    </div>
    <div class="sub-thesis-table-area">
      <h3>{{ $t('category.theses') }}（{{ this.subThesisCount }}）</h3>
      <div class="sub-thesis-table">
        <ThesisTable :tableData="subThesisTableData" :loading="subThesisLoading" @getSelection="getSubThesisSelection" @getSortCol="getSubThesisSortCol" @refreshList="getCategoryTheses"></ThesisTable>
      </div>
    </div>

    <el-dialog
        :title="$t('category.updateCatName')"
        :visible.sync="updateCatNamePanel"
        :close-on-click-modal="false"
        width="30%">
      <el-form label-position="top" label-width="80px">
        <el-form-item :label="$t('category.zhName')">
          <el-input v-model="catZhName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('category.enName')">
          <el-input v-model="catEnName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateCatNamePanel = false">{{ $t('category.cancel') }}</el-button>
        <el-button type="primary" @click="updateCatName">{{ $t('category.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-drawer
        :visible.sync="operateThesesSubCats"
        direction="rtl"
        ref="drawer"
    >
      <div class="category-detail-operate-drawer">
        <div class="category-detail-operate-drawer-header">
          <span>{{ $t('category.batchOperate') }}</span>
        </div>
        <div class="category-detail-operate-drawer-info">
          <div v-if="this.selectedSubCats.length > 0">
            <p style="font-weight: bold;">{{ $t('category.forFollowingCats') }}</p>
            <ul>
              <li v-for="item in this.selectedSubCats" v-if="$i18n.locale === 'zh'">{{ item.zhName }}</li>
              <li v-for="item in this.selectedSubCats" v-if="$i18n.locale === 'en'">{{ item.enName }}</li>
            </ul>
          </div>
          <div v-if="this.selectedSubTheses.length > 0">
            <p style="font-weight: bold;">{{ $t('thesis.forFollowingTheses') }}</p>
            <ul>
              <li v-for="item in this.selectedSubTheses">{{ item.title }}</li>
            </ul>
          </div>
        </div>
        <div class="category-detail-choose-operate">
          <el-collapse v-model="chooseOperate" accordion>
            <el-collapse-item :title="$t('category.addNewCommonParentCats')" name="1">
              <div class="category-detail-operate-drawer-select">
                <CategorySelector style="width: 100%;" @getCategories="getCategories"></CategorySelector>
              </div>
              <div class="category-detail-operate-drawer-btn">
                <el-button @click="operateThesesSubCats = false">{{ $t('category.cancel') }}</el-button>
                <el-button type="primary" @click="addCatALot">{{ $t('category.confirm') }}</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item :title="$t('category.removeFromCurrentCat')" name="2">
              <div class="category-detail-operate-drawer-msg">
                {{ $t('category.confirmRemove1') }}<span style="font-weight: bold; color: darkgreen;">{{ this.mainTitle }}</span>{{ $t('category.confirmRemove2') }}
              </div>
              <div class="category-detail-operate-drawer-btn">
                <el-button @click="operateThesesSubCats = false">{{ $t('category.cancel') }}</el-button>
                <el-button type="danger" @click="removeFromCurrentCat">{{ $t('category.confirm') }}</el-button>
              </div>
            </el-collapse-item>
            <el-collapse-item :title="$t('category.moveToAnotherCat')" name="3">
              <div class="category-detail-operate-drawer-select">
                <SingleCategorySelector style="width: 100%;" @getCategory="getDestinationCat"></SingleCategorySelector>
              </div>
              <div class="category-detail-operate-drawer-btn">
                <el-button @click="operateThesesSubCats = false">{{ $t('category.cancel') }}</el-button>
                <el-button type="primary" @click="moveToAnotherCat">{{ $t('category.confirm') }}</el-button>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </el-drawer>

    <el-dialog
        :title="$t('category.confirmDeleteCat')"
        :visible.sync="openConfirmDeletePanel"
        :close-on-click-modal="false"
        center
        width="30%">
      <p style="font-size: 1.1em; font-weight: bold; text-align: center">{{ this.catZhName }}</p>
      <p style="font-size: 1.1em; font-weight: bold; text-align: center">{{ this.catEnName }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openConfirmDeletePanel = false">{{ $t('category.cancel') }}</el-button>
        <el-button type="danger" @click="deleteCategory">{{ $t('category.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import CategoryTable from "@/components/CategoryTable.vue";
import i18n from "@/lang";
import ThesisTable from "@/components/ThesisTable.vue";
import {generalError} from "@/utils/user";
import _ from "lodash";
import CategorySelector from "@/components/CategorySelector.vue";
import {generateErrorMsg} from "@/utils/category";
import SingleCategorySelector from "@/components/SingleCategorySelector.vue";

export default {
  components: {
    SingleCategorySelector,
    CategorySelector,
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
      catZhName: "",
      catEnName: "",
      parentCats: [],
      updateParentCats: [],
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
      updateCatNamePanel: false,
      updateParentCat: false,
      selectNewParentCat: false,
      newParentCat: "",
      newParentCategory: [],
      operateThesesSubCats: false,
      chooseOperate: 1,
      newCategoriesId: [],
      newCategories: [],
      destinationCatId: null,
      openConfirmDeletePanel: false
    }
  },
  methods: {
    async checkToken() {
      let res = await this.$api.validateToken();
      if(res.data.code !== 200) {
        generalError(res.data);
      }
    },
    generateCategoryDetails() {
      window.scrollTo(0, 0);
      this.updateCatNamePanel = false;
      this.updateParentCat = false;
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
          this.catZhName = res.data.data.zhName;
          this.catEnName = res.data.data.enName;
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
        this.generateUpdateParentCatTags();
      }
    },
    generateUpdateParentCatTags() {
      this.updateParentCats = [];
      for(let obj of this.parentCats) {
        if(i18n.locale === "zh") {
          this.updateParentCats.push(obj.zhName);
        } else {
          this.updateParentCats.push(obj.enName);
        }
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
      this.checkToken();
      if(!_.isEmpty(this.selectedSubTheses) || !_.isEmpty(this.selectedSubCats)) {
        this.operateThesesSubCats = true;
      } else {
        this.$message({
          message: i18n.tc('category.selectSubCatsAndTheses'),
          type: 'warning'
        });
      }
    },
    toSharePage() {
      this.$router.push("/thesis/upload");
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
    },
    async updateCatName() {
      let res = await this.$api.updateCategoryName(this.catId, this.catZhName, this.catEnName);
      if(res.data.code === 200) {
        this.$message({
          type: 'success',
          message: i18n.tc('category.updateSuccess')
        });
        this.getCategoryInfo();
        await this.getCategoryTheses();
        this.updateCatNamePanel = false;
      } else if(res.data.code === 301) {
        await this.$alert(i18n.tc('category.zhCatExist'), {
          confirmButtonText: i18n.tc('category.confirm'),
          callback: () => {}
        });
      } else if(res.data.code === 302) {
        await this.$alert(i18n.tc('category.enCatExist'), {
          confirmButtonText: i18n.tc('category.confirm'),
          callback: () => {}
        });
      } else {
        generalError(res.data);
      }
    },
    removeCat(tag) {
      this.updateParentCats.splice(this.updateParentCats.indexOf(tag), 1);
    },
    cancelUpdateParentTag() {
      this.selectNewParentCat = false;
      this.updateParentCat = false;
      this.generateUpdateParentCatTags();
    },
    async saveUpdateParentTag() {
      let res = await this.$api.updateCatParentCat(this.catId, i18n.locale, this.updateParentCats.toString());
      if(res.data.code === 200) {
        if(_.isEmpty(res.data.data.failed)) {
          this.updateParentCat = false;
          this.selectNewParentCat = false;
          this.$message({
            message: i18n.tc('category.updateSuccess'),
            type: 'success'
          });
          await this.getCategoryParentCats();
        } else {
          this.updateParentCat = false;
          this.selectNewParentCat = false;
          this.$notify.error({
            title: i18n.tc('category.error'),
            dangerouslyUseHTMLString: true,
            duration: 0,
            message: i18n.tc('category.canNotBeCatItselfDetailPage_1') + "<span style='font-weight: bold; color: darkgreen'>" + this.mainTitle + "</span>" + i18n.tc('category.canNotBeCatItselfDetailPage_2')
          });
          await this.getCategoryParentCats();
        }
      } else {
        generalError(res.data);
      }
    },
    showSelectNewParentCat() {
      this.selectNewParentCat = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleSelectConfirm(){
      let inputValue = this.newParentCat;
      if (inputValue) {
        if(!this.updateParentCats.includes(inputValue)) {
          this.updateParentCats.push(inputValue);
        } else {
          this.$message({
            message: i18n.tc('category.selectedCategoryExist'),
            type: 'warning'
          });
        }
      }
      this.selectNewParentCat = false;
      this.newParentCat = "";
    },
    querySearchAsync(queryString, cb) {
      if(!_.isEmpty(this.newParentCategory)) {
        cb(this.newParentCategory);
      }
    },
    async searchCategory(str) {
      this.newParentCategory = [];
      if(str && str.length > 0) {
        let res = await this.$api.getCategoryOption(str, i18n.locale);
        if(res.data.code === 200) {
          res.data.data.catOptions.forEach(cat => {
            let catOption = {};
            if(i18n.locale === "zh") {
              catOption.value = cat.zhName;
            } else {
              catOption.value = cat.enName;
            }
            this.newParentCategory.push(catOption);
          });
        } else {
          console.log("Unexpected error");
        }
      }
    },
    getCategories(val) {
      this.newCategoriesId = val;
      if(!_.isEmpty(this.newCategoriesId)) {
        this.getNewCategoryNames(val.toString());
      }
    },
    getDestinationCat(val) {
      this.destinationCatId = val;
      if(this.destinationCatId && this.destinationCatId > 0) {
        this.getNewCategoryNames(val.toString());
      }
    },
    async getNewCategoryNames(val) {
      let res = await this.$api.getCategoryByIds(val);
      if(res.data.code === 200) {
        this.newCategories = res.data.data;
      }
    },
    addCatALot() {
      if(!_.isEmpty(this.newCategoriesId)) {
        const childCat = [];
        this.selectedSubCats.forEach(e => {
          childCat.push(e.id);
        });
        const childTheses = [];
        this.selectedSubTheses.forEach(e => {
          childTheses.push(e.id);
        });
        this.doAddCatALot(childCat, childTheses, this.newCategoriesId);
      } else {
        this.$alert(i18n.tc('category.selectParentCat'), {
          confirmButtonText: i18n.tc('category.confirm'),
          callback: () => {}
        });
      }
    },
    async doAddCatALot(childCat, childTheses, parentCat) {
      let res = await this.$api.addCatALot({"categories": childCat, "theses": childTheses, "parentCats": parentCat});
      if(res.data.code === 200) {
        if(_.isEmpty(res.data.data.failed)) {
          this.operateThesesSubCats = false;
          this.$message({
            message: i18n.tc('category.batchSuccess'),
            type: 'success'
          });
          await this.getCategorySubCats();
          await this.getCategoryTheses();
        } else {
          this.operateThesesSubCats = false;
          const errorMsg = generateErrorMsg(res.data.data.failed, this.selectedSubCats, this.selectedSubTheses, this.newCategories);
          this.$notify.error({
            title: i18n.tc('category.error'),
            dangerouslyUseHTMLString: true,
            duration: 0,
            message: errorMsg
          });
          await this.getCategorySubCats();
          await this.getCategoryTheses();
        }
      } else {
        generalError(res.data);
      }
    },
    removeFromCurrentCat() {
      const childCat = [];
      if(!_.isEmpty(this.selectedSubCats)) {
        this.selectedSubCats.forEach(e => {
          childCat.push(e.id);
        });
      }
      const childTheses = [];
      if(!_.isEmpty(this.selectedSubTheses)) {
        this.selectedSubTheses.forEach(e => {
          childTheses.push(e.id);
        });
      }
      this.doRemoveFromCurrentCat(this.catId, childCat, childTheses);
    },
    async doRemoveFromCurrentCat(id, subCats, subTheses) {
      let res = await this.$api.removeFromCat(id, subCats.toString(), subTheses.toString());
      if(res.data.code === 200) {
        if(_.isEmpty(res.data.data.failed)) {
          this.operateThesesSubCats = false;
          this.$message({
            message: i18n.tc('category.batchSuccess'),
            type: 'success'
          });
          await this.getCategoryInfo();
          await this.getCategorySubCats();
          await this.getCategoryTheses();
        } else {
          this.operateThesesSubCats = false;
          const parentCat = [];
          const obj = {};
          obj.id = this.catId;
          obj.zhName = this.catZhName;
          obj.enName = this.catEnName;
          parentCat.push(obj);
          const errorMsg = generateErrorMsg(res.data.data.failed, this.selectedSubCats, this.selectedSubTheses, parentCat);
          this.$notify.error({
            title: i18n.tc('category.error'),
            dangerouslyUseHTMLString: true,
            duration: 0,
            message: errorMsg
          });
          await this.getCategoryInfo();
          await this.getCategorySubCats();
          await this.getCategoryTheses();
        }
      } else {
        generalError(res.data);
      }
    },
    moveToAnotherCat() {
      const childCat = [];
      if(!_.isEmpty(this.selectedSubCats)) {
        this.selectedSubCats.forEach(e => {
          childCat.push(e.id);
        });
      }
      const childTheses = [];
      if(!_.isEmpty(this.selectedSubTheses)) {
        this.selectedSubTheses.forEach(e => {
          childTheses.push(e.id);
        });
      }
      this.doMoveToAnotherCat(this.catId, this.destinationCatId, childCat, childTheses);
    },
    async doMoveToAnotherCat(origin, dest, subCats, subTheses) {
      let res = await this.$api.moveTo(origin, dest, subCats.toString(), subTheses.toString());
      if(res.data.code === 200) {
        if(_.isEmpty(res.data.data.failed)) {
          this.operateThesesSubCats = false;
          this.$message({
            message: i18n.tc('category.batchSuccess'),
            type: 'success'
          });
          await this.getCategoryInfo();
          await this.getCategorySubCats();
          await this.getCategoryTheses();
        } else {
          this.operateThesesSubCats = false;
          const origin = {};
          origin.id = this.catId;
          origin.zhName = this.catZhName;
          origin.enName = this.catEnName;
          this.newCategories.push(origin); // dest cat already inside
          const errorMsg = generateErrorMsg(res.data.data.failed, this.selectedSubCats, this.selectedSubTheses, this.newCategories);
          this.$notify.error({
            title: i18n.tc('category.error'),
            dangerouslyUseHTMLString: true,
            duration: 0,
            message: errorMsg
          });
          await this.getCategoryInfo();
          await this.getCategorySubCats();
          await this.getCategoryTheses();
        }
      } else {
        generalError(res.data);
      }
    },
    async deleteCategory() {
      let res = await this.$api.deleteCat(this.catId);
      if(res.data.code === 200) {
        this.openConfirmDeletePanel = false;
        this.$router.go(-1);
      } else {
        generalError(res.data);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.category-detail {
  min-height: 500px;
  margin: 10px 10% 25px;
}
.parent-cat-tag-area {
  line-height: 40px;
  .parent-cat-header {
    font-weight: bold;
    margin-right: 15px;
  }
  .parent-cat-tag {
    cursor: pointer;
    font-size: 1.1em;
  }
  .parent-cat-tag:hover {
    color: dodgerblue;
  }
  .parent-cat-tag:active {
    color: darkorange;
  }
  .category-parent-cat-edit-btn {
    margin-left: 10px;
  }
  .parent-cat-tag-edit {
    font-size: 1.1em;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 240px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
.category-detail-header {
  min-height: 50px;
  .category-detail-header-right {
    padding-top: 5px;
    text-align: right;
  }
}
.main-title-area {
  .main-title {
    font-size: 2em;
    font-weight: bold;
  }
  .category-name-edit-btn {
    margin-left: 10px;
  }
}
.edit-bracket {
  padding-left: 2px;
  padding-right: 2px;
}
.sub-cat-table-area {
  margin-top: 25px;
  .sub-cat-table {
    margin-top: 25px;
  }
}
.sub-thesis-table-area {
  margin-top: 25px;
  .sub-thesis-table {
    margin-top: 25px;
  }
}
.text-nowrap {
  white-space: nowrap;
}
.category-detail-operate-drawer {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  padding-left: 10%;
  padding-right: 10%;
  .category-detail-operate-drawer-header {
    font-size: 1.5em;
    font-weight: bold;
    line-height: 50px;
  }
  .category-detail-operate-drawer-info {
    text-align: left;
    font-size: 1.2em;
    line-height: 25px;
    ul {
      list-style-type: circle;
    }
  }
  .category-detail-choose-operate {
    margin-top: 10px;
    .category-detail-operate-drawer-select {
      margin: 10px;
    }
    .category-detail-operate-drawer-msg {
      margin-top: 20px;
      text-align: left;
      padding-left: 10px;
      padding-right: 10px;
      font-size: 1.1em;
    }
    .category-detail-operate-drawer-btn {
      margin-top: 20px;
    }
  }
}
/deep/ .el-divider--horizontal {
  margin: 8px 0;
}
</style>