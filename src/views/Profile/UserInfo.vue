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
        <el-button size="medium" type="danger" @click="deleteAccountPanel = true">{{ $t('profile.deleteAccount') }}</el-button>
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
        <el-button size="medium" @click="openChangeUsernamePanel">{{ $t('profile.change') }}</el-button>
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
        <el-button size="medium" @click="openChangeEmailPanel">{{ $t('profile.change') }}</el-button>
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
        <el-button size="medium" @click="openChangePasswordPanel">{{ $t('profile.change') }}</el-button>
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

    <el-dialog
        :title="$t('profile.confirmDeleteAccount')"
        :visible.sync="deleteAccountPanel"
        width="30%"
        center>
      <span>{{ $t('profile.confirmDeleteAccountInfo') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteAccountPanel = false">{{ $t('profile.cancel') }}</el-button>
        <el-button type="danger" @click="deleteAccount">{{ $t('profile.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
        :title="$t('profile.changeUsername')"
        :visible.sync="changeUsernamePanel"
        width="30%"
        :close-on-click-modal="false"
        center>
      <el-input
          :placeholder="$t('profile.inputNewUsername')"
          v-model="newUsername"
          clearable>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeUsernamePanel = false">{{ $t('profile.cancel') }}</el-button>
        <el-button type="primary" @click="changeUsername">{{ $t('profile.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
        :title="$t('profile.changeEmail')"
        :visible.sync="changeEmailPanel"
        width="30%"
        :close-on-click-modal="false"
        center>
      <div>
        <el-input
            :placeholder="$t('profile.inputNewEmail')"
            v-model="newEmail"
            clearable>
        </el-input>
      </div>
      <div class="dialog-multi-input">
        <el-input
            :placeholder="$t('profile.inputAccountPwd')"
            v-model="oldPassword"
            autocomplete="off"
            show-password
            clearable>
        </el-input>
      </div>
      <div class="dialog-multi-input">
        <el-input
            :placeholder="$t('profile.inputVerificationCode')"
            v-model="verificationCode"
            clearable>
          <el-button slot="append" icon="el-icon-s-promotion" id="v-email-btn" @click="sendChangeEmailEmail">
            <span id="v-email-txt">{{ $t('profile.send') }}</span>
          </el-button>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeEmailPanel = false">{{ $t('profile.cancel') }}</el-button>
        <el-button type="primary" @click="changeEmail">{{ $t('profile.confirm') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog
        :title="$t('profile.changePassword')"
        :visible.sync="changePasswordPanel"
        width="30%"
        :close-on-click-modal="false"
        center>
      <div>
        <el-input
            :placeholder="$t('profile.inputOldPwd')"
            v-model="oldPassword"
            autocomplete="off"
            show-password
            clearable>
        </el-input>
      </div>
      <div class="dialog-multi-input">
        <el-input
            :placeholder="$t('profile.inputNewPwd')"
            autocomplete="off"
            v-model="newPassword"
            show-password
            clearable>
        </el-input>
      </div>
      <div class="dialog-multi-input">
        <el-input
            :placeholder="$t('profile.inputNewPwd2')"
            v-model="newPassword2"
            autocomplete="off"
            show-password
            clearable>
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changePasswordPanel = false">{{ $t('profile.cancel') }}</el-button>
        <el-button type="primary" @click="changePassword">{{ $t('profile.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import {authError} from "@/utils/user";
import {setToken} from "@/utils/token";
import i18n from "@/lang";
import $ from "jquery";

export default {
  data() {
    return {
      deleteAccountPanel: false,
      changeUsernamePanel: false,
      newUsername: "",
      changeEmailPanel: false,
      newEmail: "",
      verificationCode: "",
      changePasswordPanel: false,
      oldPassword: "",
      newPassword: "",
      newPassword2: ""
    }
  },
  computed: {
    ...mapState('Settings', ['lang']),
    ...mapState('UserInfo', ['userId', 'username', 'email', 'userRights', 'points']),
    ...mapMutations('Aliyun', ['setAccessKeyId', 'setAccessKeySecret', 'setStsToken']),
    langSetting: {
      get() {
        if(this.lang === "zh") {
          return "中文";
        } else if (this.lang === "en") {
          return "English";
        }
      }
    },
    userRightsGroup: {
      get() {
        if(this.userRights === 0) {
          if(this.lang === "zh") {
            return "用户";
          } else if (this.lang === "en") {
            return "User";
          }
        } else if (this.userRights === 1) {
          if(this.lang === "zh") {
            return "管理员";
          } else if (this.lang === "en") {
            return "Admin";
          }
        }
      }
    },
    userLevel: {
      get() {
        return this.generateLevelName(this.points, this.lang);
      }
    }
  },
  mounted() {
    this.checkToken();
  },
  methods: {
    ...mapMutations('UserInfo', ['setUserId', 'setUsername', 'setEmail', 'setUserRights','setPoints']),
    async checkToken() {
      let res = await this.$api.validateToken();
      if(res.data.code !== 200) {
        authError(res.data.code);
      }
    },
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
    },
    deleteAccount() {
      this.doDeleteAccount();
    },
    async doDeleteAccount() {
      let res = await this.$api.deleteAccount();
      if(res.data.code === 200) {
        setToken("");
        this.setUserId("");
        this.setUsername("");
        this.setEmail("");
        this.setUserRights("");
        this.setPoints("");
        this.setAccessKeyId("");
        this.setAccessKeySecret("");
        this.setStsToken("");
        this.deleteAccountPanel = false;
        await this.$router.push('/');
        this.$message({
          type: 'success',
          message: i18n.tc('profile.accountDeleted')
        });
      } else {
        authError(res.data.code);
      }
    },
    openChangeUsernamePanel() {
      this.newUsername = this.username;
      this.changeUsernamePanel = true;
    },
    changeUsername() {
      if(this.newUsername && this.newUsername.trim().length > 0 && this.newUsername.trim().length < 15) {
        if(this.newUsername !== this.username) {
          this.doChangeUsername(this.newUsername.trim());
        } else {
          this.$message(i18n.tc('profile.usernameSame'));
        }
      } else {
        this.$message.error(i18n.tc('profile.usernameLength'));
      }
    },
    async doChangeUsername(username) {
      let res = await this.$api.updateUsername({"username": username});
      if(res.data.code === 200) {
        this.setUsername(username);
        this.changeUsernamePanel = false;
        this.$message({
          type: 'success',
          message: i18n.tc('profile.changeSuccess')
        });
      } else {
        authError(res.data.code);
      }
    },
    openChangeEmailPanel() {
      this.newEmail = this.email;
      this.oldPassword = "";
      this.changeEmailPanel = true;
      this.verificationCode = "";
    },
    sendChangeEmailEmail() {
      const email = this.newEmail;
      if(email && email.length > 0) {
        const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (regex.test(email)) {
          if(email !== this.email) {
            this.doSendChangeEmailEmail(email);
          } else {
            this.$message(i18n.tc('profile.emailSame'));
          }
        } else {
          this.$message({
            type: 'warning',
            message: i18n.tc('profile.invalidEmail')
          });
        }
      } else {
        this.$message({
          type: 'warning',
          message: i18n.tc('profile.inputNewEmail')
        });
      }
    },
    async doSendChangeEmailEmail(email) {
      let res = await this.$api.sendChangeEmailEmail({'email': email});
      if(res.data.code === 200) {
        $("#v-email-btn").css("cursor", "not-allowed");
        this.countDown();
        this.$message({
          type: 'success',
          message: i18n.tc('profile.codeSent')
        });
      } else if(res.data.code === 211) {
        this.$message({
          type: 'warning',
          message: i18n.tc('profile.waitCountDown')
        });
      } else if(res.data.code === 212) {
        this.$message.error(i18n.tc('profile.sendEmailFail'));
      } else if(res.data.code === 215) {
        this.$message.error(i18n.tc('profile.emailRegistered'));
      } else {
        authError(res.data.code);
      }
    },
    countDown() {
      clearInterval(this.timer);
      let countDownNum = 60;
      this.timer = setInterval(() => {
        countDownNum--;
        $("#v-email-txt").text(countDownNum + " s");
        if(countDownNum <= 0) {
          clearInterval(this.timer);
          this.restoreEmailBtn();
        }
      },1000);
    },
    restoreEmailBtn() {
      $("#v-email-txt").text(i18n.tc('profile.send'));
      $("#v-email-btn").css("cursor", "pointer");
    },
    changeEmail() {
      const email = this.newEmail;
      if(email && email.length > 0 && email) {
        if(email !== this.email) {
          const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
          if(regex.test(email)) {
            if(this.oldPassword && this.oldPassword.length > 0) {
              if(this.verificationCode && this.verificationCode.length === 6) {
                this.doChangeEmail(email, this.oldPassword, this.verificationCode);
              } else {
                this.$message({
                  message: i18n.tc('profile.input6VerificationCode'),
                  type: 'warning'
                });
              }
            } else {
              this.$message({
                message: i18n.tc('profile.inputOldPwd'),
                type: 'warning'
              });
            }
          } else {
            this.$message({
              message: i18n.tc('profile.invalidEmail'),
              type: 'warning'
            });
          }
        } else {
          this.$message(i18n.tc('profile.emailSame'));
        }
      } else {
        this.$message({
          message: i18n.tc('profile.inputNewEmail'),
          type: 'warning'
        });
      }
    },
    async doChangeEmail(email, password, code) {
      let res = await this.$api.updateEmail({'email': email, 'password': password, 'code': code});
      if(res.data.code === 200) {
        this.setEmail(email);
        this.changeEmailPanel = false;
        this.$message({
          type: 'success',
          message: i18n.tc('profile.changeSuccess')
        });
      } else if (res.data.code === 206) {
        this.$message.error(i18n.tc('profile.incorrectPwd'));
      } else if (res.data.code === 213) {
        this.$message.error(i18n.tc('profile.codeExpired'));
      } else if (res.data.code === 214) {
        this.$message.error(i18n.tc('profile.incorrectCode'));
      } else if (res.data.code === 218) {
        this.$message.error(i18n.tc('profile.noVerificationCodeSend'));
      } else {
        authError(res.data.code);
      }
    },
    openChangePasswordPanel() {
      this.oldPassword = "";
      this.newPassword = "";
      this.newPassword2 = "";
      this.changePasswordPanel = true;
    },
    changePassword() {
      if(this.oldPassword && this.oldPassword.length > 0) {
        if(this.newPassword && this.newPassword.length > 0) {
          if(this.newPassword.length >= 6) {
            if(this.newPassword === this.newPassword2) {
              this.doChangePassword(this.oldPassword, this.newPassword, this.newPassword2);
            } else {
              this.$message({
                message: i18n.tc('profile.newPwdNotMatch'),
                type: 'warning'
              });
            }
          } else {
            this.$message({
              message: i18n.tc('profile.passwordLengthNotMatch'),
              type: 'warning'
            });
          }
        } else {
          this.$message({
            message: i18n.tc('profile.inputNewPwd'),
            type: 'warning'
          });
        }
      } else {
        this.$message({
          message: i18n.tc('profile.inputOldPwd'),
          type: 'warning'
        });
      }
    },
    async doChangePassword(oldPwd, newPwd, newPwd2) {
      let res = await this.$api.updatePassword({'oldPwd': oldPwd, 'newPwd': newPwd, 'newPwd2': newPwd2});
      if(res.data.code === 200) {
        this.changePasswordPanel = false;
        this.$message({
          type: 'success',
          message: i18n.tc('profile.changeSuccess')
        });
      } else if (res.data.code === 206) {
        this.$message.error(i18n.tc('profile.incorrectPwd'));
      } else {
        authError(res.data.code);
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
.el-dialog__body span {
  word-break: normal;
}
.dialog-multi-input {
  padding-top: 10px;
}
</style>