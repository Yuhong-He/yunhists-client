<template>
  <div class="app">
    <div class="site-title zh-name">滇史论辑</div>
    <div class="search-container">
      <span class="item"><font-awesome-icon icon="fa-solid fa-book-open" /></span>
      <div class="search-box">
        <input type="text" class="search-btn" id="search-btn" autocomplete="off" :placeholder="$t('home.search')">
      </div>
      <span class="item"><font-awesome-icon icon="fa-solid fa-magnifying-glass" /></span>
    </div>
    <div class="site-title en-name">Yunnan History Thesis System</div>
  </div>
</template>

<script>
import router from "@/router";

export default {
  mounted() {
    window.addEventListener("keydown", function(event) {
      const search_btn = document.getElementById("search-btn");
      let input = "";
      if(search_btn) {
        input = search_btn.value;
      }
      if(event.key === "Enter") {
        if(input && input.length > 0) {
          console.log(input);
          router.push({path:'/thesis/list'});
        }
      }
    }, true);
  }
}
</script>

<style lang="less" scoped>
.app {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 82vh;
}

.app::before {
  content: "";
  background: url(https://www.yunnanpedia.com/images/3/37/BannerBackgroundImage.jpg) no-repeat center;
  background-size: cover;
  width: 100%;
  height: 82%;
  position: absolute;
}

.search-container {
  height: 60px;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 30px;
  backdrop-filter: blur(2px);
  box-shadow: 0 0 5px 1px gray;
  z-index: 1;
}

.site-title {
  position: absolute;
  height: 40px;
  color: white;
  text-align: center;
  line-height: 40px;
  font-size: 40px;
  text-shadow: 0 0 20px #000;
}

.zh-name {
  top: 30%;
}

.en-name {
  top: 60%;
}

.search-box {
  width: 200px;
  transition: all 0.3s ease-in-out;
}

.search-box:hover {
  width: 440px;
}

.item {
  margin: auto 20px;
  font-size: 20px;
  opacity: 0;
  transition-delay: 0.3s;
  transition: all 0.3s ease;
}

.search-container:hover .item {
  opacity: 1;
}

.search-btn {
  width: 100%;
  border: none;
  text-align: center;
  outline: none;
  background: inherit;
  font-size: 20px;
  transition: all 0.5s ease-in-out;
}
</style>