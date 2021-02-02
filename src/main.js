import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';

import "./assets/css/style.scss";
import "./assets/css/variable.scss";
import "./assets/css/responsive.scss";
import store from './store'
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
