<template>
  <div>
    <template>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="$t('admin.missingFile')" name="MissingFile"></el-tab-pane>
        <el-tab-pane :label="$t('admin.noCatThesis')" name="NoCatThesis"></el-tab-pane>
        <el-tab-pane :label="$t('admin.noCatCat')" name="NoCatCat"></el-tab-pane>
        <el-tab-pane :label="$t('admin.noChildCat')" name="NoChildCat"></el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    activeName: {
      get() {
        if(this.$route.path === "/admin/maintain/MissingFile") {
          return "MissingFile";
        } else if(this.$route.path === "/admin/maintain/NoCatThesis") {
          return "NoCatThesis";
        } else if(this.$route.path === "/admin/maintain/NoCatCat") {
          return "NoCatCat";
        } else if(this.$route.path === "/admin/maintain/EmptyCat") {
          return "NoChildCat";
        }
      },
      set() {

      }
    }
  },
  methods: {
    handleClick(tab) {
      if(tab.name === "MissingFile") {
        if(this.$router.currentRoute.path !== "/admin/maintain/MissingFile") {
          this.$router.push("/admin/maintain/MissingFile");
        }
      } else if(tab.name === "NoCatThesis") {
        if(this.$router.currentRoute.path !== "/admin/maintain/NoCatThesis") {
          this.$router.push("/admin/maintain/NoCatThesis");
        }
      } else if(tab.name === "NoCatCat") {
        if(this.$router.currentRoute.path !== "/admin/maintain/NoCatCat") {
          this.$router.push("/admin/maintain/NoCatCat");
        }
      } else if(tab.name === "NoChildCat") {
        if(this.$router.currentRoute.path !== "/admin/maintain/EmptyCat") {
          this.$router.push("/admin/maintain/EmptyCat");
        }
      }
    }
  }
}
</script>

<style scoped>

</style>