import Vue from 'vue'
import App from './App.vue'
import VueRouter from "vue-router"
import VueResource from "vue-resource"
import Vuelidate from "vuelidate"
import { store } from "./store/store.js"
import { routes } from "./routes"

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(Vuelidate)

const router = new VueRouter({
  routes,
  mode:"history"
});

export const eventBus = new Vue()

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
