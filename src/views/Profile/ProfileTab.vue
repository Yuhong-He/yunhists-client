<template>
  <div>
    <template>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('profile.userInfo')" name="UserInfo"></el-tab-pane>
        <el-tab-pane :label="$t('profile.myFavorite')" name="MyFavorite"></el-tab-pane>
        <el-tab-pane :label="$t('profile.mySharing')" name="MySharing"></el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: ''
    };
  },
  mounted() {
    if(this.$route.path === "/profile/userInfo") {
      this.activeName = "UserInfo";
    } else if(this.$route.path === "/profile/myFavorite") {
      this.activeName = "MyFavorite";
    } else if(this.$route.path === "/profile/mySharing") {
      this.activeName = "MySharing";
    }
  },
  methods: {
    handleClick(tab) {
      if(tab.name === "UserInfo") {
        this.$router.push("/profile/userInfo");
      } else if (tab.name === "MyFavorite") {
        this.$router.push("/profile/myFavorite");
      } else if (tab.name === "MySharing") {
        this.$router.push("/profile/mySharing");
      }
    }
  }
}
</script>

<style scoped>

</style>