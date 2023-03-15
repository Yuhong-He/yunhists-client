<template>
  <div class="upload-list">
    <div class="upload-list-header">
      <el-col :span="3">
        <span class="upload-list-title">{{ $t('upload.uploadList') }}</span>
      </el-col>
      <el-col :span="8">
        <el-input v-model="title" :placeholder="$t('upload.pleaseSearchTitle')" @change="generateTable" size="10" clearable>
          <el-button slot="append" icon="el-icon-search" @click="generateTable"></el-button>
        </el-input>
      </el-col>
      <el-col :span="13" class="upload-list-btn-right">
        <div style="display: inline-block">
          <el-switch
              v-model="turnOnUnapproved"
              @change="filterUnapproved"
              :inactive-text="$t('upload.filterUnapproved')"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </div>
      </el-col>
    </div>
    <div class="upload-list-table-area">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="author" :label="$t('thesis.author')" width="120"></el-table-column>
        <el-table-column prop="title" :label="$t('thesis.title')"></el-table-column>
        <el-table-column prop="publication" :label="$t('thesis.publication')"></el-table-column>
        <el-table-column prop="thesisIssue" :label="$t('thesis.yearIssue')" width="90">
          <template v-slot="scope">
            {{ handleThesisIssue(scope.row.thesisIssue) }}
          </template>
        </el-table-column>
        <el-table-column prop="uploader" :label="$t('upload.uploader')" width="120"></el-table-column>
        <el-table-column prop="status" :label="$t('upload.status')" width="61" align="center" header-align="left">
          <template v-slot="scope">
            <span v-if="scope.row.status === 0" style="color: dimgrey">
              <el-tooltip class="item" effect="dark" :content="$t('upload.waitingApprove')" placement="top">
                <font-awesome-icon icon="fa-solid fa-circle-minus" />
              </el-tooltip>
            </span>
            <span v-if="scope.row.status === 1" style="color: limegreen">
              <el-tooltip class="item" effect="dark" :content="$t('upload.approved')" placement="top">
                <font-awesome-icon icon="fa-solid fa-circle-check" />
              </el-tooltip>
            </span>
            <span v-if="scope.row.status === 2" style="color: red">
              <el-tooltip class="item" effect="dark" :content="$t('upload.failed')" placement="top">
                <font-awesome-icon icon="fa-solid fa-circle-xmark" />
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="approver" :label="$t('upload.approver')" width="120"></el-table-column>
        <el-table-column :label="$t('thesis.operation')" :width="operationColWidth">
          <template v-slot="scope">
            <el-button type="primary" v-if="scope.row.status === 0" @click="$router.push('/admin/ApproveUpload/' + scope.row.id)" size="mini">{{ $t('upload.approve') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="upload-list-pagination">
      <Pagination :total="total" :pageSize="parseInt(pageSize)" :currentPage="parseInt(page)"
                  @getPagination="getPagination"></Pagination>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import {mapState} from "vuex";
import {handleThesisIssue} from "@/utils/thesis";
import i18n from "@/lang";
import {generalError, getTitle, unexpectedError} from "@/utils/general";

export default {
  created() {
    document.title = getTitle("uploadList");
  },
  computed: {
    ...mapState('UserInfo', ['userRights'])
  },
  components: {
    Pagination
  },
  watch: {
    '$i18n.locale'() {
      document.title = getTitle("uploadList");
      if(i18n.locale === "zh") {
        this.operationColWidth = 77;
      } else {
        this.operationColWidth = 98;
      }
    }
  },
  mounted() {
    if(i18n.locale === "zh") {
      this.operationColWidth = 77;
    } else {
      this.operationColWidth = 98;
    }
    this.generateTable();
  },
  data() {
    return {
      title: "",
      tableData: [],
      page: 1,
      total: 0,
      pageSize: 10,
      loading: true,
      turnOnUnapproved: false,
      operationColWidth: 98
    }
  },
  methods: {
    handleThesisIssue,
    generateTable() {
      this.loading = true;
      let unapproved = "OFF"
      if(this.turnOnUnapproved) {
        unapproved = "ON"
      }
      this.$api.listAllUpload(this.page, this.title, unapproved).then(res => {
        if(res.data.code === 200) {
          this.tableData = res.data.data.records;
          this.total = res.data.data.total;
          this.loading = false;
          window.scrollTo(0, 0);
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    getPagination(page) {
      this.page = page;
      this.generateTable();
    },
    filterUnapproved() {
      this.page = 1;
      this.generateTable();
    }
  }
}
</script>

<style lang="less" scoped>
.upload-list {
  min-height: 500px;
  margin-top: 30px;
  margin-left:  10%;
  margin-right: 10%;
}
.upload-list-header {
  line-height: 50px;
  .upload-list-title {
    font-size: 2em;
    font-weight: bold;
  }
  .upload-list-btn-right {
    text-align: right;
  }
}
.upload-list-table-area {
  margin-top: 5px;
}
.upload-list-pagination {
  font-size: 1.5em;
  line-height: 50px;
  margin-top: 10px;
  padding-top: 10px;
  text-align: center;
}
/deep/ .el-switch__label.is-active {
  color: #303133;
}
</style>