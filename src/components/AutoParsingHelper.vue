<template>
  <div>
    <el-dialog
        :title="$t('thesis.parseJSON')"
        :visible.sync="openPanel_1"
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
import i18n from "@/lang";
import $ from "jquery";

export default {
  props: ['openPanel'],
  watch: {
    openPanel() {
      this.openPanel_1 = this.openPanel;
    }
  },
  data() {
    return {
      jsonObj: '',
      openPanel_1: this.openPanel,
      form: {}
    }
  },
  methods: {
    parsing() {
      let json = {};
      if(this.jsonObj && this.jsonObj.length > 0) {
        try {
          json = $.parseJSON(this.jsonObj);
          this.form = json;
          this.$emit('getForm', this.form);
          this.openPanel_1 = false;
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
      this.$emit('getForm', {});
      this.openPanel_1 = false;
      this.jsonObj = "";
    }
  }
}
</script>

<style lang="less" scoped>
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