<template>
  <div>
    <el-upload
        class="upload-demo"
        action=""
        drag
        list-type="text"
        :limit="1"
        :file-list="fileList"
        :auto-upload="true"
        :http-request="handleUploadFile"
        :on-preview="handlePreview"
        :before-remove="beforeRemove"
        :on-remove="handleRemove"
        :on-exceed="handleExceed">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">{{ $t('thesis.dragOr') }}<em>{{ $t('thesis.clickUpload') }}</em></div>
    </el-upload>
    <el-progress
        v-show="showProgress"
        :text-inside="true"
        :stroke-width="15"
        :percentage="progress"
    ></el-progress>
  </div>
</template>

<script>

import OSS from "ali-oss";
import i18n from "@/lang";
import {oss} from "@/utils/oss";

export default {
  props: ['action'],
  data() {
    return {
      fileList: [],
      showProgress: false,
      progress: 0,
      fileName: ''
    }
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message({
        message: i18n.tc('thesis.onlyUploadOne'),
        type: 'warning'
      })
    },

    beforeRemove(file, fileList) {
      if(this.progress !== 100) {
        return false;
      }
    },

    handlePreview(file) {
      if(this.progress === 100) {
        const response = {
          'content-disposition': `attachment; filename=${encodeURIComponent(file.name)}`
        }
        const url = new OSS(oss).signatureUrl(this.fileName, {response});
        window.open(url, '_blank');
      }
    },

    handleRemove(file, fileList) {
      if(this.progress === 100) {
        new OSS(oss).delete(this.fileName).then(() => {
          this.$message({
            message: i18n.tc('thesis.removeSuccess'),
            type: 'success'
          })
        }).catch(error => {
          this.$alert(error, i18n.tc('thesis.error'), {
            confirmButtonText: i18n.tc('thesis.confirm'),
            type: 'error',
            callback: () => {}
          });
        })
      }
    },

    handleUploadFile(file) {
      let that = this

      function getFileNameUUID() {
        function rx() {
          return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return `${+new Date()}_${rx()}${rx()}`
      }

      async function multipartUpload() {
        let temporary = file.file.name.lastIndexOf('.')
        let fileNameLength = file.file.name.length
        let fileFormat = file.file.name.substring(
            temporary + 1,
            fileNameLength
        )
        if(that.action === "Add") {
          that.fileName = "/default/" + getFileNameUUID() + '.' + fileFormat;
        } else if(that.action === "Share") {
          that.fileName = "/temp/" + getFileNameUUID() + '.' + fileFormat;
        } else {
          console.log("Something went wrong.")
        }

        new OSS(oss).multipartUpload(that.fileName, file.file, {
          progress: function(plan) {
            that.showProgress = true
            that.progress = Math.floor(plan * 100)
          }
        }).then(() => {
          that.$message({
            message: i18n.tc('thesis.uploadSuccess'),
            type: 'success'
          })
          that.showProgress = false
          that.$emit('getFileName', that.fileName)
        }).catch(error => {
          that.$alert(error, i18n.tc('thesis.error'), {
            confirmButtonText: i18n.tc('thesis.confirm'),
            type: 'error',
            callback: () => {}
          });
        })
      }

      multipartUpload()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-upload-list__item-name {
  cursor: pointer;
}
/deep/ .el-upload-list__item-name:hover {
  color: dodgerblue;
}
/deep/ .el-upload-list__item-name:active {
  color: darkorange;
}
</style>