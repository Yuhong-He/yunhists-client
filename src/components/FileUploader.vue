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
import {ossConfig} from "@/utils/oss";
import {generalError, unexpectedError} from "@/utils/general";

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
      } else if(this.action === "Upload" && this.progress !== 100) {
        return false;
      } else if(this.action === "Update" && this.fileName.length > 0 && this.progress !== 100) {
        return false;
      } else if(this.action === "UpdateUpload" && this.fileName.length > 0 && this.progress !== 100) {
        return false;
      }
      return true;
    },
    handlePreview(file) {
      if(this.action === "Add" || this.action === "Upload") {
        if(this.progress === 100) {
          this.doDownloadFile(this.fileName, file.name);
        }
      } else if(this.action === "Update" || this.action === "UpdateUpload") {
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
    async doDownloadFile(path, name) {
      await this.$store.dispatch("Aliyun/checkAccessKeyId");
      const response = {
        'content-disposition': `attachment; filename=${encodeURIComponent(name)}`
      }
      const url = new OSS(ossConfig).signatureUrl(path, {response});
      window.open(url, '_blank');
    },
    handleRemove(file, fileList) {
      if(this.action === "Add" || this.action === "Upload" ||
          (this.action === "Update" && this.fileName.length > 0) ||
          (this.action === "UpdateUpload" && this.fileName.length > 0)) {
        this.doDeleteFile(this.fileName); // file url generated when upload
      } else if(this.action === "Update" && this.fileName.length === 0) {
        this.deleteThesisFile(file.url) // file url from database
      } else if(this.action === "UpdateUpload" && this.fileName.length === 0) {
        this.deleteUploadFile(file.url) // file url from database
      } else {
        console.log("Unexpected Action!!!");
      }
    },
    deleteThesisFile(path) {
      this.$api.deleteThesisFile(path).then(res => {
        if(res.data.code === 200) {
          this.doDeleteFile(path);
        } else if(res.data.code === 408) {
          this.$alert(i18n.tc('thesis.noFileInDatabase'), {
            confirmButtonText: i18n.tc('thesis.confirm'),
            type: 'error',
            callback: () => {}
          });
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    deleteUploadFile(path) {
      this.$api.deleteUploadFile(path).then(res => {
        if(res.data.code === 200) {
          this.doDeleteFile(path);
        } else if(res.data.code === 503) {
          this.$message.error(i18n.tc('upload.approvedUploadCanNotUpdate'));
          this.$router.push("/profile/MyUpload");
        } else if(res.data.code === 504) {
          this.$alert(i18n.tc('thesis.noFileInDatabase'), {
            confirmButtonText: i18n.tc('thesis.confirm'),
            type: 'error',
            callback: () => {}
          });
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    async doDeleteFile(url) {
      await this.$store.dispatch("Aliyun/checkAccessKeyId");
      new OSS(ossConfig).delete(url).then(() => {
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
        } else if(that.action === "Upload" || that.action === "UpdateUpload") {
          that.fileName = "temp/" + getFileNameUUID() + '.' + fileFormat;
        } else {
          unexpectedError("Invalid path");
        }
        await that.$store.dispatch("Aliyun/checkAccessKeyId");
        new OSS(ossConfig).multipartUpload(that.fileName, file.file, {
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