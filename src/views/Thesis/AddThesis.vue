<template>
  <div class="add-thesis-container">
    <div class="open-parsing-btn-area">
      <el-button type="info" class="open-parsing-btn" @click="semiAutoParse" plain>{{ $t('thesis.autoInput') }}</el-button>
    </div>
    <div class="add-thesis-title">
      <h2>{{ $t('thesis.addThesis') }}</h2>
    </div>
    <div class="add-thesis-form">
      <ThesisForm :form="form" :categories="categories" :action="'Add'" @onSubmit="addThesis"></ThesisForm>
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
import {mapMutations, mapState} from "vuex";
import ThesisForm from "@/components/ThesisForm.vue";
import {authError} from "@/utils/user";
import i18n from "@/lang";
import $ from "jquery";

export default {
  computed: {
    ...mapState('UserInfo', ['userRights']),
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
      categories: [],
      openPanel: false,
      jsonObj: ''
    }
  },
  components: {
    ThesisForm
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
    addThesis(obj) {
      this.form = obj.form;
      this.categories = obj.categories;
      this.doAddThesis(this.form, this.categories);
    },
    async doAddThesis(thesis, categories) {
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
    parsing() {
      let json = {};
      if(this.jsonObj && this.jsonObj.length > 0) {
        try {
          json = $.parseJSON(this.jsonObj);
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
.open-parsing-btn-area {
  position: absolute;
  margin-left: 55%;
}
.parsing-info {
  a {
    text-decoration: none;
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
</style>