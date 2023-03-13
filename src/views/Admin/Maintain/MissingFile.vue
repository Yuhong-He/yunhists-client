<template>
  <div class="content">
    <ul>
      <li v-for="thesis of thesisList">
        <span class="fake-link" @click="$router.push('/thesis/update/' + thesis.id)">
          {{ thesis.title }}
        </span>
      </li>
    </ul>
    <el-empty v-if="thesisList.length === 0" :description="$t('admin.noData')"></el-empty>
  </div>
</template>

<script>
import {getTitle} from "@/utils/title";

export default {
  created() {
    document.title = getTitle("missingFile");
  },
  watch: {
    '$i18n.locale'() {
      document.title = getTitle("missingFile");
    }
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      thesisList: []
    }
  },
  methods: {
    async getData() {
      let res = await this.$api.getMissingFileTheses();
      if(res.data.code === 200) {
        this.thesisList = res.data.data;
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 20px;
}
ul {
  font-size: 1.3em;
  line-height: 2;
  -webkit-column-count: 3;
  -moz-column-count: 3;
  column-count: 3;
  column-gap: 50px;
  list-style-type:circle;
}
.fake-link {
  color: #0645AD;
  cursor: pointer;
}
.fake-link:hover {
  color: dodgerblue;
}
.fake-link:active {
  color: darkorange;
}
</style>