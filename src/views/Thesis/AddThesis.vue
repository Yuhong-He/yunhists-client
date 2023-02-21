<template>
  <div class="add-thesis-container">
    <div class="open-parsing-btn-area">
      <el-button type="info" class="open-parsing-btn" @click="semiAutoParse" plain>{{ $t('thesis.autoInput') }}</el-button>
    </div>
    <div class="add-thesis-title">
      <h2>{{ $t('thesis.addThesis') }}</h2>
    </div>
    <div class="add-thesis-form">
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
          <FileUploader @getFileName="getFileName" :action="'Add'"></FileUploader>
        </el-form-item>
        <el-form-item :label="$t('thesis.category')" prop="category">
          <CategorySelector style="width: 100%;" @getCategories="getCategories"></CategorySelector>
        </el-form-item>
      </el-form>
    </div>
    <div class="add-thesis-btn">
      <el-button type="primary" @click="onSubmit" round>{{ $t('thesis.confirm') }}</el-button>
    </div>
    <AutoParsingHelper :openPanel="openPanel" @getForm="getForm"></AutoParsingHelper>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import CategorySelector from "@/components/CategorySelector.vue";
import FileUploader from "@/components/FileUploader.vue";
import AutoParsingHelper from "@/components/AutoParsingHelper.vue";
import {authError} from "@/utils/user";
import i18n from "@/lang";

export default {
  computed: {
    ...mapState('UserInfo', ['userRights']),
    options() {
      return [{
        value: '中国知网',
        label: i18n.tc('thesis.cnki')
      }, {
        value: '维普资讯',
        label: i18n.tc('thesis.cqvip')
      }, {
        value: '自主出版',
        label: i18n.tc('thesis.selfPublish')
      }]
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
        fileName: ''
      },
      pickerOptions: {
        disabledDate(time) {
          const _now = Date.now()
          return time.getTime() > _now
        }
      },
      categories: [],
      openPanel: false
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
  components: {
    CategorySelector,
    FileUploader,
    AutoParsingHelper
  },
  methods: {
    ...mapMutations('UserInfo', ['setPoints']),
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
    getCategories(val) {
      this.categories = val;
    },
    getFileName(val) {
      this.form.fileName = val;
    },
    onSubmit() {
      console.log(this.form.year);
      const regexNewLine = /\t|\n/gi;
      const regexAuthor = /，|、|；|;/gi;
      this.form.author = this.form.author.trim().replaceAll(regexNewLine, "");
      this.form.author = this.form.author.replaceAll(regexAuthor, ",");
      this.form.title = this.form.title.trim().replaceAll(regexNewLine, "");
      this.form.publication = this.form.publication.trim().replaceAll(regexNewLine, "");
      this.form.location = this.form.location.trim().replaceAll(regexNewLine, "");
      this.form.publisher = this.form.publisher.trim().replaceAll(regexNewLine, "");
      this.form.volume = this.form.volume.trim().replaceAll(regexNewLine, "");
      this.form.issue = this.form.issue.trim().replaceAll(regexNewLine, "");
      this.form.pages = this.form.pages.trim().replaceAll(regexNewLine, "");
      this.form.doi = this.form.doi.trim().replaceAll(regexNewLine, "");
      this.form.isbn = this.form.isbn.trim().replaceAll(regexNewLine, "");
      this.form.onlinePublisher = this.form.onlinePublisher.trim().replaceAll(regexNewLine, "");
      this.form.onlinePublishUrl = this.form.onlinePublishUrl.trim().replaceAll(regexNewLine, "");
      if(this.validate(this.form)) {
        this.addThesis(this.form, this.categories);
      }
    },
    async addThesis(thesis, categories) {
      let parentCat = Array.from(categories).toString();
      let res = await this.$api.addThesis(thesis, parentCat);
      if(res.data.code === 200) {
        this.setPoints(res.data.data.points);
        this.$message({
          message: i18n.tc('thesis.addSuccess'),
          type: 'success'
        });
        await this.$router.push("/thesis");
      } else if(res.data.code === 303) {
        this.setPoints(res.data.data.points);
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
        fileName: ''
      };
      this.openPanel = true;
    },
    getForm(val) {
      if(!_.isEmpty(val)) {
        for(const valKey in val) { // loop json from component
          for(const formKey in this.form) { // loop json for this form
            if(valKey === formKey) { // if key name match
              if(valKey === "publication") {
                if(val[valKey].includes(":")) {
                  val[valKey] = val[valKey].replace(":","（");
                  val[valKey] = val[valKey] + "）";
                } else {
                  val[valKey] = val[valKey].replace("(","（");
                  val[valKey] = val[valKey].replace(")","）");
                }
              }
              this.form[formKey] = val[valKey]; // assign value
              break;
            }
          }
        }
      }
      this.openPanel = false;
    }
  }
}
</script>

<style lang="less" scoped>
.add-thesis-container {
  margin: 40px 25%;
}
.add-thesis-title {
  text-align: center;
  font-size: 1.5em;
}
.add-thesis-form {
  margin-top: 20px;
}
.add-thesis-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
.open-parsing-btn-area {
  position: absolute;
  margin-left: 55%;
}
</style>