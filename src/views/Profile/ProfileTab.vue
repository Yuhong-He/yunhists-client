<template>
  <div>
    <template>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('profile.userInfo')" name="UserInfo"></el-tab-pane>
        <el-tab-pane :label="$t('profile.mySharing')" name="MySharing"></el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  computed: {
    activeName: {
      get() {
        if(this.$route.path === "/profile/UserInfo") {
          return "UserInfo";
        } else if(this.$route.path === "/profile/MyUpload") {
          return "MySharing";
        }
      },
      set() {
        
      }
    }
  },
  methods: {
    handleClick(tab) {
      if(tab.name === "UserInfo") {
        this.$router.push("/profile/UserInfo");
      } else if (tab.name === "MySharing") {
        this.$router.push("/profile/MyUpload");
      }
    }
  }
}
</script>

<style scoped>

</style>