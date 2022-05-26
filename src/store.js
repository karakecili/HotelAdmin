import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import { router } from "./router"

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        loginUserId: null,
        roleId: null,
        FullName: "",
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
            { OrderStatus: 0, Color: "#000000", StatusName: "Tüm Talepler" }, 
            { OrderStatus: 1, Color: "#D6B761", StatusName: "Talep Oluşturuldu" }, 
            { OrderStatus: 2, Color: "#808080", StatusName: "Bekliyor" }, 
            { OrderStatus: 3, Color: "#1259F8", StatusName: "Teklif Sunuldu" }, 
            { OrderStatus: 4, Color: "#04D33C", StatusName: "Teklif Kabul Edildi" }, 
            { OrderStatus: 5, Color: "#FF0000", StatusName: "Teklif Red Edildi" }, 
        ],
        PossessionStatus: [
            { PossessionStatus: 1, Color: "#fad7e9", PossessionName: "Müşteri Sahip" }, 
            { PossessionStatus: 2, Color: "#fad7d7", PossessionName: "Müşteri Sahip Kiralık" }, 
            { PossessionStatus: 3, Color: "#d7dcfa", PossessionName: "Firma Sahip Satılık" }, 
            { PossessionStatus: 4, Color: "#d7f2fa", PossessionName: "Firma Sahip Kiralık" }, 
            { PossessionStatus: 5, Color: "#d7fade", PossessionName: "Firma Sahip Ziyaretlik" }, 
            { PossessionStatus: 6, Color: "#faf4d7", PossessionName: "Kullanım Dışı" }, 
        ],
        RentableStatus: [
            { RentableStatus: 1, RentableName: " Yeni İstek" }, 
            { RentableStatus: 2, RentableName: " Teklif Sunuldu" }, 
            { RentableStatus: 3, RentableName: " Sözleşme Aşamasında" }, 
            { RentableStatus: 4, RentableName: " Kabul Edildi" }, 
            { RentableStatus: 5, RentableName: " Reddedildi" }, 
        ],
        OrderStatistics: [],
        OrderInfo: [],
        OrderLog: [],
        AdminList: [],
        Users: [],
        Roles: [],
        PrimaryUsers: [],
        ModuleData: [],
        Fields: [],
        Mansions: [],
        Blocks: [],
        Possessions: [],
        PossessionInfo: {},
        RentableInfo: {},
        RequestList: [],
        ActivityType: [],
        DB_Action: [
            { ActionId: 1, Action: "Yeni İşlem" },
            { ActionId: 2, Action: "Düzenlendi" },
            { ActionId: 0, Action: "Silindi" },
        ],
        Provinces: [],
        District: [],
        Vehicles: [ "Otomobil", "Tekne" ],
        CurrentTable: "",
        CurrentPK: "",
        CurrentImagePath: "",
        CurrentModule: "",
        LoadedFirstTime: true,
        RecentRequests: {
            labels: [],
            datasets: [{ backgroundColor: [], data: [] }]
        },
        FormerRequests: {
            labels: [],
            datasets: [{ backgroundColor: [], data: [] }]
        },
        RecentUsers: [],
        FormerUsers: [],
    },
    mutations: {
        setSession(state, data){
            state.roleId = data.RoleId
            state.SessionKey = data.Session
            state.loginUserId = data.UserId
            state.FullName = data.FullName
        },
        clearSession(state){
            state.loginUserId = null
            state.roleId = null
            state.SessionKey = ""
            state.FullName = ""
        },
        updateOrderList(state, item) {
            state.Orders.push(item);
        },
        updateOrderStatistics(state, data) {
            let cntAll = 0
            let Status = {}
            data.forEach(item => {
                Status = state.OrderStatus.find(e => e.OrderStatus == item.OrderStatus)

                state.OrderStatistics.push({ StatusId: Status.OrderStatus, OrderStatus: "Status" + item.OrderStatus, Count: item.cnt, Color: Status.Color, StatusName: Status.StatusName });
                cntAll += item.cnt
            })
            Status = state.OrderStatus.find(e => e.OrderStatus == 0)

            state.OrderStatistics.push({ StatusId: 0, OrderStatus: "StatusAll", Count: cntAll, Color: Status.Color, StatusName: Status.StatusName });

            console.log(state.OrderStatistics)
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
        updatePrimaryList(state, item) {
            state.PrimaryUsers.push(item);
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
        updateRentableInfo(state, item) {
            state.RentableInfo = item;
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
        updateRecentRequest(state, data) {
            let labels = []
            let datasets = [{ backgroundColor: [], data: [] }]

            data.forEach(item => {
                let Status = state.OrderStatus.find(e => e.OrderStatus == item.OrderStatus)
                labels.push(Status.StatusName)
                // datasets[0].backgroundColor.push('#'+ Math.floor(Math.random()*16777215).toString(16))
                datasets[0].backgroundColor.push(Status.Color)
                datasets[0].data.push(item.cnt)
            }) 

            state.RecentRequests = { labels: labels, datasets: datasets }
        },
        updateFormerRequest(state, data) {
            let labels = []
            let datasets = [{ backgroundColor: [], data: [] }]
            
            data.forEach(item => {
                let Status = state.OrderStatus.find(e => e.OrderStatus == item.OrderStatus)
                labels.push(Status.StatusName)
                datasets[0].backgroundColor.push(Status.Color)
                datasets[0].data.push(item.cnt)
            }) 

            state.FormerRequests = { labels: labels, datasets: datasets }
        },
        updateRecentUser(state, item) {
            state.RecentUsers.push(item);
        },
        updateFormerUser(state, item) {
            state.FormerUsers.push(item);
        },
    },
    actions: {
        async initAuth({ commit, dispatch }){
            try {
                let SessionKey = localStorage.getItem("Session")
                if(SessionKey != null) {
                    const response = await axios.get("Session/AdminSessionControl?" + "SessionKey=" + SessionKey)

                    if(response.data) {
                        commit("setSession", { 
                            RoleId: localStorage.getItem("RoleId"), 
                            Session: localStorage.getItem("Session"), 
                            UserId: localStorage.getItem("UserId"),
                            FullName: localStorage.getItem("FullName")}
                        )

                        dispatch("getRolesList")
                        dispatch("getAdminsList")
                        dispatch("ListPrimary")
                        dispatch("ListProvinces")
                        dispatch("ListDistrict")
                        dispatch("ListMansions")
                        dispatch("ListFields")

                        router.push("/")

                        return true
                    } else {
                        router.push("/auth")
                        localStorage.removeItem("RoleId")
                        localStorage.removeItem("Session")
                        localStorage.removeItem("UserId")
                        localStorage.removeItem("FullName")
                        return false
                    }
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async login({ commit, dispatch }, authData){
            try {
                const response = await axios.get("Session/AdminLogin?" + "UserName=" + authData.email + "&Password=" + authData.password)
                let data = response.data
                localStorage.setItem("RoleId", data.RoleId)
                localStorage.setItem("Session", data.Session)
                localStorage.setItem("UserId", data.UserId)
                localStorage.setItem("FullName", data.FullName)
                commit("setSession", data)
                dispatch("initAuth")
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async logout({ commit, dispatch, state }){
            try {
                const response = await axios.post("Session/Logout?SessionKey=" + state.SessionKey)
                commit("clearSession")
                localStorage.removeItem("RoleId")
                localStorage.removeItem("Session")
                localStorage.removeItem("UserId")
                localStorage.removeItem("FullName")
                router.replace("/auth")
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async sessionControl({ state, dispatch }){
            try {
                const response = await axios.get("Session/AdminSessionControl?" + "SessionKey=" + state.SessionKey)
                if (response.data) {
                    return true
                } else {
                    dispatch("logout")
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },

        //Talep Yönetimi
        async getOrdersList({ commit, state, dispatch }, searchData){
            //Talep Verilerini yükle
            try {
                const response = await axios.get("Request/ListOrders?" + "OrderType=" + searchData.OrderType + "&UserName=" + searchData.UserName +
                    "&Mail=" + searchData.Mail + "&Name=" + searchData.Name + "&Room=" + searchData.Room +
                    "&BeginDate=" + searchData.BeginDate + "&EndDate=" + searchData.EndDate + "&OrderStatus=" + searchData.OrderStatus + 
                    "&currentPage=" + searchData.currentPage + "&perPage=" + searchData.perPage + "&SessionKey=" + state.SessionKey)
                state.Orders = []
                let data = response.data
                if (data.length > 0) {
                    for (let key in data) {
                        data[key].key = key
                        commit("updateOrderList", data[key])
                    }
                } else {
                    dispatch("sessionControl")
                }
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async getOrderStatistics({ commit, state, dispatch } ){
            //Talep Güncelle
            try {
                const response = await axios.get("Request/OrderStatistics?SessionKey=" + state.SessionKey)

                state.OrderStatistics = []
                let data = response.data
                
                if (data.length > 0) {
                    commit("updateOrderStatistics", data);
                } else {
                    dispatch("sessionControl")
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async updateOrder({ state, dispatch }, updateData ){
            //Talep Güncelle
            try {
                const response = await axios.post("Request/UpdateOrder?" + "OrderId=" + updateData.OrderId + "&Note=" + updateData.Note +
                "&OrderStatus=" + updateData.OrderStatus + "&UserId=" + state.loginUserId + "&SessionKey=" + state.SessionKey)

                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async getOrdersInfo({ commit, state, dispatch }, selectedOrder){
            //Talep Detay Bilgileri
            try {
                const response = await axios.get("Request/OrderInfo?" + "OrderId=" + selectedOrder.OrderId + "&OrderType=" + selectedOrder.OrderType + "&SessionKey=" + state.SessionKey)
                state.OrderInfo = []
                let data = response.data
                if (data.length > 0) {
                    for (let key in data) {
                        commit("updateOrderInfo", data[key])
                    }
                } else {
                    dispatch("sessionControl")
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async getOrderLog({ commit, state, dispatch }, selectedOrder){
            //Talep Detay Bilgileri
            try {
                const response = await axios.get("Request/OrderLog?" + "OrderId=" + selectedOrder.OrderId + "&SessionKey=" + state.SessionKey)
                state.OrderLog = []
                let data = response.data

                if (data.length > 0) {
                    for (let key in data) {
                        commit("updateOrderLog", data[key])
                    }
                } else {
                    dispatch("sessionControl")
                }
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },

        //Kullanıcı Yönetimi
        async getUsersList({ commit, state, dispatch }, searchData){
            //Kullanıcı Listesini yükle
            try {
                const response = await axios.get("User/ListUser?" + "UserId=" + searchData.UserId + "&UserName=" + searchData.UserName + "&Mail=" + searchData.Mail +
                    "&Name=" + searchData.Name + "&RoleId=" + searchData.RoleId + "&isActivated=" + searchData.isActivated +
                    "&currentPage=" + searchData.currentPage + "&perPage=" + searchData.perPage + "&SessionKey=" + state.SessionKey)
                state.Users = []
                let data = response.data
                if (data.length > 0) {
                    for (let key in data) {
                        commit("updateUserList", data[key])
                    }
                } else {
                    dispatch("sessionControl")
                }
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async getAdminsList({ commit, state, dispatch }){
            //Kullanıcı Listesini yükle
            try {
                const response = await axios.get("User/ListAdmin")
                state.AdminList = []
                let data = response.data

                if (data.length > 0) {
                    for (let key in data) {
                        commit("updateAdminList", data[key])
                    }
                } else {
                    dispatch("sessionControl")
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async getRolesList({ commit, dispatch, state }){
            try {
                const response = await axios.get("User/ListRole")
                state.Roles = []
                state.LoadedFirstTime = false
                let data = response.data
                for (let key in data) {
                    commit("updateRoleList", data[key])
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async ListPrimary({ commit, dispatch, state }){
            try {
                const response = await axios.get("User/ListPrimary?SessionKey=" + state.SessionKey)
                state.PrimaryUsers = []
                let data = response.data
                for (let key in data) {
                    commit("updatePrimaryList", data[key])
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async UpdateUser({ dispatch, state }, updateData ){
            try {
                const response = await axios.post("User/UpdateUser?" + "UserId=" + updateData.UserId + "&UserName=" + updateData.UserName + "&Password=" + updateData.Password +
                    "&Mail=" + updateData.Mail + "&FirstName=" + updateData.FirstName + "&LastName=" + updateData.LastName + "&Language=" + updateData.Language +
                    "&DateOfBirth=" + updateData.DateOfBirth + "&Address=" + updateData.Address + "&PhoneNumber=" + updateData.PhoneNumber +
                    "&RoleId=" + updateData.RoleId + "&SessionKey=" + state.SessionKey)
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async AddUser({ dispatch, state }, registerData ){
            try {
                const response = await axios.post("User/AddUser?" +  "&UserName=" + registerData.UserName + "&Password=" + registerData.Password +
                    "&Mail=" + registerData.Mail + "&FirstName=" + registerData.FirstName + "&LastName=" + registerData.LastName + "&Language=" + registerData.Language +
                    "&DateOfBirth=" + registerData.DateOfBirth + "&Address=" + registerData.Address + "&PhoneNumber=" + registerData.PhoneNumber +
                    "&RoleId=" + registerData.RoleId + "&PrimaryUser=" + registerData.PrimaryUser + "&PossessionId=" + registerData.PossessionId +
                    "&BeginDate=" + registerData.BeginDate + "&EndDate=" + registerData.EndDate + "&SessionKey=" + state.SessionKey)
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },

        //Genel Aktif Pasif işlemleri
        async SetActivePassive({ dispatch, state }, payload) {
            try {
                const response = await  axios.post("HelisData/SetActivePassive?" + "Type=" + payload.Active + "&table=" + state.CurrentTable + "&ID=" + payload.ID + 
                    "&DB_User=" + state.loginUserId+ "&SessionKey=" + state.SessionKey)
                
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },

        //Modüller
        async ListFields({ commit, state, dispatch }){
            try {
                const response = await axios.get("Module/ListFields")
                state.Fields = []
                let data = response.data
                for (let row in data) {
                    data[row].key = data[row].keyValue
                    commit("updateFields", data[row])
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async ListFieldsByTbl({ commit, state, dispatch }, tableName){
            try {
                const response = await axios.get("Module/ListFields?" + "tableName=" + tableName)
                state.Fields = []
                let data = response.data
                for (let row in data) {
                    data[row].key = data[row].keyValue
                    commit("updateFields", data[row])
                }
                dispatch(state.CurrentModule)
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async ListProvinces({ commit, state, dispatch }){
            try {
                const response = await axios.get("Module/ListProvince")
                state.ModuleData = []
                let data = response.data
                if (state.Provinces.length == 0) {
                    state.Provinces = data
                }
                else {
                    for (let key in data) {
                        commit("updateModuleData", data[key])
                    }
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async ListDistrict({ commit, state, dispatch }){
            try {
                const response = await axios.get("Module/ListDistrict")
                state.ModuleData = []
                let data = response.data
                if (state.District.length == 0) {
                    state.District = data
                }
                else {
                    for (let key in data) {
                        commit("updateModuleData", data[key])
                    }
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async ListAirport({ commit, state, dispatch }){
            try {
                const response = await axios.get("Module/ListAirport")
                state.ModuleData = []
                let data = response.data
                for (let key in data) {
                    commit("updateModuleData", data[key])
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async ListVehicle({ commit, state, dispatch }){
            try {
                const response = await axios.get("Module/ListVehicle")
                state.ModuleData = []
                let data = response.data
                for (let key in data) {
                    commit("updateModuleData", data[key])
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async ListRestaurants({ commit, dispatch, state }){
            try {
                const response = await axios.get("Module/ListRestaurant")
                state.ModuleData = []
                let data = response.data
                for (let key in data) {
                    commit("updateModuleData", data[key])
                }
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async ListMansion({ commit, state, dispatch }){
            try {
                const response = await axios.get("Module/ListMansion")
                state.ModuleData = []
                let data = response.data
                for (let key in data) {
                    commit("updateModuleData", data[key])
                }
                dispatch("ListMansions")
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async UpdateModule({ state, dispatch }, payload){
            try {
                const response = await axios.post("Module/Update?tableName=" + state.CurrentTable + "&updateInfo=" + payload.updateInfo + "&SessionKey=" + state.SessionKey)
                state.ModuleData = []
                let data = response.data
                dispatch(state.CurrentModule)
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async NewModule({ state, dispatch }, payload){
            try {
                const response = await axios.post("Module/New?tableName=" + state.CurrentTable + "&insertInfo=" + payload.insertInfo + "&SessionKey=" + state.SessionKey)
                state.ModuleData = []
                let data = response.data
                dispatch(state.CurrentModule)
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        AddPicture({ state }, image) {
            return axios.post("Module/AddPicture?image=" + image.url + "&SessionKey=" + state.SessionKey)
        },

        //Mülk Sayfası
        async ListMansions({ commit, state, dispatch }){
            try {
                const response = await axios.get("Property/ListMansions?SessionKey=" + state.SessionKey)
                state.Mansions = []
                let data = response.data
                for (let key in data) {
                    commit("updateMansions", data[key])
                }
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async ListPossessions({ commit, state, dispatch }, Payload){
            try {
                const response = await axios.get("Property/ListPossessions?MansionId=" + Payload.MansionId + "&BlockId=" + Payload.BlockId + "&SessionKey=" + state.SessionKey)
                state.Possessions = []
                let data = response.data
                for (let key in data) {
                    commit("updatePossessions", data[key])
                }
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async ListPossessionsNS({ commit, state, dispatch }, Payload){
            try {
                const response = await axios.get("Property/ListPossessionsNS?MansionId=" + Payload.MansionId + "&BlockId=" + Payload.BlockId)
                state.Possessions = []
                let data = response.data
                for (let key in data) {
                    commit("updatePossessions", data[key])
                }
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async AddPossession({ state, dispatch }, payload) {
            try {
                await axios.post("Property/AddPossession?MansionId=" + payload.MansionId + "&BlockId=" + payload.BlockId + "&No=" + payload.No + "&UserId=" + payload.UserId + 
                    "&PossessionType=" + payload.PossessionType + "&IsSoldable=" + payload.IsSoldable + "&Info=" + payload.Info + "&SessionKey=" + state.SessionKey)
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async ListBlocks({ commit, state, dispatch }, MansionId){
            try {
                const response = await axios.get("Property/ListBlocks?MansionId=" + MansionId + "&SessionKey=" + state.SessionKey)
                state.Blocks = []
                let data = response.data
                for (let key in data) {
                    commit("updateBlocks", data[key])
                }
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async AddBlock({ dispatch, state }, payload) {
            try {
                const response = await axios.post("Property/AddBlock?MansionId=" + payload.MansionId + "&Name=" + payload.BlockName + "&SessionKey=" + state.SessionKey)
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async PossessionInfo({ commit, state, dispatch }, PossessionId) {
            try {
                const response = await axios.get("Property/PossessionInfo?PossessionId=" + PossessionId + "&SessionKey=" + state.SessionKey)
                let data = response.data
                commit("updatePossessionInfo", data)
                return data
            }  catch (error) {
                dispatch("SetError", error)
            }
        },
        async RentableInfo({ commit, state, dispatch }, PossessionId) {
            try {
                const response = await axios.get("Property/RentableInfo?PossessionId=" + PossessionId + "&SessionKey=" + state.SessionKey)
                let data = response.data
                commit("updateRentableInfo", data)
                return data
            }  catch (error) {
                dispatch("SetError", error)
            }
        },
        async RequestList({ commit, state, dispatch }, payload) {
            try {
                const response = await axios.get("Property/RequestList?PossessionId=" + payload.PossessionId + "&MansionId=" + payload.MansionId + "&SessionKey=" + state.SessionKey)
                state.RequestList = []
                let data = response.data
                for (let key in data) {
                    commit("updateRequestList", data[key])
                }
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async AcceptRequest({ dispatch, state }, AvailableId) {
            try {
                const response = await axios.post("Property/AcceptRequest?AvailableId=" + AvailableId + "&SessionKey=" + state.SessionKey)
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async RejectRequest({ dispatch, state }, AvailableId) {
            try {
                const response = await axios.post("Property/RejectRequest?AvailableId=" + AvailableId + "&SessionKey=" + state.SessionKey)
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async UpdateRentable({ dispatch, state }, RentData ) {
            try {
                const response = await axios.post("Property/UpdateRentable?" + "RequestId=" + RentData.RequestId + "&Status=" + RentData.Status +
                    "&SessionKey=" + state.SessionKey)
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },

        //Aktiviteler Sayfası
        async getActivityTypeList({ dispatch, commit, state }) {
            try {
                const response = await axios.get("Module/ListActivityTypes")
                state.ActivityType = []
                let data = response.data
                for (let key in data) {
                    data[key].key = key
                    commit("updateActivityTypeList", data[key])
                }
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async UpdateActivityStatus({ state, dispatch }, payload){
            try {
                await axios.post("Module/UpdateActivityStatus?ActivityTypeId=" + payload.ActivityTypeId + "&Status=" + payload.Status + "&SessionKey=" + state.SessionKey)
                dispatch("getActivityTypeList")
            } catch (error) {
                dispatch("SetError", error)
            }
        },

        //Dashboard
        async RecentRequest({ dispatch, commit, state }) {
            try {
                const response = await axios.get("Dashboard/RecentRequest?SessionKey=" + state.SessionKey)
                state.RecentRequests.labels, state.RecentRequests.datasets[0].backgroundColor , state.RecentRequests.datasets[0].data = []
                let data = response.data;
                
                commit("updateRecentRequest", data);
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async FormerRequest({ dispatch, commit, state }) {
            try {
                const response = await axios.get("Dashboard/FormerRequest?SessionKey=" + state.SessionKey)
                state.FormerRequests.labels, state.FormerRequests.datasets[0].backgroundColor , state.FormerRequests.datasets[0].data = []
                let data = response.data;

                commit("updateFormerRequest", data);
                return data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async RecentUser({ dispatch, commit, state }) {
            try {
                const response = await axios.get("Dashboard/RecentUser?SessionKey=" + state.SessionKey)
                state.RecentUsers = []
                let data = response.data;
                for (let key in data) {
                    data[key].key = key;
                    commit("updateRecentUser", data[key]);
                }
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },
        async FormerUser({ dispatch, commit, state }) {
            try {
                const response = await axios.get("Dashboard/FormerUser?SessionKey=" + state.SessionKey)
                state.FormerUsers = []
                let data = response.data;
                for (let key in data) {
                    data[key].key = key;
                    commit("updateFormerUser", data[key]);
                }
                return response.data
            } catch (error) {
                dispatch("SetError", error)
            }
        },

        //Error Management
        SetError({ dispatch, state }, Error) {
            try {
                let URL = Error.request.responseURL
                let Msg = Error.response.data.ErrorMsg
                let Code = Error.response.data.ErrorCode
                let Page = window.location.pathname
                console.log("Caught", Error);

                if (Code > -200) { //-100 ile -200 arası Session Error Olacak
                    dispatch("sessionControl");
                } else {
                    axios.post("HelisData/AddError?Application=HelisAdmin&Module=" + Page + "&Process=" + URL + "&Message=" + Msg + "&DB_Action=1&DB_User=" + state.loginUserId)
                }
            } catch (error) {
                axios.post("HelisData/AddError?Application=HelisAdmin&Module=noModule&Process=noURL&Message=" + Error + "&DB_Action=1&DB_User=1")
            }
        },
    },
    getters: {
        isAuthenticated(state){
            return state.SessionKey !== ""
        },
        getUserInfo(state) {
            return { UserId: state.loginUserId,
                FullName: state.FullName,
                SessionKey : state.SessionKey 
            }
        },
        getOrders(state){
            return state.Orders;
        },
        getOrderTypes(state){
            return state.OrderTypes;
        },
        getOrderStatus(state){
            return state.OrderStatus.filter(x => x.OrderStatus > 0);
        },
        getOrderStatusById: state => OrderStatus => {
            return state.OrderStatus.find(element => 
                element.OrderStatus === OrderStatus
            )
        },
        getOrderStatistic(state){
            return state.OrderStatistics.sort(function (a, b) {
                return a.StatusId - b.StatusId});
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
            return state.roleId == 1 ? state.Roles : 
                state.Roles.filter(x => x.RoleId != 1 && x.RoleId != 4 ) ;
        },
        getRoleById: state => RoleId => {
            return state.Roles.find(element => 
                element.RoleId == RoleId
            )
        },
        getPrimaryList: state => {
            // return state.PrimaryUsers.filter(x => x.UserName.includes(value) 
            //     || x.FirstName.includes(value) || x.LastName.includes(value))
            return state.PrimaryUsers
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
        getPossessionStatusById: state => StatusId => {
            return state.PossessionStatus.find(element =>
                element.PossessionStatus == StatusId
            )
        },
        getPossessionInfo(state){
            return state.PossessionInfo;
        },
        getRentableInfo(state){
            return state.RentableInfo;
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
        getRecentRequest(state){
            return state.RecentRequests;
        },
        getFormerRequest(state){
            return state.FormerRequests;
        },
        getRecentUser(state){
            return state.RecentUsers;
        },
        getFormerUser(state){
            return state.FormerUsers;
        },
    }
})

export default store