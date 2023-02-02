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
                  <el-input prefix-icon="el-icon-message" :placeholder="$t('login.email')" v-model="loginForm.login_email" clearable autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item prop="login_password" style="margin-bottom: -5px;">
                  <el-input prefix-icon="el-icon-lock" :placeholder="$t('login.password')" v-model="loginForm.login_password" clearable show-password autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div class="reset_password">
                <span class="reset_password">{{ $t('login.forgotPassword') }}</span>
              </div>
              <el-divider></el-divider>
              <el-button type="goon" @click="login('loginForm')" round>{{ $t('login.login') }}</el-button>
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
                <el-form-item style="margin-bottom: 20px;" prop="register_verificationCode">
                  <el-input prefix-icon="el-icon-info" :placeholder="$t('login.verificationCode')" v-model="registerForm.register_verificationCode" clearable autocomplete="off">
                    <el-button slot="append" icon="el-icon-s-promotion" @click="verificationCode">{{ $t('login.send') }}</el-button>
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
  </div>
</template>

<script>
import {mapMutations} from "vuex";
import i18n from "@/lang";
import {setTokenCookie} from "@/utils/cookie";

export default{
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
      } else if(value.length < 2 || value.length > 15) {
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
      }
    }
  },
  methods:{
    ...mapMutations('UserInfo', ['setUserId']),
    ...mapMutations('UserInfo', ['setUsername']),
    ...mapMutations('UserInfo', ['setUserRights']),
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
    async doLogin(email, password) {
      let res = await this.$api.login({'email': email, 'password': password});
      if(res.data.code === 200) {
        this.setUserId(res.data.data.userId);
        this.setUsername(res.data.data.username);
        this.setUserRights(res.data.data.userRights);
        setTokenCookie(res.data.data.token);
        await this.$router.push('/');
        this.$message({
          type: 'success',
          message: i18n.tc('login.welcome') + " " + res.data.data.username
        });
      } else if (res.data.code === 207) {
        await this.$alert(i18n.tc('login.incorrectPwd'), {
          confirmButtonText: i18n.tc('login.confirm')
        }).catch(() => {});
      } else if (res.data.code === 208) {
        await this.$alert(i18n.tc('login.emailNotRegistered'), {
          confirmButtonText: i18n.tc('login.confirm')
        }).catch(() => {});
      } else if (res.data.code === 209) {
        await this.$alert(i18n.tc('login.googleAccount'), {
          confirmButtonText: i18n.tc('login.confirm')
        }).catch(() => {});
      }
    },
    google() {
      console.log("Google Login");
    },
    register(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.doRegister();
        }
      });
    },
    doRegister() {
      console.log("Register");
    },
    verificationCode() {
      console.log("Verification Code");
    }
  }
}
</script>

<style lang="less" scoped>
.auth-background {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  content: "";
  background: url(https://upload.wikimedia.org/wikipedia/commons/d/de/%E7%8E%89%E9%BE%99%E9%9B%AA%E5%B1%B1_Jade_Dragon_Snow_Mountain_-_panoramio.jpg) no-repeat center;
  background-size: cover;
  object-fit: cover;
  position: absolute;
}

.auth-container {
  width: 60%;
  height: 60%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 3px #f0f0f0,
  0 0 6px #f0f0f0;
}

.auth-panel {
  width: 70%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 30%;
  transform: translateX(0%);
  transition: all 1s;
}

.login-box {
  padding-top: 15%;
  text-align: center;
}

.register-box {
  padding-top: 3%;
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
  background: linear-gradient(135deg,rgb(57,167,176),rgb(56,183,145));
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
</style>