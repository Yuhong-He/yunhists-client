<template>
  <div class="pagination">
    <el-pagination
        background
        @current-change="getPagination"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 100
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {}
  },
  methods: {
    getPagination(current) {
      this.$emit('getPagination', current);
    }
  }
};
</script>

<style scoped>

</style>
