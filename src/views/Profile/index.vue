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
  components: {
    ProfileTab
  }
}
</script>

<style lang="less" scoped>
.profile-layout {
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 30px;
}
</style>