<template>
  <div class="maintain-layout">
    <MaintenanceTab></MaintenanceTab>
    <router-view></router-view>
  </div>
</template>

<script>
import MaintenanceTab from "@/views/Admin/Maintain/MaintenanceTab.vue";
import i18n from "@/lang";
import {generalError} from "@/utils/user";
import {mapState} from "vuex";

export default {
  name: "index",
  components: {
    MaintenanceTab
  },
  computed: {
    ...mapState('UserInfo', ['userRights'])
  },
  mounted() {
    this.checkToken();
  },
  methods: {
    async checkToken() {
      let res = await this.$api.validateToken();
      if(res.data.code === 200) {
        if(this.userRights < 1) {
          this.$message.error(i18n.tc('thesis.noPermissionVisit'));
          await this.$router.push("/");
        }
      } else {
        generalError(res.data);
      }
    },
  }
}
</script>

<style scoped>
.maintain-layout {
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 30px;
}
</style>