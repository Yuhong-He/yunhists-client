<template>
  <div>
    <FileUploader @getFileName="getFileName"></FileUploader>
  </div>
</template>

<script>

import FileUploader from "@/components/FileUploader.vue";

export default {
  data(){
    return{
      fileName: ''
    }
  },
  components: {
    FileUploader
  },
  methods:{
    getFileName(val) {
      this.fileName = val;
      console.log(this.fileName);
    }
  }
}
</script>

<style scoped>

</style>