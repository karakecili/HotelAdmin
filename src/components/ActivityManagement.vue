<template>
    <div class="pageContainer">
        <b-table class="table-light" hover :items="getActivityType" :fields="ActivityFields">
            <template #cell(index)="data">
                {{ data.index + 1 }}
            </template>

            <template #cell(ImageUrl)="row">
                <b-img :src="require(`../../../images/activityType/${row.value}`)" :alt="row.value" border=3 class="listImage" v-if="row.value!=''"></b-img>
            </template>
            
            <template #cell(Details)="row">
                <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                    Son İşlem {{ row.detailsShowing ? 'Gizle' : 'Göster'}} 
                </b-button>

                <b-button :variant="row.item.Status != 1 ? 'success' : 'danger'" size="sm" class="mr-2"
                    @click="UpdateActivityStatus(row.item.ActivityTypeId, row.item.Status == 1 ? 2 : 1)"> 
                        {{row.item.Status != 1 ? 'Aktif' : 'Pasif' }}</b-button>
                <!-- <b-button variant="danger" size="sm" class="mr-2" v-else>Pasif</b-button> -->
            </template>

            <template #row-details="row">
                <b-card>
                    <b-row class="mb-2">
                        <b-col><b>Son İşlem</b></b-col>
                        <b-col><b>Kullanıcı:</b> {{ getAdminById(row.item.DB_User).UserName }}</b-col>
                        <b-col><b>Tarih:</b> {{ row.item.DB_Datetime | formatDate }}</b-col>
                        <b-col><b>İşlem:</b> {{ getDB_ActionById(row.item.DB_Action).Action }}</b-col>
                        <b-col><b-button size="sm" @click="row.toggleDetails">Kapat</b-button></b-col>
                        
                    </b-row>
                </b-card>
            </template>
        </b-table>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";

    export default {
        data () {
            return {
                ActivityFields: [
                    { key: 'ActivityTypeId', label: 'ID', sortable: true, }, 
                    { key: 'Name', label: 'Aktivite', sortable: true, }, 
                    { key: 'Description', label: 'Tanım', sortable: true, }, 
                    { key: 'ImageUrl', label: 'Görsel', }, 
                    { key: 'Status', label: 'Durum', sortable: true, 
                        formatter: (value, key, item) => {
                            return item == 1 ? "Aktif" : "Pasif"
                        } 
                    }, 
                    { key: 'LangCode', label: 'Dil Kodu', }, 
                    { key: 'Details', label: 'Detaylar', }, 
                ],
            }
        },
        filters: {
            formatDate: function (value){
                let d = new Date(value)
                return d.toLocaleString()
            },
            formatToBool: function (value){
                return value == 1 ? "Evet" : "Hayır"
            },
            formatToPhone: function (value){
                let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            },
        },
        created() {
            this.getActivities()
        },
        computed: {
            ...mapGetters(["getAdminById", "getDB_ActionById", "getActivityType"]),
        },
        methods: {
            getActivities() {
                this.$store.dispatch("getActivityTypeList", { ...this.searchData })
            },
            UpdateActivityStatus(ActivityTypeId, Status) {
                this.$store.dispatch("UpdateActivityStatus", { ActivityTypeId: ActivityTypeId, Status: Status })
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>