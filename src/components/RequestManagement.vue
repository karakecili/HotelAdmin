<template>
    <div class="container">
        <div :style="'max-height: calc(100vh - ' + (selectedOrder.OrderId != null ? '260' : '10') + 'px); overflow-y: auto; margin-bottom: 10px; border-bottom: .5px solid rgba(0,0,0,.125)'">
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
                                <div class="input-group-prepend dropleft" style="width: 100%;" ref="dropleft">
                                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width: 100%;" @click="selectOrder(Order)"> İşlem</button>
                                    <div class="dropdown-menu" style="padding: 0; border: 3px solid #460df4;" @click="$event.stopPropagation()" ref="dropdown">
                                        <table class="table-edited">
                                            <tr style="background-color: #0062cc;">
                                                <td><label>Durum:</label></td>
                                                <td>
                                                    <select name="" v-model="selectedOrder.OrderStatus" style="width: 100%;"> 
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
                        <td colspan="10" style="background-color: #fff4d0; color: #664d03;">
                            <div class="alert" style="background-color: #f2e8c5; border-color: #f2e8c5; color: #664d03; text-align: center;">
                                <strong>Henüz Burada Bir Kayıt Bulamadık</strong>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="selectedOrder.OrderId != null" style="max-height: 250px; overflow-y: auto;">
            <b-card no-body>
                <b-tabs card justified>
                    <b-tab title="Bilgiler" active>
                        <b-table striped hover :items="getOrderInfo" thead-tr-class="d-none" table-class="requestTable">
                            
                        </b-table>
                        <!-- <b-card-text v-for="Info in OrderInfo" :key="Info.RowId">Tab contents 1</b-card-text>
                        <b-card-text>Tab contents 1</b-card-text>
                        <b-card-text>Tab contents 1</b-card-text>
                        <b-card-text>Tab contents 1</b-card-text>
                        <b-card-text>Tab contents 1</b-card-text> -->
                    </b-tab>
                    <b-tab title="Loglar">
                        <b-table striped hover :items="getOrderLog" :fields="fields" table-class="requestTable">
                            
                        </b-table>
                    </b-tab>
                </b-tabs>
            </b-card>
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
        },
        created() {
            this.getOrdersList()
        },
        methods: {
            getOrdersList() {
                this.searchData.BeginDate = null
                this.searchData.EndDate = null

                this.$store.dispatch("getOrdersList", { ...this.searchData })
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
                    .then(() =>{
                            this.$refs.dropleft.filter(x => x.className == "input-group-prepend dropleft show")[0].className = 'input-group-prepend dropleft'
                            this.$refs.dropdown.filter(x => x.className == "dropdown-menu show")[0].className = 'dropdown-menu'
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