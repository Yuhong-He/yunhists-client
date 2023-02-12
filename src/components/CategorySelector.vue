<template>
  <el-select
      v-model="categories"
      multiple
      filterable
      remote
      reserve-keyword
      :placeholder="$t('components.categorySelector.searchCategory')"
      @change="getCategory"
      :remote-method="remoteMethod"
      :loading="loading">
    <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
    </el-option>
  </el-select>
</template>

<script>

import {mapState} from "vuex";

export default {
  computed: {
    ...mapState('Settings', ['lang'])
  },
  data() {
    return {
      options: [],
      categories: [],
      loading: false
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.doGetCategoryOptions(query);
      } else {
        this.options = [];
      }
    },
    getCategory(val) {
      this.$emit('getCategories', val);
    },
    async doGetCategoryOptions(query) {
      this.options = [];
      let res = await this.$api.getCategoryOption(query, this.lang);
      if(res.data.code === 200) {
        this.loading = false;
        res.data.data.catOptions.forEach(cat => {
          let catOption = {};
          catOption.value = cat.id;
          if(this.lang === "zh") {
            catOption.label = cat.zhName;
          } else {
            catOption.label = cat.enName;
          }
          this.options.push(catOption);
        });
      } else {
        console.log("Unexpected error");
      }
    }
  }
}
</script>

<style scoped>

</style>