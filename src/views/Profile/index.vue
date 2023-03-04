<template>
  <div class="profile-layout">
    <ProfileTab></ProfileTab>
    <router-view></router-view>
  </div>
</template>

<script>
import ProfileTab from "@/views/Profile/ProfileTab.vue";
import {mapState} from "vuex";

export default {
  computed: {
    ...mapState('UserInfo', ['username'])
  },
  mounted() {
    if(!(this.username && this.username.length > 0)) {
      this.$router.push("/login");
    }
  },
  components: {
    ProfileTab
  }
}
</script>

<style lang="less" scoped>
.profile-layout {
  display: block;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 3%;
}
</style>