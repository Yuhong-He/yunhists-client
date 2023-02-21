<template>
  <div>
    <el-table :data="tableData" v-loading="loading" border style="width: 100%" :empty-text="$t('category.noData')"
              @selection-change="changeSelection" @sort-change="changeTableSort">
      <el-table-column v-if="this.userRights >= 1" type="selection" width="39"></el-table-column>
      <el-table-column prop="zhName" :label="$t('category.zhName')">
        <template v-slot="scope">
          <el-link :underline="false" @click="$router.push('/category/id/' + scope.row.id)">{{ scope.row.zhName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="enName" :label="$t('category.enName')">
        <template v-slot="scope">
          <el-link :underline="false" @click="$router.push('/category/id/' + scope.row.id)">{{ scope.row.enName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="catTheses" :label="$t('category.thesesCount')" width="110" sortable="custom"></el-table-column>
      <el-table-column prop="catSubCats" :label="$t('category.subCatsCount')" width="120" sortable="custom"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  props: ["tableData", "loading"],
  computed: {
    ...mapState('UserInfo', ['userRights']),
  },
  methods: {
    changeSelection(selection) {
      this.$emit('getSelection', selection);
    },
    changeTableSort(column) {
      let sortOrder = "DESC";
      if(column.order === "ascending") {
        sortOrder = "ASC";
      }
      const obj = {
        sortCol: column.prop,
        sortOrder: sortOrder
      }
      this.$emit('getSortCol', obj);
    },
  }
}
</script>

<style scoped>

</style>