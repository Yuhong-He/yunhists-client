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
      <el-submenu index="/admin" v-if="(this.userRights === 1)">
        <template slot="title">
          <span>
            <font-awesome-icon icon="fa-solid fa-gear" />
            <span class="nav-text">{{ $t('header.manage') }}</span>
          </span>
        </template>
        <el-menu-item index="/admin/approve">{{ $t('header.approve') }}</el-menu-item>
      </el-submenu>
      <el-menu-item style="float: right;" v-if="(!this.username || this.username.length === 0)" index="/login">
        <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
        <span class="nav-text">{{ $t('header.login') }}</span>
      </el-menu-item>
      <el-menu-item style="float: right;" v-if="(this.username && this.username.length > 0)" @click="logout">
        <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
        <span class="nav-text">{{ $t('header.logout') }}</span>
      </el-menu-item>
      <el-menu-item style="float: right;" v-if="(this.username && this.username.length > 0)" index="/profile">
        <font-awesome-icon icon="fa-solid fa-user" />
        <span class="nav-text">{{ this.username }}</span>
      </el-menu-item>
      <el-submenu style="float: right;" index="">
        <template slot="title">
          <span class="nav-text"><font-awesome-icon icon="fa-solid fa-language" /></span>
        </template>
        <el-menu-item @click="setLangTo('zh')" id="lang_zh">中文</el-menu-item>
        <el-menu-item @click="setLangTo('en')" id="lang_en">English</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex';
import i18n from "@/lang";
import {getToken, setToken} from "@/utils/token";

export default {
  data() {
    return {

    };
  },
  computed: {
    ...mapState('UserInfo', ['username', 'userRights'])
  },
  methods: {
    ...mapMutations('Settings', ['setLang']),
    ...mapMutations('UserInfo', ['setUserId', 'setUsername', 'setEmail', 'setUserRights','setPoints']),
    ...mapMutations('Aliyun', ['setAccessKeyId', 'setAccessKeySecret', 'setStsToken']),
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
      if(getToken().length > 0) {
        this.updateDatabaseLang(lang);
      }
    },
    logout() {
      this.$confirm(i18n.tc('header.confirmLogout'), {
        confirmButtonText: i18n.tc('header.confirm'),
        cancelButtonText: i18n.tc('header.cancel'),
        type: 'warning'
      }).then(() => {
        setToken("");
        this.setUserId("");
        this.setUsername("");
        this.setEmail("");
        this.setUserRights("");
        this.setPoints("");
        this.setAccessKeyId("");
        this.setAccessKeySecret("");
        this.setStsToken("");
        this.$router.go(-1);
        this.$message({
          type: 'success',
          message: i18n.tc('header.logoutSuccess')
        });
      }).catch(() => {});
    },
    async updateDatabaseLang(lang) {
      let res = await this.$api.updateLang({'lang': lang});
      if(res.data.code === 200) {
        setToken(res.data.data.token);
      }
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