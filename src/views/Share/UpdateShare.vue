<template>
  <div class="update-share-container">
    <div class="update-share-title">
      <h2>{{ $t('share.updateSharing') }}</h2>
    </div>
    <div class="update-share-form">
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
        <el-form-item :label="$t('thesis.uploadFile')" prop="fileName">
          <FileUploader @getFileName="getFileName" :action="'UpdateShare'" :fileList="fileList"></FileUploader>
        </el-form-item>
        <el-form-item :label="$t('thesis.category')" prop="category">
          <CategorySelector style="width: 100%;" @getCategories="getCategories" :catList="catList"></CategorySelector>
        </el-form-item>
        <el-form-item :label="$t('thesis.newCategory')" prop="newCategory">
          <el-input v-model="form.newCategory" type="textarea" :rows="4" :placeholder="$t('thesis.newCategoryComments')" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="update-share-btn">
      <el-button type="primary" @click="onSubmit" round>{{ $t('thesis.confirm') }}</el-button>
    </div>
  </div>
</template>

<script>
import i18n from "@/lang";
import {generalError, unexpectedError} from "@/utils/user";
import {validateThesis} from "@/utils/thesis";
import {mapState} from "vuex";
import FileUploader from "@/components/FileUploader.vue";
import CategorySelector from "@/components/CategorySelector.vue";
import {getTitle} from "@/utils/title";

export default {
  created() {
    document.title = getTitle("updateUpload");
  },
  components: {
    CategorySelector,
    FileUploader
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
      document.title = getTitle("updateUpload");
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
      fileList: [],
      catList: []
    }
  },
  methods: {
    getShareDetails() {
      const id = this.$route.params.id;
      this.$api.getMyShareById(id).then(res => {
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
            const obj = {
              name: this.form.title + "." + suffix,
              url: this.form.fileName
            };
            this.fileList.push(obj);
          }

          this.categories = res.data.data.categories;
          let arr = [];
          for (let obj of this.categories) {
            arr.push(obj);
          }
          this.catList = arr;

        } else if (res.data.code === 501) {
          this.$message.error(i18n.tc('thesis.thesisIdNotExist'));
          this.$router.push("/profile/MyUpload");
        } else if (res.data.code === 502) {
          this.$message.error(i18n.tc('share.notYourSharing'));
          this.$router.push("/profile/MyUpload");
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
    getFileName(val) {
      this.form.fileName = val;
    },
    getCategories(val) {
      this.form.category = val.toString();
    },
    onSubmit() {
      const regexNewLine = /\t|\n/gi;
      const regexAuthor = /，|、|；|;/gi;
      this.form.author = this.form.author.replaceAll(regexAuthor, ",");
      for (let key in this.form) {
        this.form[key] = this.form[key].trim().replaceAll(regexNewLine, "");
      }
      if(validateThesis(this.form)) {
        this.updateThesisSharing(this.$route.params.id, this.form);
      }
    },
    updateThesisSharing(id, share) {
      this.$api.updateThesisSharing(id, share).then(res => {
        if(res.data.code === 200) {
          this.$message({
            message: i18n.tc('share.updateSuccess'),
            type: 'success'
          });
          this.$router.push("/profile/MyUpload");
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
  }
}
</script>

<style lang="less" scoped>
.update-share-container {
  margin: 40px 25%;
}
.update-share-title {
  text-align: center;
  font-size: 1.5em;
}
.update-share-form {
  margin-top: 20px;
}
.update-share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>