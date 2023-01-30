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
        <span class="nav-text">{{ $t('header.home') }}</span>
      </el-menu-item>
      <el-menu-item index="/thesis/list">
        <font-awesome-icon icon="fa-solid fa-book-open" />
        <span class="nav-text">{{ $t('header.thesis') }}</span>
      </el-menu-item>
      <el-menu-item index="/category/list">
        <font-awesome-icon icon="fa-solid fa-folder-tree" />
        <span class="nav-text">{{ $t('header.category') }}</span>
      </el-menu-item>
      <el-submenu index="/admin">
        <template slot="title">
          <span>
            <font-awesome-icon icon="fa-solid fa-gear" />
            <span class="nav-text">{{ $t('header.manage') }}</span>
          </span>
        </template>
        <el-menu-item index="/admin/approve">{{ $t('header.approve') }}</el-menu-item>
      </el-submenu>
      <el-menu-item style="float: right;" index="/login">
        <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
        <span class="nav-text">{{ $t('header.login') }}</span>
      </el-menu-item>
      <el-menu-item style="float: right;" index="/profile">
        <font-awesome-icon icon="fa-solid fa-user" />
        <span class="nav-text">Alex</span>
      </el-menu-item>
      <el-submenu style="float: right;" index="">
        <template slot="title">
          <span class="nav-text"><font-awesome-icon icon="fa-solid fa-language" /></span>
        </template>
        <el-menu-item index="" @click="setLangTo('zh')">中文</el-menu-item>
        <el-menu-item index="" @click="setLangTo('en')">English</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
    };
  },
  methods: {
    ...mapMutations('lang', ['setLang']),
    activeMenu() {
      let route = this.$route;
      let {path, meta} = route;
      if(meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    setLangTo(lang) {
      this.setLang(lang);
      this.$i18n.locale = lang;
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