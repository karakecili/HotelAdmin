import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import { router } from "./router"

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        loginUserId: null,
        roleId: null,
        SessionKey: "",
        Orders: [],
        OrderTypes: [
            { OrderType: 1, OrderName: "Konaklama" }, 
            { OrderType: 2, OrderName: "Transfer" }, 
            { OrderType: 3, OrderName: "Rent a Car & Boat" }, 
            { OrderType: 4, OrderName: "Restaurant" }, 
            { OrderType: 5, OrderName: "Kuru Temizleme" }, 
            { OrderType: 6, OrderName: "Aktiviteler" }, 
            { OrderType: 7, OrderName: "Asistan" }, 
        ],
        OrderStatus: [
            { OrderStatus: 1, StatusName: "Talep Oluşturuldu" }, 
            { OrderStatus: 2, StatusName: "Bekliyor" }, 
            { OrderStatus: 3, StatusName: "Teklif Sunuldu" }, 
            { OrderStatus: 4, StatusName: "Teklif Kabul Edildi" }, 
            { OrderStatus: 5, StatusName: "Teklif Red Edildi" }, 
        ],
        PossessionStatus: [
            { PossessionStatus: 1, PossessionName: "Müşteri Sahip" }, 
            { PossessionStatus: 2, PossessionName: "Müşteri Sahip Kiralık" }, 
            { PossessionStatus: 3, PossessionName: "Firma Sahip Satılık" }, 
            { PossessionStatus: 4, PossessionName: "Firma Sahip Kiralık" }, 
            { PossessionStatus: 5, PossessionName: "Firma Sahip Ziyaretlik" }, 
            { PossessionStatus: 6, PossessionName: "Kullanım Dışı" }, 
        ],
        RentableStatus: [
            { RentableStatus: 1, RentableName: " Yeni İstek" }, 
            { RentableStatus: 2, RentableName: " Teklif Sunuldu" }, 
            { RentableStatus: 3, RentableName: " Sözleşme Aşamasında" }, 
            { RentableStatus: 4, RentableName: " Kabul Edildi" }, 
            { RentableStatus: 5, RentableName: " Reddedildi" }, 
        ],
        OrderInfo: [],
        OrderLog: [],
        AdminList: [],
        Users: [],
        Roles: [],
        ModuleData: [],
        Fields: [],
        Mansions: [],
        Blocks: [],
        Possessions: [],
        PossessionInfo: {},
        RequestList: [],
        ActivityType: [],
        DB_Action: [
            { ActionId: 1, Action: "Yeni İşlem" },
            { ActionId: 2, Action: "Düzenlendi" },
            { ActionId: 0, Action: "Silindi" },
        ],
        Provinces: [],
        District: [],
        Vehicles: [ "Araç", "Tekne" ],
        CurrentTable: "",
        CurrentPK: "",
        CurrentImagePath: "",
        CurrentModule: "",
    },
    mutations: {
        setSession(state, data){
            state.roleId = data.RoleId
            state.SessionKey = data.Session
            state.loginUserId = data.UserId
        },
        clearSession(state){
            state.loginUserId = null
            state.roleId = null
            state.SessionKey = ""
        },
        updateOrderList(state, item) {
            state.Orders.push(item);
        },
        updateOrderInfo(state, item) {
            state.OrderInfo.push(item);
        },
        updateOrderLog(state, item) {
            state.OrderLog.push(item);
        },
        updateUserList(state, item) {
            state.Users.push(item);
        },
        updateAdminList(state, item) {
            state.AdminList.push(item);
        },
        updateRoleList(state, item) {
            state.Roles.push(item);
        },
        updateModuleData(state, item) {
            item.ID = item[state.CurrentPK]
            item._rowVariant = item.DB_Action == 0 ? 'danger' : ''
            state.ModuleData.push(item);
        },
        updateFields(state, item) {
            state.Fields.push(item);
        },
        updateMansions(state, item) {
            state.Mansions.push(item);
        },
        updateBlocks(state, item) {
            state.Blocks.push(item);
        },
        updatePossessions(state, item) {
            state.Possessions.push(item);
        },
        updatePossessionInfo(state, item) {
            state.PossessionInfo = item;
        },
        updateRequestList(state, item) {
            state.RequestList.push(item);
        },
        AssignModuleInfo(state, data) {
            // state.Fields = []
            state.ModuleData = []
            state.CurrentTable = data.CurrentTable
            state.CurrentPK = data.CurrentPK
            state.CurrentImagePath = data.CurrentImagePath
            state.CurrentModule = data.CurrentModule
        },
        updateActivityTypeList(state, item) {
            state.ActivityType.push(item);
        },
    },
    actions: {
        initAuth({ commit, dispatch }){
            
            let SessionKey = localStorage.getItem("Session")
            if(SessionKey != null) {
                axios.get("Session/AdminSessionControl?" + "SessionKey=" + SessionKey)
                    .then(response => {
                        if(response.data) {
                            commit("setSession", { 
                                RoleId: localStorage.getItem("RoleId"), 
                                Session: localStorage.getItem("Session"), 
                                UserId: localStorage.getItem("UserId")})

                            dispatch("getRolesList")
                            dispatch("getAdminsList")
                            dispatch("ListProvinces")
                            dispatch("ListDistrict")
                            dispatch("ListMansions")
                            dispatch("ListFields")

                            router.push("/")
                        } else {
                            router.push("/auth")
                            localStorage.removeItem("RoleId")
                            localStorage.removeItem("Session")
                            localStorage.removeItem("UserId")
                            return false
                        }
                    }
                )
            }
        },
        login({ commit, dispatch }, authData){

            return axios.get("Session/AdminLogin?" + "UserName=" + authData.email + "&Password=" + authData.password)
                .then(response => {
                let data = response.data;
                
                localStorage.setItem("RoleId", data.RoleId)
                localStorage.setItem("Session", data.Session)
                localStorage.setItem("UserId", data.UserId)
                commit("setSession", data)
                dispatch("initAuth")
            })

        },
        logout({ commit, state }){
            axios.get("Session/Logout?SessionKey=" + state.SessionKey)
            commit("clearSession")
            localStorage.removeItem("RoleId")
            localStorage.removeItem("Session")
            localStorage.removeItem("UserId")
            router.replace("/auth")
        },
        sessionControl({ state, dispatch }){
            axios.get("Session/AdminSessionControl?" + "SessionKey=" + state.SessionKey)
                .then(response => {
                    if(response.data){
                        return true
                    } else {
                        dispatch("logout")
                    }
                }
            )
        },

        //Talep Yönetimi
        getOrdersList({ commit, state, dispatch }, searchData){
            //Talep Verilerini yükle
            return axios.get("Request/ListOrders?" + "OrderType=" + searchData.OrderType + "&BeginDate=" + searchData.BeginDate + "&EndDate=" + searchData.EndDate + 
                "&OrderStatus=" + searchData.OrderStatus + "&currentPage=" + searchData.currentPage + "&perPage=" + searchData.perPage + "&SessionKey=" + state.SessionKey)
                .then(response => {
                    state.Orders = []
                    let data = response.data;
                    
                    if(data.length > 0) {
                        for (let key in data) {
                            data[key].key = key;
                            commit("updateOrderList", data[key]);
                        }
                    } else {
                        dispatch("sessionControl");
                    }

                    return response.data
            })
        },
        updateOrder({ state }, updateData ){
            //Talep Güncelle
            return axios.post("Request/UpdateOrder?" + "OrderId=" + updateData.OrderId + "&Note=" + updateData.Note + 
                "&OrderStatus=" + updateData.OrderStatus + "&UserId=" + state.loginUserId + "&SessionKey=" + state.SessionKey)
        },
        getOrdersInfo({ commit, state, dispatch }, selectedOrder){
            //Talep Detay Bilgileri
            return axios.get("Request/OrderInfo?" + "OrderId=" + selectedOrder.OrderId + "&OrderType=" + selectedOrder.OrderType + "&SessionKey=" + state.SessionKey)
                .then(response => {
                    state.OrderInfo = []
                    let data = response.data;
                    
                    if(data.length > 0) {
                        for (let key in data) {
                            commit("updateOrderInfo", data[key]);
                        }
                    } else {
                        dispatch("sessionControl");
                    }
            })
        },
        getOrderLog({ commit, state, dispatch }, selectedOrder){
            //Talep Detay Bilgileri
            axios.get("Request/OrderLog?" + "OrderId=" + selectedOrder.OrderId + "&SessionKey=" + state.SessionKey)
                .then(response => {
                    state.OrderLog = []
                    let data = response.data;
                    
                    if(data.length > 0) {
                        for (let key in data) {
                            commit("updateOrderLog", data[key]);
                        }
                    } else {
                        dispatch("sessionControl");
                    }
            })
        },

        //Kullanıcı Yönetimi
        getUsersList({ commit, state, dispatch }, searchData){
            //Kullanıcı Listesini yükle
            return axios.get("User/ListUser?" + "UserId=" + searchData.UserId + "&UserName=" + searchData.UserName + "&Mail=" + searchData.Mail + 
                "&Name=" + searchData.Name + "&RoleId=" + searchData.RoleId + "&isActivated=" + searchData.isActivated + 
                "&currentPage=" + searchData.currentPage + "&perPage=" + searchData.perPage + "&SessionKey=" + state.SessionKey)
                .then(response => {
                    state.Users = []
                    let data = response.data;
                    
                    if(data.length > 0) {
                        for (let key in data) {
                            commit("updateUserList", data[key]);
                        }
                    } else {
                        dispatch("sessionControl");
                    }

                    return response.data
                }
            )
        },
        getAdminsList({ commit, state, dispatch }){
            //Kullanıcı Listesini yükle
            axios.get("User/ListAdmin")
                .then(response => {
                    state.AdminList = []
                    let data = response.data;
                    
                    if(data.length > 0) {
                        for (let key in data) {
                            commit("updateAdminList", data[key]);
                        }
                    } else {
                        dispatch("sessionControl");
                    }
                }
            )
        },
        getRolesList({ commit, state }){
            //Hava Alanı Verilerini yükle
            axios.get("User/ListRole")
                .then(response => {
                    state.Roles = []
                    let data = response.data;
                    
                    for (let key in data) {
                        commit("updateRoleList", data[key]);
                    }
            })
        },
        UpdateUser({ state }, updateData ){
            return axios.post("User/UpdateUser?" + "UserId=" + updateData.UserId + "&UserName=" + updateData.UserName + "&Password=" + updateData.Password + 
                "&Mail=" + updateData.Mail + "&FirstName=" + updateData.FirstName + "&LastName=" + updateData.LastName + "&Language=" + updateData.Language +
                "&DateOfBirth=" + updateData.DateOfBirth + "&Address=" + updateData.Address + "&PhoneNumber=" + updateData.PhoneNumber + 
                "&RoleId=" + updateData.RoleId + "&DB_User=" + state.loginUserId + "&SessionKey=" + state.SessionKey)
        },

        //Genel Aktif Pasif işlemleri
        SetActivePassive({ state }, payload) {
            axios.post("HelisData/SetActivePassive?" + "Type=" + payload.Active + "&table=" + state.CurrentTable + "&ID=" + payload.ID + 
                "&DB_User=" + state.loginUserId+ "&SessionKey=" + state.SessionKey)
        },

        //Modüller
        ListFields({ commit, state }){
            return axios.get("Module/ListFields")
                .then(response => {
                    state.Fields = []
                    let data = response.data;
                    for (let row in data) {
                        data[row].key = data[row].keyValue;
                        commit("updateFields", data[row]);
                    }
            })
        },
        ListFieldsByTbl({ commit, state, dispatch }, tableName){
            return axios.get("Module/ListFields?" + "tableName=" + tableName)
                .then(response => {
                    state.Fields = []
                    let data = response.data;
                    for (let row in data) {
                        data[row].key = data[row].keyValue;
                        commit("updateFields", data[row]);
                    }
                    
                    dispatch(state.CurrentModule)
            })
        },
        ListProvinces({ commit, state }){
            axios.get("Module/ListProvince")
                .then(response => {
                    state.ModuleData = []
                    let data = response.data;
                    if (state.Provinces.length == 0) {
                        state.Provinces = data
                    } 
                    else {
                        for (let key in data) {
                            commit("updateModuleData", data[key]);
                        }
                    }
            })
        },
        ListDistrict({ commit, state }){
            axios.get("Module/ListDistrict")
                .then(response => {
                    state.ModuleData = []
                    let data = response.data;
                    if (state.District.length == 0) {
                        state.District = data
                    } 
                    else {
                        for (let key in data) {
                            commit("updateModuleData", data[key]);
                        }
                    }
            })
        },
        ListAirport({ commit, state }){
            axios.get("Module/ListAirport")
                .then(response => {
                    state.ModuleData = []
                    let data = response.data;
                    for (let key in data) {
                        commit("updateModuleData", data[key]);
                    }
            })
        },
        ListVehicle({ commit, state }){
            axios.get("Module/ListVehicle")
                .then(response => {
                    state.ModuleData = []
                    let data = response.data;
                    for (let key in data) {
                        commit("updateModuleData", data[key]);
                    }
            })
        },
        ListRestaurants({ commit, state }){
            axios.get("Module/ListRestaurant")
                .then(response => {
                    state.ModuleData = []
                    let data = response.data;
                    for (let key in data) {
                        commit("updateModuleData", data[key]);
                    }
            })
        },
        ListMansion({ commit, state, dispatch }){
            axios.get("Module/ListMansion")
                .then(response => {
                    state.ModuleData = []
                    let data = response.data;
                    for (let key in data) {
                        commit("updateModuleData", data[key]);
                    }

                    dispatch("ListMansions")
            })
        },
        UpdateModule({ state, dispatch }, payload){
            return axios.post("Module/Update?tableName=" + state.CurrentTable + "&updateInfo=" + payload.updateInfo + "&SessionKey=" + state.SessionKey)
                .then(response => {
                    state.ModuleData = []
                    let data = response.data;
                    
                    dispatch(state.CurrentModule)

                    return data
            })
        },
        NewModule({ state, dispatch }, payload){
            return axios.post("Module/New?tableName=" + state.CurrentTable + "&insertInfo=" + payload.insertInfo + "&SessionKey=" + state.SessionKey)
                .then(response => {
                    state.ModuleData = []
                    let data = response.data;
                    
                    dispatch(state.CurrentModule)

                    return data
            })
        },
        AddPicture({ state }, image) {
            return axios.post("Module/AddPicture?image=" + image.url + "&SessionKey=" + state.SessionKey)
        },

        //Mülk Sayfası
        ListMansions({ commit, state }){
            axios.get("Property/ListMansions?SessionKey=" + state.SessionKey)
                .then(response => {
                    state.Mansions = []
                    let data = response.data;
                    for (let key in data) {
                        commit("updateMansions", data[key]);
                    }
            })
        },
        ListPossessions({ commit, state }, MansionId){
            axios.get("Property/ListPossessions?MansionId=" + MansionId + "&SessionKey=" + state.SessionKey)
                .then(response => {
                    state.Possessions = []
                    let data = response.data;
                    for (let key in data) {
                        commit("updatePossessions", data[key]);
                    }
            })
        },
        AddPossession({ state }, payload) {
            return axios.post("Property/AddPossession?MansionId=" + payload.MansionId + "&BlockId=" + payload.BlockId + "&No=" + payload.No + "&UserId=" + payload.UserId + 
                "&PossessionType=" + payload.PossessionType + "&IsSoldable=" + payload.IsSoldable + "&Info=" + payload.Info + "&SessionKey=" + state.SessionKey)
        },
        ListBlocks({ commit, state }, MansionId){
            axios.get("Property/ListBlocks?MansionId=" + MansionId + "&SessionKey=" + state.SessionKey)
                .then(response => {
                    state.Blocks = []
                    let data = response.data;
                    for (let key in data) {
                        commit("updateBlocks", data[key]);
                    }
            })
        },
        AddBlock({ state }, payload) {
            return axios.post("Property/AddBlock?MansionId=" + payload.MansionId + "&Name=" + payload.BlockName + "&SessionKey=" + state.SessionKey)
        },
        PossessionInfo({ commit, state }, PossessionId) {
            axios.get("Property/PossessionInfo?PossessionId=" + PossessionId + "&SessionKey=" + state.SessionKey)
                .then(response => {
                    let data = response.data
                    commit("updatePossessionInfo", data)
                })
        },
        RequestList({ commit, state }, payload) {
            axios.get("Property/RequestList?PossessionId=" + payload.PossessionId + "&MansionId=" + payload.MansionId + "&SessionKey=" + state.SessionKey)
                .then(response => {
                    state.RequestList = []
                    let data = response.data;
                    for (let key in data) {
                        commit("updateRequestList", data[key]);
                    }
                })
        },
        AcceptRequest({ state }, AvailableId) {
            return axios.post("Property/AcceptRequest?AvailableId=" + AvailableId + "&SessionKey=" + state.SessionKey)
        },
        RejectRequest({ state }, AvailableId) {
            return axios.post("Property/RejectRequest?AvailableId=" + AvailableId + "&SessionKey=" + state.SessionKey)
        },
        UpdateRentable({ state }, RentData ) {
            return axios.post("Property/UpdateRentable?" + "RequestId=" + RentData.RequestId + "&Status=" + RentData.Status + 
                "&SessionKey=" + state.SessionKey)
        },

        //Aktiviteler Sayfası
        getActivityTypeList({ dispatch, commit, state }) {
            axios.get("Module/ListActivityTypes")
                .then(response => {
                    state.ActivityType = []
                    let data = response.data;
                    for (let key in data) {
                        data[key].key = key;
                        commit("updateActivityTypeList", data[key]);
                    }
                })
                .catch((error) => {
                    dispatch("SetError", error)
                })
        },
        UpdateActivityStatus({ state, dispatch }, payload){
            axios.post("Module/UpdateActivityStatus?ActivityTypeId=" + payload.ActivityTypeId + "&Status=" + payload.Status + "&SessionKey=" + state.SessionKey)
                .then(() => { dispatch("getActivityTypeList") })
        },

        //Error Management
        SetError({ dispatch, state }, Error) {
            let URL = Error.request.responseURL
            let Msg = Error.response.data.ErrorMsg
            let Code = Error.response.data.ErrorCode
            let Page = window.location.pathname
            console.log("Caught", Error);

            if (Code > -200) { //-100 ile -200 arası Session Error Olacak
                dispatch("sessionControl");
            } else {
                axios.post("HelisData/AddError?Application=HelisAPP&Module=" + Page + "&Process=" + URL + "&Message=" + Msg + "&DB_Action=1&DB_User=" + state.loginUserId)
            }
        },
    },
    getters: {
        isAuthenticated(state){
            return state.SessionKey !== ""
        },
        getOrders(state){
            return state.Orders;
        },
        getOrderTypes(state){
            return state.OrderTypes;
        },
        getOrderStatus(state){
            return state.OrderStatus;
        },
        getOrderStatusById: state => OrderStatus => {
            return state.OrderStatus.find(element => 
                element.OrderStatus === OrderStatus
            )
        },
        getOrderInfo(state){
            return state.OrderInfo;
        },
        getOrderLog(state){
            return state.OrderLog;
        },
        getUserList(state){
            return state.Users;
        },
        getAdminList(state){
            return state.AdminList;
        },
        getAdminById: state => DB_User => {
            return state.AdminList.find(element => 
                element.UserId === DB_User
            )
        },
        getRoleList(state){
            return state.Roles;
        },
        getRoleById: state => RoleId => {
            return state.Roles.find(element => 
                element.RoleId === RoleId
            )
        },
        getModuleData(state){
            return state.ModuleData;
        },
        getFields(state){
            return state.Fields;
        },
        getFieldsByTbl(state){
            return state.Fields.filter(field =>
                field.tableName == 'zzzAll' || field.tableName == state.CurrentTable || field.tableName == 'aaaAll')
                .sort((a, b) => a.tableName.localeCompare(b.tableName))
        },
        getDB_ActionById: state => DB_Action => {
            return state.DB_Action.find(element =>
                element.ActionId == DB_Action
            )
        },
        getProvinces(state){
            return state.Provinces;
        },
        getDistrict(state){
            return state.District;
        },
        getVehicles(state){
            return state.Vehicles;
        },
        getMansions(state){
            return state.Mansions;
        },
        getBlocks(state){
            return state.Blocks;
        },
        getPossessions(state){
            return state.Possessions;
        },
        getPossessionsByBlock: state => BlockId => {
            return state.Possessions.filter(element =>
                element.BlockId == BlockId
            )
        },
        getPossessionStatus(state){
            return state.PossessionStatus;
        },
        getPossessionInfo(state){
            return state.PossessionInfo;
        },
        getRentableStatus(state) {
            return state.RentableStatus;
        },
        getRentableStatusNameById: state => Status => {
            return state.RentableStatus.find(element => 
                element.RentableStatus === Status
            ).RentableName
        },
        getRequestList(state){
            return state.RequestList;
        },
        GetModuleInfo(state) {
            return {
                CurrentTable: state.CurrentTable,
                CurrentPK: state.CurrentPK,
                CurrentImagePath: state.CurrentImagePath,
                CurrentModule: state.CurrentModule,
            };
        },
        getActivityType(state) {
            return state.ActivityType;
        },
    }
})

export default store