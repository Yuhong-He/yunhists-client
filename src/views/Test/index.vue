<template>
  <div>
    <CategorySelector @getCategories="getCategories"></CategorySelector>
  </div>
</template>

<script>

import CategorySelector from "@/components/CategorySelector.vue";

export default {
  data(){
    return{
      categories: []
    }
  },
  components: {
    CategorySelector
  },
  methods:{
    getCategories(val) {
      this.form.categories = val;
    }
  }
}
</script>

<style scoped>

</style>