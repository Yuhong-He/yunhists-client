<template>
  <div class="user-share-container">
    <div class="open-parsing-btn-area">
      <el-button type="info" class="open-parsing-btn" @click="semiAutoParse" plain>{{ $t('thesis.autoInput') }}</el-button>
    </div>
    <div class="user-share-title">
      <h2>{{ $t('thesis.shareNewThesis') }}</h2>
    </div>
    <div class="user-share-form">
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
          <FileUploader @getFileName="getFileName" :action="'Share'"></FileUploader>
        </el-form-item>
        <el-form-item :label="$t('thesis.category')" prop="category">
          <CategorySelector style="width: 100%;" @getCategories="getCategories"></CategorySelector>
        </el-form-item>
        <el-form-item :label="$t('thesis.newCategory')" prop="newCategory">
          <el-input v-model="form.newCategory" type="textarea" :rows="4" :placeholder="$t('thesis.newCategoryComments')" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-share-btn">
      <el-button type="primary" @click="onSubmit" :loading="isSubmitting" round>{{ $t('thesis.confirm') }}</el-button>
    </div>
    <el-dialog
        :title="$t('thesis.parseJSON')"
        :visible.sync="openPanel"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
        center>
      <p class="parsing-info">{{ $t('thesis.pleaseUse') }}<a href="https://greasyfork.org/zh-CN/scripts/460087-thesis-metadata-json-helper" target="_blank">{{ $t('thesis.tampermonkey') }}</a>{{ $t('thesis.inputGeneratedJSON') }}</p>
      <el-input
          type="textarea"
          autosize
          :autosize="{ minRows: 3, maxRows: 15}"
          :placeholder="$t('thesis.inputJson')"
          v-model="jsonObj"
          clearable>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelParsing">{{ $t('thesis.cancel') }}</el-button>
        <el-button type="primary" @click="parsing">{{ $t('thesis.parse') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import i18n from "@/lang";
import FileUploader from "@/components/FileUploader.vue";
import CategorySelector from "@/components/CategorySelector.vue";
import $ from "jquery";
import {generalError} from "@/utils/user";
import {validateThesis} from "@/utils/thesis";
import {getTitle} from "@/utils/title";

export default {
  created() {
    document.title = getTitle("addUpload");
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
  components: {
    CategorySelector,
    FileUploader
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
      document.title = getTitle("addUpload");
    }
  },
  mounted() {
    this.checkToken();
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
      openPanel: false,
      pickerOptions: {
        disabledDate(time) {
          const _now = Date.now()
          return time.getTime() > _now
        }
      },
      jsonObj: '',
      isSubmitting: false
    }
  },
  methods: {
    async checkToken() {
      let res = await this.$api.validateToken();
      if(res.data.code === 200) {
        if(this.userRights < 0) {
          this.$message.error(i18n.tc('thesis.noPermissionVisit'));
          await this.$router.push("/");
        }
      } else {
        generalError(res.data);
      }
    },
    semiAutoParse() {
      this.form = {
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
        fileName: this.form.fileName,
        category: this.form.category,
        newCategory: this.form.newCategory
      };
      this.openPanel = true;
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
        this.isSubmitting = true;
        this.shareThesis(this.form);
      }
    },
    async shareThesis(share) {
      let res = await this.$api.shareThesis(share);
      if(res.data.code === 200) {
        this.isSubmitting = false;
        this.$message({
          duration: 10000,
          showClose: true,
          message: i18n.tc('share.shareSuccess'),
          type: 'success'
        });
        await this.$router.push("/profile/MyUpload");
      } else {
        generalError(res.data);
      }
    },
    parsing() {
      if(this.jsonObj && this.jsonObj.length > 0) {
        try {
          let json = $.parseJSON(this.jsonObj);
          if(!_.isEmpty(json)) {
            for(const valKey in json) { // loop json from parsing
              for(const formKey in this.form) { // loop json for this form
                if(valKey === formKey) { // if key name match
                  if(valKey === "publication") {
                    if(json[valKey].includes(":")) {
                      json[valKey] = json[valKey].replace(":","（");
                      json[valKey] = json[valKey] + "）";
                    } else {
                      json[valKey] = json[valKey].replace("(","（");
                      json[valKey] = json[valKey].replace(")","）");
                    }
                  }
                  this.form[formKey] = json[valKey]; // assign value
                  break;
                }
              }
            }
          }
          this.openPanel = false;
          this.jsonObj = "";
        } catch (e) {
          this.$alert(i18n.tc('thesis.jsonFormatError'), {
            confirmButtonText: i18n.tc('thesis.confirm'),
            callback: () => {}
          });
        }
      }
    },
    cancelParsing() {
      this.openPanel = false;
      this.jsonObj = "";
    }
  }
}
</script>

<style lang="less" scoped>
.user-share-container {
  margin: 40px 25%;
}
.user-share-title {
  text-align: center;
  font-size: 1.5em;
}
.user-share-form {
  margin-top: 20px;
}
.user-share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
.open-parsing-btn-area {
  position: absolute;
  margin-left: 55%;
}
.parsing-info {
  a {
    text-decoration: none;
  }
  a:link {
    color: #0645AD;
  }
  a:visited {
    color: #0645AD;
  }
  a:hover {
    color: dodgerblue;
  }
  a:active {
    color: darkorange;
  }
}
</style>