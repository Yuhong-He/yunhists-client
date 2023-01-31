<template>
  <div class="auth-background">
    <div class="auth-container">
      <div class="auth-panel" :class="{active:isLogin}">

        <div class="login-box" v-if="isLogin">
          <el-row>
            <el-col :span="12" :offset="6">
              <div class="b-title">{{ $t('login.accountLogin') }}</div>
              <el-form ref="form" :model="loginForm">
                <el-form-item>
                  <el-input prefix-icon="el-icon-message" :placeholder="$t('login.email')" v-model="loginForm.email" clearable></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: -25px;">
                  <el-input prefix-icon="el-icon-lock" :placeholder="$t('login.password')" v-model="loginForm.password" clearable show-password></el-input>
                  <div class="reset_password">
                    <span>{{ $t('login.forgotPassword') }}</span>
                  </div>
                </el-form-item>
                <el-divider></el-divider>
                <el-form-item>
                  <el-button type="goon" @click="login" round>{{ $t('login.login') }}</el-button>
                  <el-button size="small" @click="google" round><font-awesome-icon style="color: red;" icon="fa-brands fa-google" /></el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>

        <div class="register-box" v-else>
          <el-row>
            <el-col :span="12" :offset="6">
              <div class="b-title">{{ $t('login.registerAccount') }}</div>
              <el-form ref="form" :model="registerForm">
                <el-form-item style="margin-bottom: 10px;">
                  <el-input prefix-icon="el-icon-message" :placeholder="$t('login.email')" v-model="registerForm.email" clearable></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 10px;">
                  <el-input prefix-icon="el-icon-user-solid" :placeholder="$t('login.username')" v-model="registerForm.name" clearable></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 10px;">
                  <el-input prefix-icon="el-icon-lock" :placeholder="$t('login.password')" v-model="registerForm.password" clearable show-password></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 10px;">
                  <el-input prefix-icon="el-icon-lock" :placeholder="$t('login.confirmPassword')" v-model="registerForm.repeatPassword" clearable show-password></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input prefix-icon="el-icon-info" :placeholder="$t('login.verificationCode')" v-model="registerForm.verificationCode" clearable>
                    <el-button slot="append" icon="el-icon-s-promotion">{{ $t('login.send') }}</el-button>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="goon" @click="register" round>{{ $t('login.register') }}</el-button>
                </el-form-item>
              </el-form>
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
export default{
  data(){
    return {
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        email: '',
        name: '',
        password: '',
        repeatPassword: '',
        verificationCode: ''
      },
      isLogin: true,
    }
  },
  methods:{
    changeType() {
      this.isLogin = !this.isLogin
      this.loginForm.email = ''
      this.loginForm.password = ''
      this.registerForm.email = ''
      this.registerForm.name = ''
      this.registerForm.password = ''
      this.registerForm.repeatPassword = ''
      this.registerForm.verificationCode = ''
    },
    login() {
      console.log("Login");
    },
    google() {
      console.log("Google Login");
    },
    register(){
      console.log("Register");
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
  padding-top: 6%;
  text-align: center;
}

.b-title {
  font-size: 2em;
  font-weight: bold;
  color: rgb(57,167,176);
  padding-bottom: 15px;
}

.reset_password {
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