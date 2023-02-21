<template>
  <div class="add-category-container">
    <div class="add-category-title">
      <h2>{{ $t('category.addCategory') }}</h2>
    </div>
    <div class="add-category-form">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('category.zhName')" prop="zhName">
          <el-input v-model="form.zhName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('category.enName')" prop="enName">
          <el-input v-model="form.enName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('category.parentCat')">
          <CategorySelector style="width: 100%;" @getCategories="getCategories"></CategorySelector>
        </el-form-item>
      </el-form>
    </div>
    <div class="add-category-btn">
      <el-button type="primary" @click="onSubmit('form')" round>{{ $t('category.confirm') }}</el-button>
    </div>
  </div>
</template>

<script>
import CategorySelector from "@/components/CategorySelector.vue";
import {mapState} from "vuex";
import {authError} from "@/utils/user";
import i18n from "@/lang";

export default {
  computed: {
    ...mapState('UserInfo', ['userRights'])
  },
  mounted() {
    this.checkToken();
  },
  data() {
    return {
      form: {
        zhName: '',
        enName: '',
        categories: []
      },
      rules: {
        zhName: [
          { required: true, message: i18n.tc('category.inputZhName'), trigger: 'blur' },
        ],
        enName: [
          { required: true, message: i18n.tc('category.inputEnName'), trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    CategorySelector
  },
  methods: {
    async checkToken() {
      let res = await this.$api.validateToken();
      if(res.data.code === 200) {
        if(this.userRights < 1) {
          this.$message.error(i18n.tc('category.noPermissionVisit'));
          await this.$router.push("/");
        }
      } else {
        authError(res.data.code);
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addCategory(this.form.zhName, this.form.enName, this.form.categories);
        } else {
          return false;
        }
      });
    },
    getCategories(val) {
      this.form.categories = val;
    },
    async addCategory(zhName, enName, categories) {
      let parentCat = Array.from(categories);
      let res = await this.$api.addCategory({"zhName": zhName, "enName": enName, "parentCat": parentCat});
      if(res.data.code === 200) {
        this.$message({
          type: 'success',
          message: i18n.tc('category.addSuccess')
        });
        await this.$router.push("/category");
      } else if(res.data.code === 301) {
        await this.$alert(i18n.tc('category.zhCatExist'), {
          confirmButtonText: i18n.tc('category.confirm'),
          callback: () => {}
        });
      } else if(res.data.code === 302) {
        await this.$alert(i18n.tc('category.enCatExist'), {
          confirmButtonText: i18n.tc('category.confirm'),
          callback: () => {}
        });
      } else {
        authError(res.data.code);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.add-category-container {
  transform: translateY(50%);
  margin-left: 30%;
  margin-right: 30%;
}
.add-category-form {
  margin-top: 20px;
}
.add-category-title {
  text-align: center;
  font-size: 1.5em;
}
.add-category-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>