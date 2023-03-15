<template>
  <div class="service-container">
    <div class="service-title">
      服务条款
    </div>
    <div class="service-body">
      <p>没时间想服务条款要怎么写。</p>
      <p>这只是测试版，所有用户数据和修改会在测试结束后被清除。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "zh"
}
</script>

<style lang="less" scoped>
.service-container {
  margin: 20px 10% 50px;
}
.service-title {
  text-align: center;
  line-height: 100px;
  font-size: 2em;
  font-weight: bold;
}
.service-body {
  font-size: 1.3em;
  line-height: 30px;
  p {
    margin-bottom: 20px;
  }
}
</style>