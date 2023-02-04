<template>
  <div>
    <button @click="countDown">click</button>
    <span>{{countDownNum}}</span>
  </div>
</template>

<script>
export default {
  data(){
    return{
      countDownNum:60,
      timer:null
    }
  },
  methods:{
    countDown:function(){
      clearInterval(this.timer);
      this.countDownNum = 60;
      this.timer=setInterval(() => {
        this.countDownNum--;
        if(this.countDownNum<=0){
          clearInterval(this.timer);
        }
      },1000);
    }
  }
}
</script>

<style scoped>

</style>