<template>
  <div>
    <div class="app">
      <div class="row1">
        <span class="clickable" @click="centerDialogVisible = true">{{ $t('footer.about') }}</span>
        <span class="vertical-bar"><font-awesome-icon icon="fa-solid fa-ellipsis-vertical" /></span>
        <span class="clickable">{{ $t('footer.term') }}</span>
        <span class="vertical-bar"><font-awesome-icon icon="fa-solid fa-ellipsis-vertical" /></span>
        <span class="clickable">{{ $t('footer.privacy') }}</span>
      </div>
      <div class="row2">
        <span class="copyright-icon"><font-awesome-icon icon="fa-regular fa-copyright" /></span>
        <span>{{ $t('footer.site') }}</span>
      </div>
      <el-dialog
          title="提示"
          :visible.sync="centerDialogVisible"
          width="60%"
          :lock-scroll="false"
          :append-to-body="true"
          center>
        <span>需要注意的是内容是默认不居中的</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      centerDialogVisible: false
    };
  }
}
</script>

<style lang="less" scoped>
.app {
  padding: 10px;
  text-align: center;
  font-size: 1.3em;
  color: rgb(50, 50, 50);
  .vertical-bar {
    padding-left: 10px;
    padding-right: 10px;
  }
  .row1 {
    .clickable {
      cursor: pointer;
    }
  }
  .row2 {
    padding-top: 5px;
    .copyright-icon {
      padding-right: 3px;
    }
  }
}
</style>