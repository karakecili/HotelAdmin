<template>
    <div>
        <div id="view" :class="[{ collapsed: collapsed, offline: !$store.getters.isAuthenticated }]">
            <router-view></router-view>
        </div>
        <sidebar-menu class="sidebar"
                    :menu="menu"
                    :collapsed="collapsed"
                    @item-click="onItemClick"
                    @collapse="onCollapse"
                    :class="logoutClass" />
    </div>
</template>

<script>
    export default {
        name: "App",
        data() {
            return {
                menuItems: [
                    {
                        header: true,
                        title: "menü",
                    },
                    {
                        href: "/",
                        title: "Dashboard",
                        icon: "m1 fas fa-th-large",
                        tableName: "Tbl_Order"
                    },
                    {
                        href: "/requests",
                        title: "Talep Yönetimi",
                        icon: "m1 fas fa-envelope",
                        tableName: "Tbl_Order"
                    },
                    {
                        href: "/user-edit",
                        title: "Kullanıcı Yönetimi",
                        icon: "m1 fa fa-users",
                        tableName: "Tbl_User"
                    },
                    {
                        href: "/property",
                        title: "Mülk Yönetimi",
                        icon: "m1 fa fa-home",
                        tableName: "Tbl_User"
                    },
                    {
                        title: "Hizmet Yönetimi",
                        icon: "m1 fa fa-list-ul",
                        superadmin: true,
                        child: [
                            {
                                href: "/modules/il",
                                title: "İller",
                                icon: "m2 fa fa-map-marked",
                                module: "ListProvinces",
                                tableName: "Tbl_Province"
                            },
                            {
                                href: "/modules/ilce",
                                title: "İlçeler",
                                icon: "m2 fa fa-map-marked-alt",
                                module: "ListDistrict",
                                tableName: "Tbl_District"
                            },
                            {
                                href: "/modules/havalimani",
                                title: "Hava Limanları",
                                icon: "m2 fa fa-plane",
                                module: "ListAirport",
                                tableName: "Tbl_Airport"
                            },
                            {
                                href: "/modules/araclar",
                                title: "Araçlar",
                                icon: "m2 fa fa-car",
                                module: "ListVehicle",
                                tableName: "Tbl_Vehicle"
                            },
                            {
                                href: "/modules/restaurant",
                                title: "Restaurantlar",
                                icon: "m2 fa fa-utensils",
                                module: "ListRestaurants",
                                tableName: "Tbl_Restaurant",
                                imagePath: "restaurants"
                            },
                            {
                                href: "/modules/hotel",
                                title: "Projeler",
                                icon: "m2 fa fa-hotel",
                                module: "ListMansion",
                                tableName: "Tbl_Mansion",
                                imagePath: "hotels"
                            },
                        ],
                    },
                    {
                        href: "/activities",
                        title: "Aktivite Yönetimi",
                        icon: "m1 fas fas fa-hiking",
                        tableName: "Tbl_User",
                        superadmin: true,
                    },
                    {
                        href: "#",
                        title: "Çıkış",
                        icon: "m1 fa fa-sign-out-alt",
                        tableName: "logout"
                    },
                    {
                        header: true,
                        hiddenOnCollapse: true,
                        disabled: false,
                        class: 'imgLogo',
                        // icon: {
                        //     element: 'div',
                        //     class: 'imgLogo',
                        //     // attributes: {}
                        //     // text: ''
                        // },
                    }
                ],
                collapsed: false,
            };
        },
        mounted() {
            this.menuItems[0].title = "merhaba " + localStorage.FullName
        },
        computed: {
            logoutClass() {
                return {
                    'd-none': !this.$store.getters.isAuthenticated
                }
            },
            menu() {
                if (this.$store.state.Roles.length != 0) {
                    let role = this.$store.getters.getRoleById(localStorage.RoleId).RoleName;
                    if (role != 'Superadmin') {
                        return this.menuItems.filter((item) => {
                            return !item.superadmin
                        })
                    }
                }

                return this.menuItems // return all the items
            },
        },
        methods: {
            onItemClick(e, i) {
                if (i.tableName == "logout") {
                    this.$store.dispatch("logout")
                } else {
                    this.$store.state.CurrentTable = i.tableName == undefined ? this.$store.state.CurrentTable : i.tableName

                    if(i.module != undefined) {
                        this.$store.state.CurrentPK = i.tableName.substring(4) + 'Id'
                        this.$store.commit("AssignModuleInfo", {
                            CurrentTable: i.tableName,
                            CurrentPK: i.tableName.substring(4) + 'Id',
                            CurrentImagePath: i.imagePath ?? '',
                            CurrentModule: i.module
                        })
                        
                        this.$store.dispatch(i.module)
                    }
                }
            },
            onCollapse(c) {
                this.collapsed = c;
            },
        },
        watch: {
            $route: {
                immediate: true,
                handler(to, from) {
                    console.log(to)
                    console.log(from)

                }
            }
        }
    };
</script>

<style>
    #view {
        padding-left: 350px;
    }

    #view.collapsed {
        padding-left: 50px;
    }

    #view.offline {
        padding-left: 0px;
    }

    .sidebar.v-sidebar-menu .vsm-arrow:after {
        content: "\f105";
        font-family: "FontAwesome";
    }

    .sidebar.v-sidebar-menu .collapse-btn:after {
        content: "\f07e";
        font-family: "FontAwesome";
    }

    .v-sidebar-menu .vsm-item.active-item>.vsm-link {
        
        font-weight: 400 !important;
    }

    .v-sidebar-menu .vsm-item.first-item.active-item>.vsm-link>.vsm-icon, .router-link-exact-active {
        color: #D6B761 !important;
    }

    .vsm-item.first-item.open-item>.vsm-link {
        background-color: #1e1e2180 !important;
    }

    .vsm-header {
        margin: 10px 0;
    }
    
    .m2 {    
        width: 18px !important;
        height: 30px;
        /* background-color: inherit !important; */
    }
    
    .m1 {
        height: 30px;
        width: 20px !important;
        background-color: inherit !important;
    }

    .vsm-list {        
        display: flex;
        flex-direction: column;
    }

    .imgLogo {
        background: #2a2a2e url("../../../images/logo/logoWhite.png") 50% 0 no-repeat !important;
        width: 100% !important;
        min-height: 35px !important;
        background-size: contain !important;
        position: relative;
        margin-top: auto;
    }


</style>
