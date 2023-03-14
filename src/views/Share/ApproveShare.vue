<template>
  <div class="approve-share-container">
    <div class="approve-share-title">
      <h2>{{ $t('share.approveNewShare') }}</h2>
    </div>
    <div class="approve-share-form">
      <el-form ref="form" :model="form" label-width="20%">
        <el-form-item :label="$t('thesis.author')" prop="author">
          <el-input v-model="form.author" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.title')" prop="title">
          <el-input v-model="form.title" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.publication')" prop="publication">
          <el-input v-model="form.publication" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.type')">
          <el-radio-group v-model="form.type">
            <el-radio label="0">{{ $t('thesis.journal') }}</el-radio>
            <el-radio label="1">{{ $t('thesis.collection') }}</el-radio>
            <el-radio label="2">{{ $t('thesis.bookChapter') }}</el-radio>
            <el-radio label="3">{{ $t('thesis.newspaperArticle') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="this.form.type === '1' || this.form.type === '2'" :label="$t('thesis.location')" prop="location">
          <el-input v-model="form.location" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="this.form.type === '1' || this.form.type === '2'" :label="$t('thesis.publisher')" prop="publisher">
          <el-input v-model="form.publisher" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.year')" prop="year">
          <el-date-picker v-model="form.year" type="year" format="yyyy" value-format="yyyy" style="width: 50%" :placeholder="$t('thesis.select')" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item v-if="this.form.type === '0' || this.form.type === '1'" :label="$t('thesis.volume')" prop="volume">
          <el-input v-model="form.volume" style="width: 50%" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="this.form.type === '0' || this.form.type === '3'" :label="$t('thesis.issue')" prop="issue">
          <el-input v-model="form.issue" style="width: 50%" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="this.form.type !== '3'" :label="$t('thesis.pages')" prop="pages">
          <el-input v-model="form.pages" style="width: 50%" clearable></el-input>
        </el-form-item>
        <el-form-item label="DOI" prop="doi">
          <el-input v-model="form.doi" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="this.form.type === '1' || this.form.type === '2'" label="ISBN" prop="isbn">
          <el-input v-model="form.isbn" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.onlinePublisher')" prop="onlinePublisher">
          <el-select v-model="form.onlinePublisher" filterable allow-create clearable placeholder="" style="width: 100%;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('thesis.onlineUrl')" prop="onlinePublishUrl">
          <el-input v-model="form.onlinePublishUrl" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.copyright')" prop="copyrightStatus">
          <el-radio-group v-model="form.copyrightStatus">
            <el-radio label="0">{{ $t('thesis.copyrightReserved') }}</el-radio>
            <el-radio label="1">{{ $t('thesis.openAccess') }}</el-radio>
            <el-radio label="2">{{ $t('thesis.publicDomain') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('share.file')" prop="category">
          <el-row>
            <el-col :span="20" :style="'color: ' + fileColor">{{ file }}</el-col>
            <el-col :span="4" style="text-align: right">
              <el-button type="primary" :disabled="downloadBtnDisabled" @click="downloadFile">{{ $t('share.download') }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('thesis.category')" prop="category">
          <CategorySelector style="width: 100%;" @getCategories="getCategories" :catList="catList"></CategorySelector>
        </el-form-item>
        <el-form-item :label="$t('thesis.newCategory')" prop="newCategory">
          {{ newCategory }}
        </el-form-item>
      </el-form>
    </div>
    <div class="share-share-btn">
      <el-button type="danger" round @click="confirmRejectPanel = true">{{ $t('share.reject') }}</el-button>
      <el-button type="success" round :loading="isApproving" @click="approve">{{ $t('share.approvePass') }}</el-button>
    </div>

    <el-dialog :title="$t('share.confirmReject')" :lock-scroll="false" :append-to-body="true" :visible.sync="confirmRejectPanel" :close-on-click-modal="false" width="30%">
      <div>{{ $t('thesis.pleaseInputReason') }}</div>
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
        <el-tag style="cursor: pointer" @click="inputReason($t('share.fileMissingBody'))" type="info">{{ $t('share.fileMissingTitle') }}</el-tag>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmRejectPanel = false">{{ $t('thesis.cancel') }}</el-button>
        <el-button type="danger" :loading="isRejecting" @click="reject">{{ $t('share.reject') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import i18n from "@/lang";
import CategorySelector from "@/components/CategorySelector.vue";
import {generalError, unexpectedError} from "@/utils/user";
import OSS from "ali-oss";
import {oss} from "@/utils/oss";
import {getTitle} from "@/utils/title";

export default {
  created() {
    document.title = getTitle("approveUpload");
  },
  components: {
    CategorySelector
  },
  computed: {
    ...mapState('UserInfo', ['userRights']),
    options() {
      return [{
        value: '维普资讯',
        label: i18n.tc('thesis.cqvip')
      }, {
        value: '中国知网',
        label: i18n.tc('thesis.cnki')
      }, {
        value: '自主出版',
        label: i18n.tc('thesis.selfPublish')
      }]
    }
  },
  watch: {
    'form.type': {
      handler(newType) {
        if(newType === '0') {
          this.form.location = '';
          this.form.publisher = '';
        } else if(newType === '1') {
          this.form.issue = '';
        } else if(newType === '2') {
          this.form.issue = '';
          this.form.volume = '';
        } else {
          this.form.location = '';
          this.form.publisher = '';
          this.form.volume = '';
          this.form.pages = '';
        }
      },
      immediate: true
    },
    '$i18n.locale'() {
      document.title = getTitle("approveUpload");
    }
  },
  mounted() {
    this.getShareDetails();
  },
  data() {
    return {
      form: {
        author: '',
        title: '',
        publication: '',
        type: '0',
        location: '',
        publisher: '',
        year: '',
        volume: '',
        issue: '',
        pages: '',
        doi: '',
        isbn: '',
        onlinePublisher: '',
        onlinePublishUrl: '',
        copyrightStatus: '0',
        fileName: '',
        category: '',
        newCategory: ''
      },
      pickerOptions: {
        disabledDate(time) {
          const _now = Date.now()
          return time.getTime() > _now
        }
      },
      file: "",
      catList: [],
      categories: [],
      fileColor: "#666666",
      downloadBtnDisabled: false,
      downloaded: false,
      isApproving: false,
      confirmRejectPanel: false,
      reason: "",
      isRejecting: false,
      newCategory: "None"
    }
  },
  methods: {
    getShareDetails() {
      const id = this.$route.params.id;
      this.$api.getShareById(id).then(res => {
        if(res.data.code === 200) {
          const json = res.data.data.share;
          if (!_.isEmpty(json)) {
            for (const valKey in json) { // loop json from server
              for (const formKey in this.form) { // loop json for this form
                if (valKey === formKey) { // if key name match
                  if (json[valKey] === null || json[valKey].length === 0) { // case null or empty
                    this.form[formKey] = "";
                  } else {
                    this.form[formKey] = json[valKey];
                  }
                  if (['year', 'volume', 'type', 'copyrightStatus'].includes(formKey)) { // case int type
                    this.form[formKey] = this.form[formKey].toString();
                  }
                  break;
                }
              }
            }
          }

          if (this.form.fileName.length > 0) {
            const suffix = this.form.fileName.substring(this.form.fileName.lastIndexOf('.') + 1);
            this.file = this.form.title + "." + suffix;
          } else {
            this.file = i18n.tc('share.fileMissing');
            this.fileColor = "red";
            this.downloadBtnDisabled = true;
          }

          this.categories = res.data.data.categories;
          let arr = [];
          for (let obj of this.categories) {
            arr.push(obj);
          }
          this.catList = arr;

          if(this.form.newCategory.length > 0) {
            this.newCategory = this.form.newCategory;
          }

        } else if (res.data.code === 501) {
          this.$message.error(i18n.tc('thesis.thesisIdNotExist'));
          this.$router.push("/admin/UploadList");
        } else if(res.data.code === 503) {
          this.$message.error(i18n.tc('share.approvedSharingCanNotUpdate'));
          this.$router.push("/profile/MyUpload");
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    getCategories(val) {
      this.categories = val;
    },
    downloadFile() {
      const response = {
        'content-disposition': `attachment; filename=${encodeURIComponent(this.file)}`
      }
      const url = new OSS(oss).signatureUrl(this.form.fileName, {response});
      window.open(url, '_blank');
      this.downloaded = true;
    },
    approve() {
      if(this.downloaded) {
        this.isApproving = true;
        this.doApprove();
      } else {
        this.$message({
          message: i18n.tc('share.checkFile'),
          type: 'warning'
        });
      }
    },
    doApprove() {
      const id = this.$route.params.id;
      this.$api.approveShare(id, this.form, this.categories.toString()).then(res => {
        if(res.data.code === 200) {
          this.$message({
            message: i18n.tc('share.approveSuccess'),
            type: 'success'
          });
          this.isApproving = false;
          this.$router.push("/admin/UploadList");
        } else if(res.data.code === 303) {
          this.$alert(i18n.tc('thesis.invalidCatId') + res.data.data.failedCatId, {
            confirmButtonText: i18n.tc('thesis.confirm'),
            callback: () => {}
          });
          this.isApproving = false;
          this.$router.push("/admin/UploadList");
        } else if(res.data.code === 406) {
          this.$alert(i18n.tc('thesis.thesisExist'), {
            confirmButtonText: i18n.tc('thesis.confirm'),
            callback: () => {}
          });
        } else if (res.data.code === 501) {
          this.$message.error(i18n.tc('thesis.thesisIdNotExist'));
          this.isApproving = false;
          this.$router.push("/admin/UploadList");
        } else if(res.data.code === 503) {
          this.$message.error(i18n.tc('share.approvedSharingCanNotUpdate'));
          this.isApproving = false;
          this.$router.push("/admin/UploadList");
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    inputReason(reason) {
      this.reason = reason;
    },
    reject() {
      if(this.reason.trim().length > 0) {
        this.isRejecting = true;
        this.doReject(this.$route.params.id, this.reason);
      } else {
        this.$alert(i18n.tc('share.inputReason'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
      }
    },
    doReject(id, reason) {
      this.$api.rejectShare(id, reason).then(res => {
        if(res.data.code === 200) {
          this.$message({
            message: i18n.tc('share.rejectSuccess'),
            type: 'success'
          });
          this.isRejecting = false;
          this.confirmRejectPanel = false;
          this.$router.push("/admin/UploadList");
        } else if (res.data.code === 501) {
          this.$message.error(i18n.tc('thesis.thesisIdNotExist'));
          this.isApproving = false;
          this.$router.push("/admin/UploadList");
        } else if(res.data.code === 503) {
          this.$message.error(i18n.tc('share.approvedSharingCanNotUpdate'));
          this.isApproving = false;
          this.$router.push("/admin/UploadList");
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
.approve-share-container {
  margin: 40px 25%;
}
.approve-share-title {
  text-align: center;
  font-size: 1.5em;
}
.approve-share-form {
  margin-top: 20px;
}
.share-share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>