<template>
  <div>
    <SingleCategorySelector @getCategories="getCategories"></SingleCategorySelector>
  </div>
</template>

<script>

import SingleCategorySelector from "@/components/SingleCategorySelector.vue";

export default {
  data(){
    return{
      categories: []
    }
  },
  components: {
    SingleCategorySelector
  },
  methods:{
    getCategories(val) {
      console.log(val)
    }
  }
}
</script>

<style scoped>

</style>