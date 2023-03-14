<template>
  <div class="auth-background">
    <div class="auth-container">
      <div class="auth-panel" :class="{active:isLogin}">

        <div class="login-box" v-if="isLogin">
          <el-row>
            <el-col :span="12" :offset="6">
              <div class="b-title">{{ $t('login.accountLogin') }}</div>
              <el-form :model="loginForm" :rules="loginRule" ref="loginForm">
                <el-form-item prop="login_email">
                  <el-input prefix-icon="el-icon-message" :placeholder="$t('login.email')" v-model="loginForm.login_email" clearable></el-input>
                </el-form-item>
                <el-form-item prop="login_password" style="margin-bottom: -5px;">
                  <el-input prefix-icon="el-icon-lock" :placeholder="$t('login.password')" v-model="loginForm.login_password" clearable show-password></el-input>
                </el-form-item>
              </el-form>
              <div class="reset_password">
                <span @click="resetPwdBox=true; resetPwdForm.resetPwd_email = loginForm.login_email">{{ $t('login.forgotPassword') }}</span>
              </div>
              <el-divider></el-divider>
              <el-button type="goon" @click="login('loginForm')" round :loading="loginLoading">
                {{ $t('login.login') }}
              </el-button>
              <el-button size="small" @click="google" round><font-awesome-icon style="color: red;" icon="fa-brands fa-google" /></el-button>
            </el-col>
          </el-row>
        </div>

        <div class="register-box" v-else>
          <el-row>
            <el-col :span="12" :offset="6">
              <div class="b-title">{{ $t('login.registerAccount') }}</div>
              <el-form :model="registerForm" :rules="registerRule" ref="registerForm">
                <el-form-item prop="register_email">
                  <el-input prefix-icon="el-icon-message" :placeholder="$t('login.email')" v-model="registerForm.register_email" clearable autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="register_name">
                  <el-input prefix-icon="el-icon-user-solid" :placeholder="$t('login.username')" v-model="registerForm.register_name" clearable autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="register_password">
                  <el-input prefix-icon="el-icon-lock" :placeholder="$t('login.password')" v-model="registerForm.register_password" clearable show-password autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="register_confirmPassword">
                  <el-input prefix-icon="el-icon-lock" :placeholder="$t('login.confirmPassword')" v-model="registerForm.register_confirmPassword" clearable show-password autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 15px;" prop="register_verificationCode">
                  <el-input prefix-icon="el-icon-info" :placeholder="$t('login.verificationCode')" v-model="registerForm.register_verificationCode" clearable autocomplete="off">
                    <el-button slot="append" icon="el-icon-s-promotion" id="v-email-btn" @click="verificationCode">
                      <span id="v-email-txt">{{ $t('login.send') }}</span>
                    </el-button>
                  </el-input>
                </el-form-item>
              </el-form>
              <el-button type="goon" @click="register('registerForm')" round>{{ $t('login.register') }}</el-button>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="small-box" :class="{active:isLogin}">
        <div class="small-container" v-if="isLogin">
          <div class="s-title">{{ $t('login.noAccount') }}</div>
          <button class="s-button" @click="changeType">{{ $t('login.registerAccount') }}</button>
        </div>

        <div class="small-container" key="smallContainLogin" v-else>
          <div class="s-title">{{ $t('login.haveAccount') }}</div>
          <button class="s-button" @click="changeType">{{ $t('login.accountLogin') }}</button>
        </div>
      </div>
    </div>
    <el-dialog
        :title="$t('login.resetPwd')"
        :visible.sync="resetPwdBox"
        :close-on-click-modal="false"
        top="16%"
        width="30%">
      <el-form :inline="true" :model="resetPwdForm" ref="resetPwdForm">
        <el-form-item :label="$t('login.email')">
          <el-input v-model="resetPwdForm.resetPwd_email" :placeholder="$t('login.email')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetPwd('resetPwdForm')">{{ $t('login.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
        :title="$t('login.caution')"
        :visible.sync="readPrivacy"
        width="30%">
      <span>{{ $t('login.cautionTxt1') }}<a href="/TermOfService" target="_blank">{{ $t('login.cautionTxt2') }}</a>{{ $t('login.cautionTxt3') }}<a href="/PrivacyPolicy" target="_blank">{{ $t('login.cautionTxt4') }}</a>{{ $t('login.cautionTxt5') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="readPrivacy = false">{{ $t('login.cancel') }}</el-button>
        <el-button type="success" @click="confirmRegister">{{ $t('login.register') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import i18n from "@/lang";
import $ from "jquery";
import {setToken} from "@/utils/token";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Loading } from 'element-ui';
import {firebaseConfig} from "@/utils/firebase";
import {getTitle} from "@/utils/title";
import {generalError, unexpectedError} from "@/utils/user";

export default{
  created() {
    document.title = getTitle("login");
  },
  watch: {
    '$i18n.locale'() {
      document.title = getTitle("login");
    }
  },
  computed: {
    ...mapState('Settings', ['lang'])
  },
  data(){
    const validateLoginEmail = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (value === '') {
        callback(new Error(i18n.tc('login.enterEmail')));
      } else if(!regex.test(value)) {
        callback(new Error(i18n.tc('login.invalidEmail')));
      } else {
        callback();
      }
    };
    const validateLoginPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(i18n.tc('login.enterPwd')));
      } else {
        callback();
      }
    };
    const validateRegisterEmail = (rule, value, callback) => {
      const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      if (value === '') {
        callback(new Error(i18n.tc('login.enterEmail')));
      } else if(!regex.test(value)) {
        callback(new Error(i18n.tc('login.invalidEmail')));
      } else {
        callback();
      }
    };
    const validateRegisterUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(i18n.tc('login.missUsername')));
      } else if(value.trim().length < 2 || value.trim().length > 15) {
        callback(new Error(i18n.tc('login.usernameLengthNotMatch')));
      } else {
        callback();
      }
    };
    const validateRegisterPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(i18n.tc('login.missPassword')));
      } else if(value.length < 6) {
        callback(new Error(i18n.tc('login.passwordLengthNotMatch')));
      } else {
        callback();
      }
    };
    const validateRegisterConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(i18n.tc('login.missConfirmPassword')));
      } else if(value !== this.registerForm.register_password) {
        callback(new Error(i18n.tc('login.passwordNotMatch')));
      } else {
        callback();
      }
    };
    const validateRegisterVerificationCode = (rule, value, callback) => {
      const regex = /^\d{6}$/;
      if (value === '') {
        callback(new Error(i18n.tc('login.missVerificationCode')));
      } else if(!regex.test(value)) {
        callback(new Error(i18n.tc('login.verificationNotMatch')));
      } else {
        callback();
      }
    };

    return {
      isLogin: true,
      resetPwdBox: false,
      loginForm: {
        login_email: '',
        login_password: ''
      },
      loginRule: {
        login_email: [
          { validator: validateLoginEmail, trigger: 'blur' }
        ],
        login_password: [
          { validator: validateLoginPassword, trigger: 'blur' }
        ]
      },
      registerForm: {
        register_email: '',
        register_name: '',
        register_password: '',
        register_confirmPassword: '',
        register_verificationCode: ''
      },
      registerRule: {
        register_email: [
          { validator: validateRegisterEmail, trigger: 'blur' }
        ],
        register_name: [
          { validator: validateRegisterUsername, trigger: 'blur' }
        ],
        register_password: [
          { validator: validateRegisterPassword, trigger: 'blur' }
        ],
        register_confirmPassword: [
          { validator: validateRegisterConfirmPassword, trigger: 'blur' }
        ],
        register_verificationCode: [
          { validator: validateRegisterVerificationCode, trigger: 'blur' }
        ]
      },
      resetPwdForm: {
        resetPwd_email: ''
      },
      loginLoading: false,
      readPrivacy: false
    }
  },
  methods:{
    ...mapMutations('Settings', ['setLang']),
    ...mapMutations('UserInfo', ['setUsername', 'setUserRights']),
    ...mapMutations('Aliyun', ['setAccessKeyId', 'setAccessKeySecret', 'setStsToken']),
    changeType() {
      this.isLogin = !this.isLogin;
      this.loginForm.login_email = '';
      this.loginForm.login_password = '';
      this.registerForm.register_email = '';
      this.registerForm.register_name = '';
      this.registerForm.register_password = '';
      this.registerForm.register_confirmPassword = '';
      this.registerForm.register_verificationCode = '';
      if(this.isLogin) {
        this.$nextTick(()=>{
          this.$refs["loginForm"].clearValidate();
        })
      } else {
        this.$nextTick(()=>{
          this.$refs["registerForm"].clearValidate();
        })
      }
    },
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.doLogin(this.loginForm.login_email, this.loginForm.login_password);
        }
      });
    },
    doLogin(email, password) {
      this.loginLoading = true;
      this.$api.login({'email': email, 'password': password}).then(res => {
        if(res.data.code === 200) {
          setToken(res.data.data.token);
          this.setUsername(res.data.data.username);
          this.setUserRights(res.data.data.userRights);
          this.setAccessKeyId(res.data.data.sts.accessKeyId);
          this.setAccessKeySecret(res.data.data.sts.accessKeySecret);
          this.setStsToken(res.data.data.sts.stsToken);
          this.setLang(res.data.data.lang);
          this.$i18n.locale = res.data.data.lang;
          this.loginLoading = false;
          this.$router.go(-1);
          this.$message({
            type: 'success',
            message: i18n.tc('login.welcome') + " " + res.data.data.username
          });
        } else if (res.data.code === 206) {
          this.loginLoading = false;
          this.$alert(i18n.tc('login.incorrectPwd'), {
            confirmButtonText: i18n.tc('login.confirm')
          }).catch(() => {});
        } else if (res.data.code === 208) {
          this.loginLoading = false;
          this.$alert(i18n.tc('login.emailNotRegistered'), {
            confirmButtonText: i18n.tc('login.confirm')
          }).catch(() => {});
        } else if (res.data.code === 209) {
          this.loginLoading = false;
          this.$alert(i18n.tc('login.googleAccount'), {
            confirmButtonText: i18n.tc('login.confirm')
          }).catch(() => {});
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    google() {
      initializeApp(firebaseConfig);
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      let loadingInstance = Loading.service({ fullscreen: true });
      signInWithPopup(auth, provider).then(googleResult => {
        const user = googleResult.user;
        this.$api.google(user.email, user.displayName, i18n.locale).then(loginResult => {
          if (loginResult.data.code === 200) {
            setToken(loginResult.data.data.token);
            this.setUsername(loginResult.data.data.username);
            this.setUserRights(loginResult.data.data.userRights);
            this.setAccessKeyId(loginResult.data.data.sts.accessKeyId);
            this.setAccessKeySecret(loginResult.data.data.sts.accessKeySecret);
            this.setStsToken(loginResult.data.data.sts.stsToken);
            this.setLang(loginResult.data.data.lang);
            this.$i18n.locale = loginResult.data.data.lang;
            this.$message({
              type: 'success',
              message: i18n.tc('login.welcome') + " " + loginResult.data.data.username
            });
            loadingInstance.close();
            this.$router.go(-1);
          } else if (loginResult.data.code === 215) {
            loadingInstance.close();
            this.$alert(i18n.tc('login.emailAccount'), {
              confirmButtonText: i18n.tc('header.confirm'),
              callback: () => {}
            }).then(() => {});
          } else {
            generalError(loginResult.data);
          }
        }).catch(loginResult => {
          unexpectedError(loginResult);
        })
      }).catch(googleResult => {
        unexpectedError(googleResult);
      })
    },
    register(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.readPrivacy = true;
        }
      });
    },
    confirmRegister() {
      this.readPrivacy = false;
      this.doRegister(
          this.registerForm.register_email,
          this.registerForm.register_name,
          this.registerForm.register_password,
          this.registerForm.register_confirmPassword,
          this.registerForm.register_verificationCode
      );
    },
    doRegister(email, username, pwd, pwd2, code) {
      this.$api.register(
          {'lang': this.lang, 'email': email, 'username': username,
           'password': pwd, 'password2': pwd2, 'code': code}).then(res => {
        if(res.data.code === 200) {
          this.$message({
            type: 'success',
            message: i18n.tc('login.registerSuccess')
          });
          this.isLogin = true;
          this.loginForm.login_email = email;
          this.loginForm.login_password = pwd;
        } else if (res.data.code === 218) {
          this.$alert(i18n.tc('login.noVerificationCodeSend'), {
            confirmButtonText: i18n.tc('login.confirm'),
            callback: () => {}
          });
        } else if (res.data.code === 215) {
          this.$alert(i18n.tc('login.emailRegistered'), {
            confirmButtonText: i18n.tc('login.confirm'),
            callback: () => {}
          });
        } else if (res.data.code === 214) {
          this.$alert(i18n.tc('login.incorrectCode'), {
            confirmButtonText: i18n.tc('login.confirm'),
            callback: () => {}
          });
        } else if (res.data.code === 213) {
          this.$alert(i18n.tc('login.codeExpired'), {
            confirmButtonText: i18n.tc('login.confirm'),
            callback: () => {}
          });
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
    verificationCode() {
      const email = this.registerForm.register_email;
      if(email && email.length > 0) {
        const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (regex.test(email)) {
          this.doSendVerificationEmail(email);
        } else {
          this.$alert(i18n.tc('login.invalidEmail'), {
            confirmButtonText: i18n.tc('login.confirm'),
            callback: () => {}
          });
        }
      } else {
        this.$alert(i18n.tc('login.enterEmail'), {
          confirmButtonText: i18n.tc('login.confirm'),
          callback: () => {}
        });
      }
    },
    doSendVerificationEmail (email) {
      this.$api.sendVerificationEmail({'lang': this.lang, 'email': email}).then(res => {
        if(res.data.code === 200) {
          $("#v-email-btn").css("cursor", "not-allowed");
          this.countDown();
          this.$message({
            type: 'success',
            message: i18n.tc('login.codeSent')
          });
        } else if (res.data.code === 211) {
          this.$message({
            type: 'warning',
            message: i18n.tc('login.waitCountDown')
          });
        } else if (res.data.code === 212) {
          this.$message({
            type: 'warning',
            message: i18n.tc('login.sendEmailFail')
          });
        } else if (res.data.code === 215) {
          this.$alert(i18n.tc('login.emailRegistered'), {
            confirmButtonText: i18n.tc('login.confirm'),
            callback: () => {}
          });
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
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
      $("#v-email-txt").text(i18n.tc('login.send'));
      $("#v-email-btn").css("cursor", "pointer");
    },
    resetPwd() {
      const email = this.resetPwdForm.resetPwd_email;
      if(email && email.length > 0) {
        const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if(regex.test(email)) {
          this.doResetPwd(email);
        } else {
          this.$alert(i18n.tc('login.invalidEmail'), {
            confirmButtonText: i18n.tc('login.confirm'),
            callback: () => {}
          });
        }
      } else {
        this.$alert(i18n.tc('login.enterEmail'), {
          confirmButtonText: i18n.tc('login.confirm'),
          callback: () => {}
        });
      }
    },
    doResetPwd(email) {
      this.$api.resetPassword({'email': email}).then(res => {
        if(res.data.code === 200) {
          this.resetPwdBox = false;
          this.$message({
            type: 'success',
            message: i18n.tc('login.newPwdSent')
          });
        } else if (res.data.code === 208) {
          this.$alert(i18n.tc('login.emailNotRegistered'), {
            confirmButtonText: i18n.tc('login.confirm')
          }).catch(() => {});
        } else if (res.data.code === 209) {
          this.$alert(i18n.tc('login.googleAccount'), {
            confirmButtonText: i18n.tc('login.confirm')
          }).catch(() => {});
        } else if(res.data.code === 211) {
          this.$message({
            type: 'warning',
            message: i18n.tc('login.waitSendEmail')
          });
        } else if(res.data.code === 212) {
          this.$message({
            type: 'warning',
            message: i18n.tc('login.sendEmailFail')
          });
        } else {
          generalError(res.data);
        }
      }).catch(res => {
        unexpectedError(res);
      })
    },
  }
}
</script>

<style lang="less" scoped>
.auth-background {
  height: 100vh;
  min-height: 500px;
  box-sizing: border-box;
  content: "";
  background: url(https://upload.wikimedia.org/wikipedia/commons/d/de/%E7%8E%89%E9%BE%99%E9%9B%AA%E5%B1%B1_Jade_Dragon_Snow_Mountain_-_panoramio.jpg) no-repeat center;
  background-size: cover;
  object-fit: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-container {
  width: 60vw;
  min-width: 500px;
  height: 35vw;
  min-height: 410px;
  position: relative;
  display: flex;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 3px #f0f0f0,
  0 0 6px #f0f0f0;
}

.auth-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 30%;
  transform: translateX(0%);
  transition: all 1s;
}

.login-box {
  width: 90%;
  text-align: center;
}

.register-box {
  width: 90%;
  text-align: center;
}

.b-title {
  font-size: 2em;
  font-weight: bold;
  color: rgb(57,167,176);
  padding-bottom: 15px;
}

.reset_password {
  padding-top: 10px;
  text-align: right;
  span {
    color: dodgerblue;
    cursor: pointer;
  }
}

.small-box {
  width: 30%;
  height: 100%;
  background: linear-gradient(135deg, rgb(57,167,176), rgb(56,183,145));
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(0%);
  transition: all 1s;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}

.small-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.s-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #fff;
  padding-bottom: 10px;
}

.s-button {
  width: 60%;
  height: 40px;
  border-radius: 24px;
  border: 1px solid #fff;
  outline: none;
  background-color: transparent;
  color: #fff;
  font-size: 1.2em;
  cursor: pointer;
}

.auth-panel.active {
  left: 0;
  transition: all 0.5s;
}

.small-box.active {
  left: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  transform: translateX(-100%);
  transition: all 1s;
}

.el-button--goon.is-active,
.el-button--goon:active {
  background: rgb(57,167,176);
  border-color: rgb(57,167,176);
  color: #fff;
}

.el-button--goon:focus,
.el-button--goon:hover {
  background: #48D1CC;
  border-color: #48D1CC;
  color: #fff;
}

.el-button--goon {
  color: #FFF;
  background-color: rgb(57,167,176);
  border-color: rgb(57,167,176);
}

a {
  text-decoration: none;
}
a:link {
  color: #0645AD;
}
a:visited {
  color: #0645AD;
}
a:hover {
  color: dodgerblue;
}
a:active {
  color: darkorange;
}
</style>