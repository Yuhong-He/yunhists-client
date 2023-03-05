<template>
  <div class="content">
    <ul>
      <li v-for="thesis of thesisList"><a :href="'/thesis/update/' + thesis.id" target="_blank">{{ thesis.title }}</a></li>
    </ul>
    <el-empty v-if="thesisList.length === 0" :description="$t('admin.noData')"></el-empty>
  </div>
</template>

<script>
export default {
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
      let res = await this.$api.getThesisWithoutCat();
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
a {
  text-decoration: none;
}
a:link {
  color: #0645AD;
}
a:visited {
  color: #0645AD;
}
a:hover {
  color: dodgerblue;
}
a:active {
  color: darkorange;
}
</style>