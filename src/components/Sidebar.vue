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
                menu: [
                    {
                        header: true,
                        title: "Menü",
                    },
                    {
                        href: "/",
                        title: "Talep Yönetimi",
                        icon: "m1 fa fa-calendar-alt",
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
                        icon: "m1 fa fa-house-user",
                        tableName: "Tbl_User"
                    },
                    {
                        title: "Hizmet Yönetimi",
                        icon: "m1 fa fa-list-ul",
                        child: [
                            {
                                href: "/modules/il",
                                title: "İller",
                                icon: "m2 fa fa-map-marked-alt",
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
                                title: "Hoteller",
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
                        tableName: "Tbl_User"
                    },
                    {
                        href: "#",
                        title: "Çıkış",
                        icon: "m1 fa fa-sign-out-alt",
                        tableName: "logout"
                    },
                ],
                collapsed: false,
            };
        },
        computed: {
            logoutClass() {
                return {
                    'd-none': !this.$store.getters.isAuthenticated
                }
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
                        
                        // this.$store.dispatch("ListFields", i.tableName)
                        //     .then(() => {
                        //         this.$store.dispatch(i.module)
                        //     })
                        
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

    /* .m1:hover {
        background-color: inherit !important;
    } */

    /* .vsm-icon {
        background-color: inherit !important;
    } */
    
    .m2 {    
        width: 18px !important;
        height: 30px;
        /* background-color: inherit !important; */
    }
    
    .m1 {

        height: 30px;
        width: 30px !important;
        background-color: inherit !important;
    }
    

</style>
