<template>
  <div class="content">
    <ul>
      <li v-for="cat of catList">
        <span class="fake-link" @click="$router.push('/category/id/' + cat.id)">
          <span v-if="$i18n.locale === 'zh'">{{ cat.zhName }}</span>
          <span v-if="$i18n.locale === 'en'">{{ cat.enName }}</span>
        </span>
      </li>
    </ul>
    <el-empty v-if="catList.length === 0" :description="$t('admin.noData')"></el-empty>
  </div>
</template>

<script>
import {getTitle} from "@/utils/title";
import {generalError, unexpectedError} from "@/utils/user";

export default {
  created() {
    document.title = getTitle("emptyCat");
  },
  watch: {
    '$i18n.locale'() {
      document.title = getTitle("emptyCat");
    }
  },
  mounted() {
    this.getData();
  },
  data() {
    return {
      catList: []
    }
  },
  methods: {
    getData() {
      this.$api.getEmptyCat().then(res => {
        if(res.data.code === 200) {
          this.catList = res.data.data;
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
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