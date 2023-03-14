<template>
  <div class="my-sharing">
    <div class="my-sharing-header">
      <el-col :span="8">
        <el-input v-model="title" :placeholder="$t('share.pleaseSearchTitle')" @change="generateTable" size="10" clearable>
          <el-button slot="append" icon="el-icon-search" @click="generateTable"></el-button>
        </el-input>
      </el-col>
      <el-col :span="16" class="my-sharing-btn-right">
        <el-button v-if="userRights === 0" type="warning" @click="$router.push('/thesis/upload')" plain>
          {{ $t('thesis.share') }}<font-awesome-icon class="btn-icon" icon="fa-solid fa-upload" />
        </el-button>
        <el-button v-if="userRights > 0" type="primary" @click="$router.push('/thesis/add')" plain>
          {{ $t('thesis.add') }}<font-awesome-icon class="btn-icon" icon="fa-solid fa-plus" />
        </el-button>
      </el-col>
    </div>
    <div class="my-sharing-table-area">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading">
        <el-table-column prop="author" :label="$t('thesis.author')" width="120"></el-table-column>
        <el-table-column prop="title" :label="$t('thesis.title')"></el-table-column>
        <el-table-column prop="publication" :label="$t('thesis.publication')"></el-table-column>
        <el-table-column prop="thesisIssue" :label="$t('thesis.yearIssue')" width="90">
          <template v-slot="scope">
            {{ handleThesisIssue(scope.row.thesisIssue) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('share.status')" width="61" align="center" header-align="left">
          <template v-slot="scope">
            <span v-if="scope.row.status === 0" style="color: dimgrey">
              <el-tooltip class="item" effect="dark" :content="$t('share.waitingApprove')" placement="top">
                <font-awesome-icon icon="fa-solid fa-circle-minus" />
              </el-tooltip>
            </span>
            <span v-if="scope.row.status === 1" style="color: limegreen">
              <el-tooltip class="item" effect="dark" :content="$t('share.approved')" placement="top">
                <font-awesome-icon icon="fa-solid fa-circle-check" />
              </el-tooltip>
            </span>
            <span v-if="scope.row.status === 2" style="color: red">
              <el-tooltip class="item" effect="dark" :content="$t('share.failed')" placement="top">
                <font-awesome-icon icon="fa-solid fa-circle-xmark" />
              </el-tooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('thesis.operation')" width="90">
          <template v-slot="scope">
            <el-button size="mini" v-if="scope.row.status === 0" icon="el-icon-edit" @click="updateShare(scope.row.id)" type="primary" plain circle></el-button>
            <el-button size="mini" v-if="scope.row.status === 0" icon="el-icon-delete" @click="deleteShare(scope.row.id, scope.row.title)" type="danger" plain circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="mySharing-pagination">
      <Pagination :total="total" :pageSize="parseInt(pageSize)" :currentPage="parseInt(page)"
                  @getPagination="getPagination"></Pagination>
    </div>

    <el-dialog :title="$t('thesis.confirmDelete')" :lock-scroll="false" :append-to-body="true" :visible.sync="confirmDeletePanel" :close-on-click-modal="false" width="30%">
      <div style="font-weight: bold; color: red">{{ this.confirmDeleteTitle }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDeletePanel = false">{{ $t('thesis.cancel') }}</el-button>
        <el-button type="danger" :loading="isDeleting" @click="doDelete">{{ $t('thesis.delete') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import {generalError, unexpectedError} from "@/utils/user";
import i18n from "@/lang";
import {mapState} from "vuex";
import {handleThesisIssue} from "@/utils/thesis";
import {getTitle} from "@/utils/title";

export default {
  created() {
    document.title = getTitle("myUpload");
  },
  watch: {
    '$i18n.locale'() {
      document.title = getTitle("myUpload");
    }
  },
  computed: {
    ...mapState('UserInfo', ['userRights'])
  },
  components: {
    Pagination
  },
  mounted() {
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
      confirmDeleteId: null,
      confirmDeleteTitle: "",
      confirmDeletePanel: false,
      isDeleting: false,
    }
  },
  methods: {
    handleThesisIssue,
    generateTable() {
      this.loading = true;
      this.$api.listMySharing(this.page, this.title).then(res => {
        if(res.data.code === 200) {
          this.tableData = res.data.data.records;
          this.total = res.data.data.total;
          this.loading = false;
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
    updateShare(id) {
      this.$router.push("/UpdateUpload/" + id);
    },
    deleteShare(id, title) {
      this.confirmDeleteId = id;
      this.confirmDeleteTitle = title;
      this.confirmDeletePanel = true;
    },
    doDelete() {
      this.isDeleting = true;
      this.$api.deleteMySharing(this.confirmDeleteId).then(res => {
        if(res.data.code === 200) {
          this.generateTable();
          this.isDeleting = false;
          this.confirmDeletePanel = false;
          this.$message.success(i18n.tc('thesis.deleteSuccess'));
        } else if(res.data.code === 503) {
          this.generateTable();
          this.isDeleting = false;
          this.confirmDeletePanel = false;
          this.$message.error(i18n.tc('share.approvedSharingCanNotUpdate'));
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    }
  }
}
</script>

<style lang="less" scoped>
.my-sharing {
  min-height: 460px;
}
.my-sharing-header {
  min-height: 50px;
}
.my-sharing-table-area {
  margin-top: 5px;
}
.my-sharing-btn-right {
  text-align: right;
  .btn-icon {
    padding-left: 5px;
  }
}
.mySharing-pagination {
  font-size: 1.5em;
  line-height: 50px;
  margin-top: 10px;
  padding-top: 10px;
  text-align: center;
}
</style>