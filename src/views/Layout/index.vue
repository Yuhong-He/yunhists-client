<template>
  <div class="app">
    <div class="container">
      <div class="header">
        <Header></Header>
      </div>
      <div class="content">
        <Content></Content>
      </div>
      <div class="footer">
        <Footer></Footer>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './Header'
import Content from './Content'
import Footer from './Footer'
export default {
  components: {
    Header,
    Content,
    Footer
  },
}
</script>

<style lang="less" scoped>
.app {
  width: 100%;
  height: 100vh;
  .container {
    width: 100%;
    min-height: 100%;
    position: relative;
    box-sizing: border-box;
    padding-bottom: 70px;
    .footer {
      display:flex;
      align-items:center;
      justify-content:center;
      width: 100%;
      height: 70px;
      position: absolute;
      bottom: 0;
      border-top-style: groove;
      background-color: #f8f8f8;
    }
  }
}
</style>