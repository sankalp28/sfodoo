<template>
  <div class="page-wrapper login-page">
    <div class="login-screen">
      <div class="login-content">
        <form @submit.prevent="login">
          <div class="sec-title">
            <h1>Login</h1>
            <p>Welcome back, please login to your account.</p>
            <div class="login-form">
              <div v-if="error.isError" class="alert alert-danger">{{error.message}}</div>
              <div class="login-field input-field">
                <i class="icon icon-user"></i>
                <!-- <div :class="{ 'hasError': $v.Username.$error}"></div> -->
                <input v-model="username" type="text" placeholder="User Name" required v-on:input="handleOnchange"/>
              </div>
              <div class="login-field input-field">
                <i class="icon icon-password"></i>
                <!-- <div :class="{ 'hasError': $v.Password.$error}"></div> -->
                <input type="password" placeholder="Password" v-model="password" required />
              </div>
              <div class="login-btn">
                <button class="input-btn" type="submit" :disabled="!username && !password">{{isLoging? 'Please Wait...':'Login'}}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="powered-by">
      <p>Powered By</p>
      <img src="@/assets/images/logo-dark.png" alt />
    </div>
  </div>
</template>
 <script>
import { mapState } from "vuex";

import {
  required,
  minLength,
  email,
  maxLength
} from "vuelidate/lib/validators";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: { isError:false, message:""},
      isLoging: false,
    };
  },
  computed: {
    ...mapState({ LoginResponse: state => state.auth.status })
  },
  watch: {
    LoginResponse() {
      if (this.LoginResponse.isresStatus.status === "SUCCESS") {
        this.isLoging = false;
       //  this.$router.push({ name: "CompareAssetsRecord" });
        if (
          this.LoginResponse.isresStatus.result.odoo === 0 ||
          this.LoginResponse.isresStatus.result.sf === 0
        ) {
          this.$router.push({ name: "setup" });
        } else {
          this.$router.push({ name: "CompareAssetsRecord" });
        }
      } else {
        if (this.LoginResponse.isresStatus.status === "failed") {
          this.isLoging = false;
          this.error = { isError: true, message: "Invalid Username/Password"};
        }
      }
    }
  },
  validations: {
    username: {
      required,
      email,
      minLength: minLength(5),
      maxLength: maxLength(50)
    },
    password: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(25)
    }
  },

  methods: {
    login() {
      const { username, password } = this;
      this.isLoging = true,
      this.error = { isError:false, message:""};
      localStorage.removeItem('pageIndex');
      localStorage.removeItem('pageIndexAccount');
      localStorage.removeItem('objectType');
      this.$store.dispatch("auth/login", { username, password });
    },
    submit() {
      this.$v.form.$touch();
      if (this.$v.form.$error) return alert("Form submitted");
    },
    handleOnchange(){
     this.error = { isError:false, message:""};
    }
  }
};
</script>
