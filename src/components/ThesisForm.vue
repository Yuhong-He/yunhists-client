<template>
  <div>
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
        <FileUploader @getFileName="getFileName" :action="this.action"></FileUploader>
      </el-form-item>
      <el-form-item :label="$t('thesis.category')" prop="category">
        <CategorySelector style="width: 100%;" @getCategories="getCategories"></CategorySelector>
      </el-form-item>
    </el-form>
    <div class="add-thesis-btn">
      <el-button v-if="this.action === 'Add'" type="primary" @click="onSubmit" round>{{ $t('thesis.confirm') }}</el-button>
    </div>
  </div>
</template>

<script>
import i18n from "@/lang";
import FileUploader from "@/components/FileUploader.vue";
import CategorySelector from "@/components/CategorySelector.vue";

export default {
  props: ["form", "categories", "action"],
  computed: {
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
  components: {
    CategorySelector,
    FileUploader
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          const _now = Date.now()
          return time.getTime() > _now
        }
      },
      componentCat: this.categories
    }
  },
  methods: {
    getFileName(val) {
      this.form.fileName = val;
    },
    getCategories(val) {
      this.componentCat = val;
    },
    onSubmit() {
      const regexNewLine = /\t|\n/gi;
      const regexAuthor = /，|、|；|;/gi;
      this.form.author = this.form.author.replaceAll(regexAuthor, ",");
      for (let key in this.form) {
        this.form[key] = this.form[key].trim().replaceAll(regexNewLine, "");
      }
      if(this.validate(this.form)) {
        const obj = {
          form: this.form,
          categories: this.componentCat
        }
        this.$emit('onSubmit', obj);
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
  }
}
</script>

<style lang="less" scoped>
.add-thesis-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>