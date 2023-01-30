<template>
  <div>
    <el-menu
        class="el-menu-demo"
        mode="horizontal"
        :default-active="activeMenu()"
        background-color="#f8f8f8"
        text-color="#000"
        active-text-color="#0096FF"
        menu-trigger="click"
        router
    >
      <el-menu-item index="/">
        <font-awesome-icon icon="fa-solid fa-house" />
        <span class="nav-text">首页</span>
      </el-menu-item>
      <el-menu-item index="/thesis/list">
        <font-awesome-icon icon="fa-solid fa-book-open" />
        <span class="nav-text">论文</span>
      </el-menu-item>
      <el-menu-item index="/category/list">
        <font-awesome-icon icon="fa-solid fa-folder-tree" />
        <span class="nav-text">分类</span>
      </el-menu-item>
      <el-submenu index="/admin">
        <template slot="title">
          <span>
            <font-awesome-icon icon="fa-solid fa-gear" />
            <span class="nav-text">管理</span>
          </span>
        </template>
        <el-menu-item index="/admin/approve">审批分享</el-menu-item>
      </el-submenu>
      <el-menu-item style="float: right;" index="/login">
        <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
        <span class="nav-text">登录</span>
      </el-menu-item>
      <el-menu-item style="float: right;" index="/profile">
        <font-awesome-icon icon="fa-solid fa-user" />
        <span class="nav-text">Alex</span>
      </el-menu-item>
      <el-submenu  style="float: right;" index="">
        <template slot="title">
          <span class="nav-text"><font-awesome-icon icon="fa-solid fa-language" /></span>
        </template>
        <el-menu-item index="">中文</el-menu-item>
        <el-menu-item index="">English</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1'
    };
  },
  methods: {
    activeMenu() {
      let route = this.$route;
      let {path, meta} = route;
      if(meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    }
  }
}
</script>

<style scoped>
.nav-text {
  font-size: 1.3em;
  margin-left: 7px;
}
</style>