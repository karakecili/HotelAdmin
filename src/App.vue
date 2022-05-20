<template>
    <div>
        <Sidebar/>
    </div>
</template>
<script>
    import Sidebar from "./components/Sidebar.vue"

    export default {
        components: {
            Sidebar
        },
        created(){
            this.$store.dispatch("initAuth")
        },
        computed: {
            logoutClass() {
                return {
                    'd-none': !this.$store.getters.isAuthenticated
                }
            }
        },
    }
</script>

<style lang="scss">
    body {
        font-family: Manrope !important;
    }
    .button-yellow {
        color: #fff;
        background-color: #D6B761;
        border-color: #D6B761;
    }
    .bg-menu {
        background-color: #1A2A32 !important;
    }
    .nav-component {
        max-width: 1280px;
        margin: 0 auto;
    }
    .requestTable {
        margin-bottom: 0 !important;
    }
    .container {
        margin: 0;
        padding: 0;
    }
    .divPost {

        display: flex;
        flex-direction: column;
    }
    .divPosHeader {
        display: flex;
        flex-direction: row;
        /* background-color: #a9a9a9; */
        background: transparent linear-gradient(to right, #fff 0%, #a9a9a9 42%, #fff 100%) 0% 0% no-repeat padding-box;
        padding: 5px;
        align-items: center;
        text-align: center;
        justify-content: space-around;
    }
    .divPosBody {
        display: flex;
        background-color: #514e4e;
        height: 100%;
        height: calc(100vh - 60px);
        overflow-y: auto;
    }
    .PosOuter {
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
    }
    .PosInner {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .PosInner span {
        font-weight: bold;
        font-size: 26px;
        background-color: lightyellow;
        text-align: center;
        padding: 5px 0;
    }
    .PosButtonList {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .PosButton {
        padding: 10px 25px;
        font-size: 20px;
        margin: 5px;
        border-radius: 25px;
        border: 2px solid rgb(206 212 218 / 50%);
        font-weight: bold;
        height: max-content;
    }
    .modalRoom {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 0;
        padding: 10px;
    }
    .roomCount {
        margin: 0;
    }
    .roomCount div {
        
        display: flex;
        flex-direction: row;
        gap: 15px;
    }
    .roomCount svg {
        margin-top: 3px;
        font-size: 30px;
    }
    .spnMansionInfo {
        font-weight: bold;
        font-size: 26px;
    }
    .form-group {
        margin: 0;
    }
    .modalBody {
        padding: 0 !important;
    }
    .modalBody hr {
        margin: 10px 0;
    }
    .modalFooter {
        padding: 12px;
        display: flex;
        justify-content: space-between;
    }
    .loginForm {
        margin-bottom: 1rem;
    }
    .PosStatus {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin: 0;
        padding: 10px;
    }
    .PosInfo {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .PostRent {
        &-Select {
            width: 200px;
        }
    }
    .listImage {
        width: 250px;
    }
    .pageContainer {
        width: 100%;
        padding-left: 5px;
        background-color: #EFEFEF;
        min-height: 100vh;

        &-Request {
            padding: 5px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
    }
    .requestHeader {
        display: flex;
        flex-direction: row;
        background-color: #fff;
        height: 80px;
        justify-content: space-around;

        &-col {
            display: flex;
            flex-direction: row;
            height: 80px;
            gap: 10px;
            align-items: center;

            &-img {
                height: 50px;
                width: auto;
                
            }
            &-text {
                display: flex;
                flex-direction: column;

                &-result {
                    font-size: 21px;
                    font-weight: 700;
                }
                &-status {
                    font-size: 15px;
                    font-weight: 700;
                }
            }
        }
    }
    .paging {
        height: 40px;
        padding-top: 5px;
        display: flex;
        flex-direction: row;
        gap: 20px;
        margin-top: auto;
        font-size: 13px;

        & > div {
            align-self: center;
        }
    }
    .buttonGroup {
        margin: 30px 0;
    }
    .authLogo {
        width: 200px; 
        align-self: center;
    }
    .newModule {
        border-radius: 12px; 
        border: solid 2px #0d6efd; 
        background-color: #007bff
    }
    .requestLogs {
        height: 200px; 
        overflow-y: auto;
    }
    .noRequest {
        background-color: #fff4d0 !important
    }
    .noRequestDiv {
        background-color: #f2e8c5; 
        border-color: #f2e8c5; 
        color: #664d03; 
        text-align: center;
    }
    .fullWidth {
        width: 100%;
    }
    .DDM {
        padding: 0; 
        border: 3px solid #460df4;
    }
    .chartList {
        display: flex;
        flex-direction: row;
        gap: 50px;
        padding: 20px;
    }
    .chartPie {
        text-align: center;
        background-color: #FFFFFF;
        border-radius: 8px;
        width: 400px; 
        height: auto;
        
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding: 15px 0;

        &-span {
            text-align: left;
            margin-left: 15px;
            font-size: 18px;
            font-weight: 600;
        }
    }
    .dashboardTable {
        width: 100%;
        text-align: center;
        &-span {
            text-align: center;
            font-weight: 600;
        }
    }
    .filterDD {
        font-size: 10px;
        padding: 0 !important;
        & > button {
            font-size: 10px;
            padding: 5px !important;
        }
    }
    

    td {
        padding: 5px !important;
        font-size: 13px;
        text-align: center;
        vertical-align: middle !important;
    }

    th {
        text-align: center !important;
    }

    thead {
        font-weight: 700;
    }

    .page-link {
        color: #1e1e21 !important;
        .active {
            
            background-color: #1e1e2180 !important;
            border-color: #1e1e2180 !important;
        }
    }
    .page-item.active {
        
        & > button {
            background-color: #e0e0e080 !important;
            border-color: #1e1e2180 !important;
        }
    }

    .rowgroup {
        text-align: center;
    }

    .nav-link {
        color: #000 !important;
    }
</style>