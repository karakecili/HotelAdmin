import Vue from 'vue'
import App from './App.vue'
import { router } from "./router"
import store from "./store"
import Vuelidate from "vuelidate"
import Axios from 'axios'
import VueRouter from "vue-router";
import VueSidebarMenu from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

Vue.use(VueRouter);
Vue.use(VueSidebarMenu);
Vue.use(Vuelidate)

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// Vue.use(FormDatepickerPlugin)

Axios.defaults.baseURL = "http://192.168.10.71/HelisAppWebAPI/api"
// Axios.defaults.baseURL = "http://192.168.1.24/HelisAppWebAPI/api"
// Axios.defaults.baseURL = "http://192.168.1.39/HelisAppWebAPI/api"

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
