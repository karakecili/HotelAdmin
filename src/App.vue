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
        font-family: poppins;
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
</style>