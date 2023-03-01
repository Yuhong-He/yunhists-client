<template>
  <div>
    <el-table :data="tableData" border style="width: 100%" :empty-text="$t('thesis.noData')" v-loading="loading"
              @selection-change="changeSelection" @sort-change="changeTableSort">
      <el-table-column v-if="userRights >= 1" type="selection" width="39"></el-table-column>
      <el-table-column prop="author" :label="$t('thesis.author')" width="120" sortable="custom"></el-table-column>
      <el-table-column prop="title" :label="$t('thesis.title')" width="270" sortable="custom"></el-table-column>
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
              <el-link @click="toCategoryDetailPage('/category/id/' + category.id)">
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
          <el-button v-if="userRights >= 1" size="mini" icon="el-icon-edit" @click="updateThesis(scope.row.id)" type="primary" plain circle></el-button>
          <el-button v-if="userRights >= 1" size="mini" icon="el-icon-delete" @click="deleteThesis(scope.row.id, scope.row.title)" type="danger" plain circle></el-button>
        </template>
      </el-table-column>
    </el-table>

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

    <el-dialog :title="$t('thesis.confirmDelete')" :lock-scroll="false" :append-to-body="true" :visible.sync="confirmDeletePanel" :close-on-click-modal="false" width="30%">
      <div style="font-weight: bold; color: red">{{ this.confirmDeleteTitle }}</div>
      <div style="margin-top: 10px;">{{ $t('thesis.pleaseInputReason') }}</div>
      <div>
        <el-input
          type="textarea"
          :rows="4"
          v-model="reason">
        </el-input>
      </div>
      <div style="margin-top: 10px">
        <el-tag style="cursor: pointer" @click="inputReason($t('thesis.notMeetCriteriaBody'))" type="info">{{ $t('thesis.notMeetCriteriaTitle') }}</el-tag>
        <el-tag style="cursor: pointer" @click="inputReason($t('thesis.repeatThesisBody'))" type="info">{{ $t('thesis.repeatThesisTitle') }}</el-tag>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDeletePanel = false">{{ $t('thesis.cancel') }}</el-button>
        <el-button type="danger" :loading="isDeleting" @click="doDelete">{{ $t('thesis.delete') }}</el-button>
      </div>
    </el-dialog>

    <el-backtop></el-backtop>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {handleThesisIssue} from "@/utils/thesis";
import i18n from "@/lang";
import {generalError} from "@/utils/user";
import OSS from "ali-oss";
import {oss} from "@/utils/oss";

export default {
  props: ["tableData", "loading"],
  computed: {
    ...mapState('UserInfo', ['userRights'])
  },
  mounted() {
    if(this.userRights >= 1) {
      this.operation_col_width = 163;
    }
  },
  data() {
    return {
      operation_col_width: 90,
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
      remain: 0,
      confirmDeletePanel: false,
      confirmDeleteId: null,
      confirmDeleteTitle: "",
      isDeleting: false,
      reason: ""
    }
  },
  methods: {
    handleThesisIssue,
    changeSelection(selection) {
      this.$emit('getSelection', selection);
    },
    changeTableSort(column) {
      let sortOrder = "DESC";
      if(column.order === "ascending") {
        sortOrder = "ASC";
      }
      const obj = {
        sortCol: column.prop,
        sortOrder: sortOrder
      }
      this.$emit('getSortCol', obj);
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
        generalError(res.data);
      }
    },
    toSharePage() {
      this.$router.push("/thesis/share");
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
      } else if(res.data.code === 404) {
        await this.$alert(i18n.tc('thesis.fileMissing'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
      } else if(res.data.code === 407) {
        await this.$alert(i18n.tc('thesis.oops'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
      } else {
        generalError(res.data);
      }
    },
    updateThesis(id) {
      this.$router.push("/thesis/update/" + id);
    },
    deleteThesis(id, title) {
      this.reason = "";
      this.confirmDeleteId = id;
      this.confirmDeleteTitle = title;
      this.confirmDeletePanel = true;
    },
    inputReason(reason) {
      this.reason = reason;
    },
    async doDelete() {
      this.isDeleting = true;
      if(this.reason.length === 0) {
        this.reason = "<--- NULL --->";
      }
      let res = await this.$api.deleteThesis(this.confirmDeleteId, this.reason);
      if(res.data.code === 200) {
        this.isDeleting = false;
        this.confirmDeletePanel = false;
        this.$message.success(i18n.tc('thesis.deleteSuccess'));
        this.$emit('refreshList');
      } else if(res.data.code === 407) {
        await this.$alert(i18n.tc('thesis.oops'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
      } else {
        generalError(res.data);
      }
    },
    toCategoryDetailPage(url) {
      if(this.$router.currentRoute.path !== url) {
        this.$router.push(url);
      } else {
        this.$message(i18n.tc('category.alreadyInThisCatDetailPage'));
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
.el-tag + .el-tag {
  margin-left: 10px;
}
/deep/ .el-table .cell {
  word-break: normal;
}
</style>