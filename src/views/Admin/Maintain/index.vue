<template>
  <div class="maintain-layout">
    <MaintenanceTab></MaintenanceTab>
    <router-view></router-view>
  </div>
</template>

<script>
import MaintenanceTab from "@/views/Admin/Maintain/MaintenanceTab.vue";

export default {
  components: {
    MaintenanceTab
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