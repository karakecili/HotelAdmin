<template>
    <div class="pageContainer">
        <div :style="'overflow-y: auto; border-bottom: .5px solid rgba(0,0,0,.125); ' + 
            'max-height: calc(100vh - ' + (selectedOrder.OrderId != null && rows > perPage ? '290' : selectedOrder.OrderId != null ? '250' : rows > perPage ? '40' : '0') + 'px);'">
            <table class="table table-hover table-striped table-bordered requestTable">
                <thead>
                    <td>TalepId</td>
                    <td>Talep Türü
                        <select name="" id="slct_orderType" @change="getOrdersList" v-model="searchData.OrderType"> 
                            <option selected  value="null">Hepsi</option>
                            <option v-for="orderType in getOrderTypes" :value="orderType.OrderType" :key="orderType.OrderType">{{ orderType.OrderName }}
                            </option>
                        </select>
                    </td>
                    <td>Kullanıcı</td>
                    <td>Ad-Soyad</td>
                    <td>Mail</td>
                    <td>Telefon</td>
                    <td>Oda</td>
                    <td>Talep Tarihi</td>
                    <td>Talep Durumu
                        <select name="" id="slct_orderStatus" @change="getOrdersList" v-model="searchData.OrderStatus"> 
                            <option selected value="null">Hepsi</option>
                            <option v-for="orderStatus in getOrderStatus" :value="orderStatus.OrderStatus" :key="orderStatus.OrderStatus">{{ orderStatus.StatusName }}
                            </option>
                        </select>
                    </td>
                    <td>İşlem</td>
                    <td>Son İşlem Tarihi</td>
                </thead>
                <tbody>
                    <tr v-for="Order in getOrders" :key="Order.OrderId" @click="selectOrder(Order)">
                        <td> {{ Order.OrderId }} </td>
                        <td> {{ Order.OrderName }} </td>
                        <td> {{ Order.UserName }} </td>
                        <td> {{ Order.FirstName + " " + Order.LastName  }} </td>
                        <td> {{ Order.Mail }} </td>
                        <td> {{ Order.PhoneNumber }} </td>
                        <td> {{ Order.Possession }} </td>
                        <td> {{ Order.OrderDate | formatDate }} </td>
                        <td> {{ getOrderStatusById(Order.OrderStatus).StatusName }} </td>
                        <td>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend dropleft fullWidth" ref="dropleft">
                                    <button class="btn btn-outline-secondary dropdown-toggle fullWidth" type="button" data-toggle="dropdown" aria-haspopup="true" 
                                    aria-expanded="false" @click="selectOrder(Order)"> İşlem</button>
                                    <div class="dropdown-menu DDM" @click="$event.stopPropagation()" ref="dropdown">
                                        <table class="table-edited">
                                            <tr style="background-color: #0062cc;">
                                                <td><label>Durum:</label></td>
                                                <td>
                                                    <select name="" v-model="selectedOrder.OrderStatus" class="fullWidth"> 
                                                        <option v-for="orderStatus in getOrderStatus" :value="orderStatus.OrderStatus" :key="orderStatus.OrderStatus">{{ orderStatus.StatusName }}
                                                        </option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr style="background-color: #CEECF5;">
                                                <td><label>Not:</label></td>
                                                <td><input v-model="selectedOrder.Note" type="text" name="" id=""></td>
                                            </tr>
                                            <tr style="background-color: #0062cc;">
                                                <td></td>
                                                <td><button class="btn-primary" @click="setOrder()">Uygula</button></td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td> {{ Order.DB_Datetime | formatDate }} </td>
                    </tr>
                    <tr v-if="getOrders.length == 0">
                        <td colspan="12" class="noRequest">
                            <div class="alert noRequestDiv">
                                <strong>Henüz Burada Bir Kayıt Bulamadık</strong>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="selectedOrder.OrderId != null" class="requestLogs">
            <b-card no-body>
                <b-tabs card justified>
                    <b-tab title="Bilgiler" active>
                        <b-table striped hover :items="getOrderInfo" thead-tr-class="d-none" table-class="requestTable">
                            
                        </b-table>
                    </b-tab>
                    <b-tab title="Loglar">
                        <b-table striped hover :items="getOrderLog" :fields="fields" table-class="requestTable">
                            
                        </b-table>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
        <div class="paging" v-if="rows > perPage">
            <b-pagination
                v-model="currentPage"
                :total-rows="rows"
                :per-page="perPage"
                first-number
                last-number
                @input="getOrdersList"
            ></b-pagination>
            <div v-html="PagingText"></div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {required, minValue} from "vuelidate/lib/validators"

    export default {
        data() {
            return {
                searchData: {
                    OrderType: null,
                    BeginDate: null,
                    EndDate: null,
                    OrderStatus: null,
                    currentPage: 1,
                    perPage: 20,
                },
                selectedOrder: {
                    OrderStatus: null,
                    OrderId: null,
                    Note: null,
                    OrderType: null,
                },
                fields: [ 
                    { key: 'OrderStatus', label: 'İşlem Durumu', sortable: true, }, 
                    { key: 'Note', label: 'Not',  }, 
                    { key: 'UserName', label: 'Kullanıcı',  }, 
                    { key: 'Date', label: 'İşlem Tarihi', sortable: true } 
                ],
                rows: 0,
                perPage: 20,
                currentPage: 1,
            }
        },
        filters: {
            formatDate: function (value){
                let d = new Date(value)
                return d.toLocaleString()
            },
        },
        validations: {
            selectedLocation: {
                required,
                minValue: 0,
                checked(val, vm) {
                    return vm.selectedLocation === -1 ? false : true
                }
            },
            Adults: {
                required,
                minValue: minValue(1)
            }
        },
        computed: {
            ...mapGetters(["getOrderTypes"]),
            ...mapGetters(["getOrderStatus"]),
            ...mapGetters(["getOrders"]),
            ...mapGetters(["getOrderInfo"]),
            ...mapGetters(["getOrderLog"]),
            PagingText() {
                return '<b>' +  this.rows + '</b> kayıt arasında ' + ((this.currentPage - 1) * this.perPage + 1) + ' - ' + Math.min((this.currentPage * this.perPage), this.rows) + ' arası kayıtlar'
            },
        },
        created() {
            this.getOrdersList()
        },
        methods: {
            getOrdersList() {
                this.searchData.BeginDate = null
                this.searchData.EndDate = null
                
                this.searchData.perPage = this.perPage
                this.searchData.currentPage = this.currentPage

                this.$store.dispatch("getOrdersList", { ...this.searchData })
                    .then(Response => {
                        if (Response.length > 0) {
                            this.rows = Response[0].OrderCount
                        }
                        else {
                            this.rows = 0
                        this.currentPage = 1
                        }
                    })
            },
            getOrderStatusById(id) {
                return this.$store.getters.getOrderStatusById(id);
            },
            selectOrder(Order) {
                this.selectedOrder.OrderStatus = Order.OrderStatus
                this.selectedOrder.OrderId = Order.OrderId
                this.selectedOrder.OrderType = Order.OrderType
                this.selectedOrder.Note = ""

                this.$store.dispatch("getOrdersInfo", { ...this.selectedOrder })
                this.$store.dispatch("getOrderLog", { ...this.selectedOrder })
            },
            setOrder() {
                this.$store.dispatch("updateOrder", { ...this.selectedOrder })
                    .then(() => {
                            // this.$refs.dropleft.filter(x => x.className == "input-group-prepend dropleft show")[0].className = 'input-group-prepend dropleft'
                            // this.$refs.dropdown.filter(x => x.className == "dropdown-menu show")[0].className = 'dropdown-menu'
                            this.$refs.dropleft.find(x => x.className.includes("show")).classList.remove('show')
                            this.$refs.dropdown.find(x => x.className.includes("show")).classList.remove('show')
                            // setTimeout(() => this.getOrdersList(), 1000)   
                            this.getOrdersList()
                        }
                    )
                
            },
        }
    }
</script>

<style>
    .table > :not(caption) > * > * {
        border-width: 1px !important;
    }
</style>