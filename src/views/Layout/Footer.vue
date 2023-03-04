<template>
  <div>
    <div class="app">
      <div class="row1">
        <div>
          <span class="clickable" @click="$router.push('/about')">{{ $t('footer.about') }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="clickable" @click="$router.push('/TermOfService')">{{ $t('footer.term') }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="clickable" @click="$router.push('/PrivacyPolicy')">{{ $t('footer.privacy') }}</span>
        </div>
      </div>
      <div class="row2">
        <span class="copyright-icon"><font-awesome-icon icon="fa-regular fa-copyright" /></span>
        <span>{{ $t('footer.site') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {

  }
}
</script>

<style lang="less" scoped>
.app {
  text-align: center;
  font-size: 1.3em;
  color: rgb(50, 50, 50);
  .vertical-bar {
    padding-left: 10px;
    padding-right: 10px;
  }
  .row1 {
    .clickable {
      cursor: pointer;
    }
  }
  .row2 {
    padding-top: 5px;
    .copyright-icon {
      padding-right: 3px;
    }
  }
}
</style>