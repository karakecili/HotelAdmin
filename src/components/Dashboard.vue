<template>
    <div class="pageContainer">
        <div class="chartList">
            <div class="chartPie" v-if="getRecentRequest.datasets[0].data.length > 0">
                <span class="chartPie-span">Güncel Talepler</span>
                <hr>
                <Pie
                    :chart-options="chartOptions"
                    :chart-data="getRecentRequest"
                />
            </div>

            <div class="chartPie" v-if="getFormerRequest.datasets[0].data.length > 0">
                <span class="chartPie-span">Eski Talepler</span>
                <hr>
                <Pie
                    :chart-options="chartOptions"
                    :chart-data="getFormerRequest"
                />
            </div>
        </div>

        <div class="dashboardTable" v-if="getRecentUser.length > 0">
            <span class="dashboardTable-span">Güncel Kayıtlar</span>
            <b-table class="table-light" hover :items="getRecentUser" :fields="UserFields">
                
            </b-table>
        </div>
        <div class="dashboardTable" v-if="getFormerUser.length > 0">
            <span class="dashboardTable-span">Eski Kayıtlar</span>
            <b-table class="table-light" hover :items="getFormerUser" :fields="UserFields">
                
            </b-table>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import { Pie } from "vue-chartjs/legacy"
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        ArcElement,
        CategoryScale
    } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

    export default {
        components: {
            Pie
        },
        data() {
            return {
                UserFields: [
                    { key: 'User', label: 'Kullanıcı', sortable: true, }, 
                    { key: 'FirstName', label: 'Ad', sortable: true, }, 
                    { key: 'LastName', label: 'Soyad', sortable: true, }, 
                    { key: 'Project', label: 'Proje', sortable: true, }, 
                    { key: 'Room', label: 'Daire/Bağımsız Bölüm', sortable: true, }, 
                    { key: 'Date', label: 'Tarih', sortable: true, }, 
                ],
                chartOptions: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: 'Custom Chart Title'
                    },
                },
                interval: null,
            }
        },
        created() {
            this.getAll()
            this.interval = setInterval(function(){
                this.getAll()
            }.bind(this), 300000);
        },
        destroyed() {
            clearInterval(this.interval)
        },
        computed: {
            ...mapGetters(["getRecentRequest", "getFormerRequest", "getRecentUser", "getFormerUser"]),
        },
        methods: {
            getAll() {
                this.RecentRequest()
                this.FormerRequest()
                this.RecentUser()
                this.FormerUser()
            },
            RecentRequest() {
                this.$store.dispatch("RecentRequest")
                    
                    // .then(() => {
                    //     this._computedWatchers.getRecentRequest.update()
                    // })
                    
            },
            FormerRequest() {
                this.$store.dispatch("FormerRequest")
            },
            RecentUser() {
                this.$store.dispatch("RecentUser")
            },
            FormerUser() {
                this.$store.dispatch("FormerUser")
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>