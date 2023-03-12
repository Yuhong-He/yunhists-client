<template>
  <router-view></router-view>
</template>

<script>

export default {

};
</script>

<style lang="less">
.el-year-table td.today .cell  {
  color: #606266 !important;
  font-weight: 400 !important;
}
.el-year-table td.today .cell:hover {
  color: #409EFF !important;
}
.el-year-table td .cell:hover, .el-year-table td.current:not(.disabled) .cell {
  color: #409EFF !important;
}
.el-popover {
  word-break: normal !important;
}
</style>
