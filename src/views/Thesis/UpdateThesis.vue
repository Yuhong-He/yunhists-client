<template>
  <div class="update-thesis-container">
    <div class="update-thesis-title">
      <h2>{{ $t('thesis.updateThesis') }}</h2>
    </div>
    <div class="update-thesis-form">
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
        <el-form-item v-if="this.form.type === '0'" :label="$t('thesis.issue')" prop="issue">
          <el-input v-model="form.issue" style="width: 50%" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('thesis.pages')" prop="pages">
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
          <FileUploader @getFileName="getFileName" :action="'Update'" :fileList="fileList"></FileUploader>
        </el-form-item>
        <el-form-item :label="$t('thesis.category')" prop="category">
          <CategorySelector style="width: 100%;" @getCategories="getCategories" :catList="catList"></CategorySelector>
        </el-form-item>
      </el-form>
    </div>
    <div class="update-thesis-btn">
      <el-button type="primary" @click="onSubmit" round>{{ $t('thesis.confirm') }}</el-button>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import i18n from "@/lang";
import {authError} from "@/utils/user";
import FileUploader from "@/components/FileUploader.vue";
import CategorySelector from "@/components/CategorySelector.vue";

export default {
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
        } else {
          this.form.issue = '';
          this.form.volume = '';
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.checkToken();
    this.getThesisDetails();
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
        fileName: ''
      },
      pickerOptions: {
        disabledDate(time) {
          const _now = Date.now()
          return time.getTime() > _now
        }
      },
      fileList: [],
      catList: [],
      categories: []
    }
  },
  methods: {
    async checkToken() {
      let res = await this.$api.validateToken();
      if(res.data.code === 200) {
        if(this.userRights < 1) {
          this.$message.error(i18n.tc('thesis.noPermissionVisit'));
          await this.$router.push("/");
        }
      } else {
        authError(res.data.code);
      }
    },
    getFileName(val) {
      this.form.fileName = val;
    },
    getCategories(val) {
      this.categories = val;
    },
    async getThesisDetails() {
      const id = this.$route.params.id;
      await this.$api.getThesisById(id).then(res => {
        if (res.data.code === 200) {
          const json = res.data.data.thesis;
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
        } else if (res.data.code === 407) {
          this.$message.error(i18n.tc('thesis.thesisIdNotExist'));
          this.$router.push("/thesis/list");
        } else {
          authError(res.data.code);
        }
      }).catch(() => {
        this.$message.error(i18n.tc('thesis.invalidId'));
        this.$router.push("/thesis/list");
      });
    },
    onSubmit() {
      const regexNewLine = /\t|\n/gi;
      const regexAuthor = /，|、|；|;/gi;
      this.form.author = this.form.author.replaceAll(regexAuthor, ",");
      for (let key in this.form) {
        this.form[key] = this.form[key].trim().replaceAll(regexNewLine, "");
      }
      if(this.validate(this.form)) {
        this.updateThesis(this.form, this.categories);
      }
    },
    validate(val) {
      if(!val.title.length > 0) {
        this.$alert(i18n.tc('thesis.inputTitle'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
        return false;
      }
      if(val.volume !== "") {
        if(isNaN(Number(val.volume))) {
          this.$alert(i18n.tc('thesis.volumeIsNum'), {
            confirmButtonText: i18n.tc('thesis.confirm'),
            callback: () => {}
          });
          return false;
        }
      }
      if(!(val.fileName && val.fileName.length > 0)) {
        this.$alert(i18n.tc('thesis.pleaseUploadFile'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
        return false;
      }
      return true;
    },
    async updateThesis(thesis, categories) {
      let parentCat = Array.from(categories).toString();
      let res = await this.$api.updateThesis(thesis, parentCat, this.$route.params.id);
      if(res.data.code === 200) {
        this.$message({
          message: i18n.tc('thesis.updateSuccess'),
          type: 'success'
        });
        await this.$router.go(-1);
      } else if(res.data.code === 303) {
        await this.$alert(i18n.tc('thesis.invalidCatId') + res.data.data.failedCatId, {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
        await this.$router.push("/thesis");
      } else if(res.data.code === 406) {
        await this.$alert(i18n.tc('thesis.thesisExist'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          callback: () => {}
        });
      } else {
        authError(res.data.code);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.update-thesis-container {
  margin: 40px 25%;
}
.update-thesis-title {
  text-align: center;
  font-size: 1.5em;
}
.update-thesis-form {
  margin-top: 20px;
}
.update-thesis-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>