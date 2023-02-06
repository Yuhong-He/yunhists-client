<template>
  <div class="userinfo">
    <el-row :gutter="40">
      <el-col class="grid-content" :span="8">
        <div class="info-title">{{ $t('profile.userId') }}</div>
      </el-col>
      <el-col class="grid-content" :span="8">
        <div class="info-text">{{ this.userId }}</div>
      </el-col>
      <el-col :span="8">
        <el-button size="medium" type="danger">{{ $t('profile.deleteAccount') }}</el-button>
      </el-col>
    </el-row>
    <el-divider><font-awesome-icon icon="fa-solid fa-gear" /></el-divider>
    <el-row :gutter="40">
      <el-col class="grid-content" :span="8">
        <div class="info-title">{{ $t('profile.username') }}</div>
      </el-col>
      <el-col class="grid-content" :span="8">
        <div class="info-text">{{ this.username }}</div>
      </el-col>
      <el-col :span="8">
        <el-button size="medium">{{ $t('profile.change') }}</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col class="grid-content" :span="8">
        <div class="info-title">
          <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="$t('profile.onlyEmailRegisteredCanChange')">
            <span class="popup-text" slot="reference">
              <span>{{ $t('profile.email') }}</span>
              <span class="popup-icon"><font-awesome-icon icon="fa-solid fa-circle-question" /></span>
            </span>
          </el-popover>
        </div>
      </el-col>
      <el-col class="grid-content" :span="8">
        <div class="info-text">{{ this.email }}</div>
      </el-col>
      <el-col :span="8">
        <el-button size="medium">{{ $t('profile.changeEmail') }}</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col class="grid-content" :span="8">
        <div class="info-title">{{ $t('profile.password') }}</div>
      </el-col>
      <el-col class="grid-content" :span="8">
        <div class="info-text">*********</div>
      </el-col>
      <el-col :span="8">
        <el-button size="medium">{{ $t('profile.change') }}</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col class="grid-content" :span="8">
        <div class="info-title">
          <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="$t('profile.changeLangAtNavbar')">
            <span class="popup-text" slot="reference">
              <span>{{ $t('profile.langSetting') }}</span>
              <span class="popup-icon"><font-awesome-icon icon="fa-solid fa-circle-question" /></span>
            </span>
          </el-popover>
        </div>
      </el-col>
      <el-col class="grid-content" :span="8">
        <div class="info-text">{{ langSetting }}</div>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
    <el-divider><font-awesome-icon icon="fa-solid fa-circle-info" /></el-divider>
    <el-row :gutter="40">
      <el-col class="grid-content" :span="8">
        <div class="info-title">{{ $t('profile.userRightsGroup') }}</div>
      </el-col>
      <el-col class="grid-content" :span="8">
        <div class="info-text">{{ userRightsGroup }}</div>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col class="grid-content" :span="8">
        <div class="info-title">
          <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :content="$t('profile.levelTotal')">
            <span class="popup-text" slot="reference">
              <span>{{ $t('profile.pointsLevel') }}</span>
              <span class="popup-icon"><font-awesome-icon icon="fa-solid fa-circle-question" /></span>
            </span>
          </el-popover>
        </div>
      </el-col>
      <el-col class="grid-content" :span="8">
        <div class="info-text">{{ this.points }}{{ $t('profile.points') }}{{ $t('profile.comma') }}{{ userLevel }}</div>
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapState('UserInfo', ['userId', 'username', 'email', 'userRights', 'points']),
    ...mapState('lang', ['prefLang']),
    langSetting: {
      get() {
        if(this.prefLang === "zh") {
          return "中文";
        } else if (this.prefLang === "en") {
          return "English";
        }
      }
    },
    userRightsGroup: {
      get() {
        if(this.userRights === 0) {
          if(this.prefLang === "zh") {
            return "用户";
          } else if (this.prefLang === "en") {
            return "User";
          }
        } else if (this.userRights === 1) {
          if(this.prefLang === "zh") {
            return "管理员";
          } else if (this.prefLang === "en") {
            return "Admin";
          }
        }
      }
    },
    userLevel: {
      get() {
        return this.generateLevelName(this.points, this.prefLang);
      }
    }
  },
  mounted() {
    if(this.$i18n.locale === "zh") {
      this.lang = "中文";
    } else if (this.$i18n.locale === "en") {
      this.lang = "English";
    }
  },
  methods: {
    generateLevelName(points, lang) {
      points = parseInt(points);
      const zhName = ["布衣", "典史（无品）", "巡检（从九品）", "主簿（正九品）", "照磨（从八品）", "县丞（正八品）", "判官（从七品）", "知县（正七品）", "州同（从六品）", "通判（正六品）", "知州（从五品）", "同知（正五品）", "参议（从四品）", "知府（正四品）", "参政（从三品）", "按察使（正三品）", "布政使（从二品）", "都御史（正二品）", "少师（从一品）", "太师（正一品）"];
      const enName = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9", "Level 10", "Level 11", "Level 12", "Level 13", "Level 14", "Level 15", "Level 16", "Level 17", "Level 18", "Level 19", "Level 20"];
      if(points === 0) {
        if(lang === "zh") {
          return zhName[0];
        } else if(lang === "en") {
          return enName[0];
        }
      }
      let i = 0;
      for(i = 0; i < 20; i++) {
        points = points - i;
        if(points < 0) {
          break;
        }
      }
      if(lang === "zh") {
        return zhName[i - 1];
      } else if(lang === "en") {
        return enName[i - 1];
      }
    }
  }
}
</script>

<style lang="less" scoped>
.userinfo {
  width: 90vw;
  height: 60vh;
}
.grid-content {
  height: 36px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.info-title {
  line-height: 36px;
  text-align: right;
  font-size: 1.8em;
  font-weight: bold;
}
.info-text {
  line-height: 36px;
  font-size: 1.8em;
}
.popup-text {
  cursor: help;
  .popup-icon {
    font-size: 0.5em;
    margin-left: 2px;
  }
}
</style>