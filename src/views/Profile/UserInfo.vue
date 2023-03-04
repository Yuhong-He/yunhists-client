<template>
  <div class="userinfo">
    <el-row>
      <div class="userinfo-description">
        <el-descriptions :title="$t('profile.account')" :column="2">
          <el-descriptions-item>
            <template slot="label">
              <span class="userinfo-description-icon">
                <font-awesome-icon icon="fa-regular fa-address-card" />
              </span>
              <span class="userinfo-description-text">{{ $t('profile.userId') }}</span>
            </template>
            <span class="userinfo-description-text">{{ userInfo.userId }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <span class="userinfo-description-icon">
                <font-awesome-icon icon="fa-solid fa-user" />
              </span>
              <span class="userinfo-description-text">{{ $t('profile.username') }}</span>
            </template>
            <span class="userinfo-description-text">{{ userInfo.username }}</span>
            <span class="userinfo-description-edit" @click="openChangeUsernamePanel"><font-awesome-icon icon="fa-regular fa-pen-to-square" /></span>
          </el-descriptions-item>
          <el-descriptions-item v-if="userInfo.registration === 0">
            <template slot="label">
              <span class="userinfo-description-icon">
                <font-awesome-icon icon="fa-solid fa-key" />
              </span>
              <span class="userinfo-description-text">{{ $t('profile.password') }}</span>
            </template>
            <span class="userinfo-description-text">xxxxxx</span>
            <span class="userinfo-description-edit" @click="openChangePasswordPanel"><font-awesome-icon icon="fa-regular fa-pen-to-square" /></span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <span class="userinfo-description-icon">
                <font-awesome-icon icon="fa-solid fa-envelope" />
              </span>
              <span class="userinfo-description-text">{{ $t('profile.email') }}</span>
              <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="$t('profile.onlyEmailRegisteredCanChange')">
                <span class="popup-text" slot="reference">
                  <span class="popup-icon"><font-awesome-icon icon="fa-solid fa-question" /></span>
                </span>
              </el-popover>
            </template>
            <span class="userinfo-description-text">{{ userInfo.email }}</span>
            <span class="userinfo-description-edit" v-if="userInfo.registration === 0" @click="openChangeEmailPanel"><font-awesome-icon icon="fa-regular fa-pen-to-square" /></span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <span class="userinfo-description-icon">
                <font-awesome-icon icon="fa-solid fa-registered" />
              </span>
              <span class="userinfo-description-text">{{ $t('profile.registration') }}</span>
            </template>
            <span class="userinfo-description-text">{{ registration_str }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <span class="userinfo-description-icon">
                <font-awesome-icon icon="fa-solid fa-user-group" />
              </span>
              <span class="userinfo-description-text">{{ $t('profile.userRightsGroup') }}</span>
            </template>
            <span class="userinfo-description-text">{{ userRightsGroup }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <span class="userinfo-description-icon">
                <font-awesome-icon icon="fa-solid fa-award" />
              </span>
              <span class="userinfo-description-text">{{ $t('profile.pointsLevel') }}</span>
              <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="$t('profile.levelTotal')">
                <span class="popup-text" slot="reference">
                  <span class="popup-icon"><font-awesome-icon icon="fa-solid fa-question" /></span>
                </span>
              </el-popover>
            </template>
            <span class="userinfo-description-text">{{ userInfo.points }}{{ $t('profile.points') }}{{ $t('profile.comma') }}{{ userLevel }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-row>
    <el-divider>
      <font-awesome-icon icon="fa-solid fa-gear" />
      <span class="divider-text">{{ $t('profile.preferenceSetting') }}</span>
    </el-divider>
    <el-row>
      <div class="setting-area">
        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column prop="item" :label="$t('profile.settings')" width="180"></el-table-column>
          <el-table-column prop="desc" :label="$t('profile.description')"></el-table-column>
          <el-table-column prop="setting" :label="$t('profile.operation')" width="160">
            <template v-slot="scope">
              <el-select v-if="scope.row.id === 1" v-model="selectLang" style="width: 90px" size="mini" @change="setLangTo">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-switch v-if="scope.row.id === 2" v-model="openEmailNotification" @change="changeEmailNotification" :active-text="$t('profile.on')"
                         :inactive-text="$t('profile.off')"></el-switch>
              <el-button v-if="scope.row.id === 3" size="mini" type="danger" @click="deleteAccountPanel = true">{{ $t('profile.deleteAccount') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
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
import {mapMutations} from "vuex";
import {generalError} from "@/utils/user";
import {setToken} from "@/utils/token";
import i18n from "@/lang";
import $ from "jquery";

export default {
  data() {
    return {
      userInfo: {
        userId: null,
        username: "",
        email: "",
        userRights: null,
        points: null,
        sendEmail: null,
        registration: null
      },
      registration_str: "",
      userRightsGroup: "",
      userLevel: "",
      deleteAccountPanel: false,
      changeUsernamePanel: false,
      newUsername: "",
      changeEmailPanel: false,
      newEmail: "",
      verificationCode: "",
      changePasswordPanel: false,
      oldPassword: "",
      newPassword: "",
      newPassword2: "",
      openEmailNotification: null,
      options: [{
        value: 'zh',
        label: '中文'
      }, {
        value: 'en',
        label: 'English'
      }]
    }
  },
  watch: {
    '$i18n.locale'() {
      this.refreshUserInfo();
    }
  },
  computed: {
    tableData() {
      return [
        {
          id: 1,
          item: i18n.tc('profile.lang'),
          desc: i18n.tc('profile.langDesc')
        },
        {
          id: 2,
          item: i18n.tc('profile.receiveEmail'),
          desc: i18n.tc('profile.receiveEmailDesc')
        },
        {
          id: 3,
          item: i18n.tc('profile.deleteAccount'),
          desc: i18n.tc('profile.deleteAccountDesc')
        }
      ]
    },
    selectLang: {
      get() {
        return i18n.locale;
      },
      set() {
        return i18n.locale;
      }
    }
  },
  mounted() {
    this.checkToken();
    this.generateUserInfo();
  },
  methods: {
    ...mapMutations('Settings', ['setLang']),
    ...mapMutations('UserInfo', ['setUserId', 'setUsername', 'setEmail', 'setUserRights','setPoints']),
    ...mapMutations('Aliyun', ['setAccessKeyId', 'setAccessKeySecret', 'setStsToken']),
    async generateUserInfo() {
      let res = await this.$api.getUserInfo();
      if(res.data.code === 200) {
        this.userInfo.userId = res.data.data.userId;
        this.userInfo.username = res.data.data.username;
        this.userInfo.email = res.data.data.email;
        this.userInfo.userRights = res.data.data.userRights;
        this.userInfo.points = res.data.data.points;
        this.userInfo.registration = res.data.data.registration;
        this.userInfo.sendEmail = res.data.data.sendEmail;

        if(this.userInfo.registration === 0) {
          this.registration_str = i18n.tc('profile.emailRegistration')
        } else if(this.userInfo.registration === 1) {
          this.registration_str = i18n.tc('profile.googleRegistration')
        }

        if(this.userInfo.userRights === 0) {
          if(i18n.locale === "zh") {
            this.userRightsGroup = "用户";
          } else if (i18n.locale === "en") {
            this.userRightsGroup = "User";
          }
        } else if (this.userInfo.userRights === 1) {
          if(i18n.locale === "zh") {
            this.userRightsGroup = "管理员";
          } else if (i18n.locale === "en") {
            this.userRightsGroup = "Admin";
          }
        }

        this.userLevel = this.generateLevelName(this.userInfo.points);

        this.openEmailNotification = this.userInfo.sendEmail === "ON";
      }
    },
    refreshUserInfo() {
      if(this.userInfo.registration === 0) {
        this.registration_str = i18n.tc('profile.emailRegistration')
      } else if(this.userInfo.registration === 1) {
        this.registration_str = i18n.tc('profile.googleRegistration')
      }

      if(this.userInfo.userRights === 0) {
        if(i18n.locale === "zh") {
          this.userRightsGroup = "用户";
        } else if (i18n.locale === "en") {
          this.userRightsGroup = "User";
        }
      } else if (this.userInfo.userRights === 1) {
        if(i18n.locale === "zh") {
          this.userRightsGroup = "管理员";
        } else if (i18n.locale === "en") {
          this.userRightsGroup = "Admin";
        }
      }

      this.userLevel = this.generateLevelName(this.userInfo.points);
    },
    async checkToken() {
      let res = await this.$api.validateToken();
      if(res.data.code !== 200) {
        generalError(res.data);
      }
    },
    generateLevelName(points) {
      points = parseInt(points);
      const zhName = ["布衣", "典史（无品）", "巡检（从九品）", "主簿（正九品）", "照磨（从八品）", "县丞（正八品）", "判官（从七品）", "知县（正七品）", "州同（从六品）", "通判（正六品）", "知州（从五品）", "同知（正五品）", "参议（从四品）", "知府（正四品）", "参政（从三品）", "按察使（正三品）", "布政使（从二品）", "都御史（正二品）", "少师（从一品）", "太师（正一品）"];
      const enName = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7", "Level 8", "Level 9", "Level 10", "Level 11", "Level 12", "Level 13", "Level 14", "Level 15", "Level 16", "Level 17", "Level 18", "Level 19", "Level 20"];
      if(points === 0) {
        if(i18n.locale === "zh") {
          return zhName[0];
        } else if(i18n.locale === "en") {
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
      if(i18n.locale === "zh") {
        return zhName[i - 1];
      } else if(i18n.locale === "en") {
        return enName[i - 1];
      }
    },
    async deleteAccount() {
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
        generalError(res.data);
      }
    },
    openChangeUsernamePanel() {
      this.newUsername = this.userInfo.username;
      this.changeUsernamePanel = true;
    },
    changeUsername() {
      if(this.newUsername && this.newUsername.trim().length > 0 && this.newUsername.trim().length < 15) {
        if(this.newUsername !== this.userInfo.username) {
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
        this.userInfo.username = username;
        this.$message({
          type: 'success',
          message: i18n.tc('profile.changeSuccess')
        });
      } else {
        generalError(res.data);
      }
    },
    openChangeEmailPanel() {
      this.newEmail = this.userInfo.email;
      this.oldPassword = "";
      this.changeEmailPanel = true;
      this.verificationCode = "";
    },
    sendChangeEmailEmail() {
      const email = this.newEmail;
      if(email && email.length > 0) {
        const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (regex.test(email)) {
          if(email !== this.userInfo.email) {
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
        generalError(res.data);
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
        if(email !== this.userInfo.email) {
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
        this.userInfo.email = email;
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
        generalError(res.data);
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
        generalError(res.data);
      }
    },
    setLangTo(val) {
      this.setLang(val);
      this.$i18n.locale = val;
      this.$api.updateLang({'lang': val});
    },
    async changeEmailNotification(val) {
      const status = val ? "ON" : "OFF";
      let res = await this.$api.updateEmailNotification(status);
      if(res.data.code === 200) {
        this.$message({
          type: 'success',
          message: i18n.tc('profile.changeSuccess')
        });
      } else {
        generalError(res.data);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.userinfo {
  min-height: 60vh;
}
.userinfo-description {
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 20px;
  .userinfo-description-icon {
    width: 25px;
    font-size: 1.2em;
    text-align: center;
  }
  .userinfo-description-text {
    font-size: 1.3em;
  }
  .userinfo-description-edit {
    margin-left: 5px;
    cursor: pointer;
    color: #0645AD;
    svg:hover {
      color: dodgerblue;
    }
    svg:active {
      color: darkorange;
    }
  }
}
.setting-area {
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 30px;
}
.divider-text {
  margin-left: 10px;
  font-size: 1.2em;
}
.popup-text {
  cursor: help;
  .popup-icon {
    font-size: 0.7em;
    margin-left: 2px;
  }
}
.el-dialog__body span {
  word-break: normal;
}
.dialog-multi-input {
  padding-top: 10px;
}
/deep/ .el-table .cell {
  word-break: normal;
}
</style>