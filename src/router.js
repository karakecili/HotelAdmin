import Vue from "vue"
import VueRouter from "vue-router"
import RequestManagement from "./components/RequestManagement.vue"
import UserManagement from "./components/UserManagement.vue"
import ModuleManagement from "./components/ModuleManagement.vue"
import PropertyManagement from "./components/PropertyManagement.vue"

import Auth from "./components/Auth.vue"

import store from "./store"

Vue.use(VueRouter)

const SubPage1 = {
    template: "<div>SubPage1</div>"
};

export const router = new VueRouter({
    routes: [
        {
            path: "/",
            name: "Talep Yönetimi",
            component: RequestManagement,
            beforeEnter(to, from, next) {
                if (store.getters.isAuthenticated) {
                    next()
                } else {
                    next("/auth")
                }
            }
        },
        {
            path: "/user-edit",
            name: "Kullanıcı Yönetimi",
            component: UserManagement,
            beforeEnter(to, from, next) {
                if (store.getters.isAuthenticated) {
                    next()
                } else {
                    next("/auth")
                }
            }
        },
        {
            path: "/property",
            name: "Mülk Yönetimi",
            component: PropertyManagement,
            beforeEnter(to, from, next) {
                if (store.getters.isAuthenticated) {
                    next()
                } else {
                    next("/auth")
                }
            }
        },

        {
            path: "/modules",
            name: "Hizmet Yönetimi",
            alias: ['/modules/il', '/modules/ilce', '/modules/havalimani', '/modules/araclar', '/modules/restaurant', '/modules/hotel'],
            component: ModuleManagement,
            beforeEnter(to, from, next) {
                if (store.getters.isAuthenticated) {
                    next()
                } else {
                    next("/auth")
                }
            }
        },
        {
            path: "/page/sub-page-1",
            name: "SubPage1",
            component: SubPage1
        },
        {path: "/auth", component: Auth}
    ],
    mode: "history"
});
