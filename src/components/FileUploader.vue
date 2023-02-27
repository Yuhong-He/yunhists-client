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
import {generalError} from "@/utils/user";

export default {
  props: ['action', 'fileList'],
  data() {
    return {
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
      if(this.action === "Add" && this.progress !== 100) {
        return false;
      } else if(this.action === "Update" && this.fileName.length > 0 && this.progress !== 100) {
        return false;
      }
      return true;
    },
    handlePreview(file) {
      if(this.action === "Add") {
        if(this.progress === 100) {
          this.doDownloadFile(this.fileName, file.name);
        }
      } else if(this.action === "Update") {
        if(this.fileName.length > 0) {
          if(this.progress === 100) {
            this.doDownloadFile(this.fileName, file.name); // file upload
          }
        } else {
          this.doDownloadFile(file.url, file.name); // file from database
        }
      } else {
        console.log("Unexpected Action!!!");
      }
    },
    doDownloadFile(path, name) {
      const response = {
        'content-disposition': `attachment; filename=${encodeURIComponent(name)}`
      }
      const url = new OSS(oss).signatureUrl(path, {response});
      window.open(url, '_blank');
    },
    handleRemove(file, fileList) {
      if(this.action === "Add" || (this.action === "Update" && this.fileName.length > 0)) { // file url generated when upload
        this.doDeleteFile(this.fileName);
      } else if(this.action === "Update" && this.fileName.length === 0) { // file url from database
        this.deleteThesisFile(file.url)
      } else {
        console.log("Unexpected Action!!!");
      }
    },
    async deleteThesisFile(path) {
      let res = await this.$api.deleteThesisFile(path);
      if(res.data.code === 200) {
        this.doDeleteFile(path);
      } else if(res.data.code === 408) {
        await this.$alert(i18n.tc('thesis.noFileInDatabase'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          type: 'error',
          callback: () => {}
        });
      } else {
        generalError(res.data);
      }
    },
    doDeleteFile(url) {
      new OSS(oss).delete(url).then(() => {
        this.$message({
          message: i18n.tc('thesis.removeSuccess'),
          type: 'success'
        })
        this.$emit('getFileName', "");
      }).catch(error => {
        this.$alert(error, i18n.tc('thesis.error'), {
          confirmButtonText: i18n.tc('thesis.confirm'),
          type: 'error',
          callback: () => {}
        });
      })
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
        if(that.action === "Add" || that.action === "Update") {
          that.fileName = "default/" + getFileNameUUID() + '.' + fileFormat;
        } else if(that.action === "Share") {
          that.fileName = "temp/" + getFileNameUUID() + '.' + fileFormat;
        } else {
          console.log("Something went wrong.");
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
          that.showProgress = false;
          that.$emit('getFileName', that.fileName);
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