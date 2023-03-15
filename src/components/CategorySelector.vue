<template>
  <div class="category-selector">
    <el-select
        v-model="categories"
        multiple
        filterable
        remote
        clearable
        :style="selectStyle"
        :placeholder="$t('category.searchCategory')"
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
    <el-button style="width: 15%; min-width: 68px; height: 41px" @click="newAddCatPage" v-if="userRights >= 1" plain>
      {{ $t('category.add') }}</el-button>
  </div>
</template>

<script>

import {mapState} from "vuex";
import {generalError, unexpectedError} from "@/utils/general";

export default {
  props: ['catList'],
  computed: {
    ...mapState('Settings', ['lang']),
    ...mapState('User', ['userRights'])
  },
  watch: {
    catList(val) {
      if(val && val.length > 0) {
        this.echoCat(val);
      }
    }
  },
  data() {
    return {
      options: [],
      categories: [],
      loading: false,
      selectStyle: ""
    }
  },
  mounted() {
    if(this.userRights < 1) {
      this.selectStyle = "width: 100%";
    } else {
      this.selectStyle = "width: 85%";
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
    doGetCategoryOptions(query) {
      this.options = [];
      this.$api.getCategoryOption(query, this.lang).then(res => {
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
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    newAddCatPage() {
      window.open("/category/add", '_blank')
    },
    echoCat(val) {
      val.forEach(cat => {
        let catOption = {};
        catOption.value = cat.id;
        if(this.lang === "zh") {
          catOption.label = cat.zhName;
        } else {
          catOption.label = cat.enName;
        }
        this.options.push(catOption);
        this.categories.push(cat.id);
      });
      this.$emit('getCategories', this.categories);
    }
  }
}
</script>

<style lang="less" scoped>
.category-selector {
  display: inline-flex;
}
</style>