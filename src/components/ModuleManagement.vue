<template>
    <div class="container">

        <b-table striped hover :items="getModuleData" :fields="getFields">
            
            <!-- Sıralama -->
            <template #cell(index)="data">
                {{ data.index + 1 }}
            </template>
            
            <template #cell(Details)="row">
                <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                    Son İşlem {{ row.detailsShowing ? 'Gizle' : 'Göster'}} 
                </b-button>

                <b-button variant="warning" size="sm" class="mr-2" @click="updateRow(row.item, row.index, $event.target)">Düzenle</b-button>
                <b-button :variant="row.item.DB_Action == 0 ? 'primary' : 'danger'" size="sm" class="mr-2"> {{row.item.DB_Action == 0 ? 'Aktif' : 'Pasif' }}</b-button>
                <!-- <b-button variant="danger" size="sm" class="mr-2" v-else>Pasif</b-button> -->
            </template>

            <template #cell(IlId)="row">
                {{ !row.field.isPrimary && row.value != "" ? getProvinces.find(x => x.IlId == row.value).Il : row.value }}
            </template>

            <template #cell(IlceId)="row">
                {{ !row.field.isPrimary && row.value != "" ? getDistrict.find(x => x.IlceId == row.value).Ilce : row.value }}
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

        <!-- Info modal -->
        <b-modal :id="infoModal.id" :title="infoModal.title">
            <!-- <pre>{{ infoModal.content }}</pre> -->
                        
            <div v-for="col in infoModal.cols" :key="col.FieldsId">
                <b-form-group id="input-group-31" :label="col.label" :label-for="col.key">
                    <b-form-select
                        v-if="col.infoType == 'select'"
                        :id="col.key"
                        v-model="infoModal.row[col.key]"
                        :disabled="isUpdate ? !col.infoEdit : !col.infoNew"
                    >         
                        <template v-if="col.key == 'IlId'">
                            <option v-for="province in getProvinces" :value="province.IlId" :key="province.IlId">{{ province.Il }}</option>
                        </template>
                        <template v-else-if="col.key == 'IlceId'"> 
                            <option v-for="district in getDistrict" :value="district.IlceId" :key="district.IlceId">{{ district.Ilce }}</option>
                        </template>
                        <template v-else-if="col.key == 'Type'"> 
                            <option v-for="vehicle in getVehicles" :value="vehicle" :key="vehicle">{{ vehicle }}</option>
                        </template>
                       
                    </b-form-select>
                    <b-img 
                        v-else-if="col.infoType == 'image'"
                        src="https://picsum.photos/1024/400/?image=41" 
                        fluid 
                        alt="Responsive image"
                    ></b-img>
                    <b-form-input 
                        v-else
                        :id="col.key"
                        v-model="infoModal.row[col.key]"
                        :type="col.infoType"
                        :disabled="isUpdate ? !col.infoEdit : !col.infoNew"
                    ></b-form-input>
                </b-form-group>
                <!-- <input type="text" :id=`name-${index}` name="name" v-model="list.name" />
                {{list.name}} -->
            </div>

                    
            <template #modal-footer>
                <div class="w-100">
                    <b-button
                        variant="success"
                        class="float-left"
                        @click="$bvModal.hide(infoModal.id)"
                    >
                        Kaydet
                    </b-button>
                    <b-button
                        variant="danger"
                        class="float-right"
                        @click="$bvModal.hide(infoModal.id)"
                    >
                        Kapat
                    </b-button>
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        data() {
            return {

                infoModal: {
                    id: 'info-modal',
                    title: '',
                    content: '',
                    cols: [],
                    row: []
                },
                isUpdate: false,
            }
        },
        filters: {
            formatDate: function (value){
                var d = new Date(value)
                return d.toLocaleString()
            },
            formatToBool: function (value){
                return value == 1 ? "Evet" : "Hayır"
            },
            formatToPhone: function (value){
                var x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
                
            },
        },
        computed: {
            ...mapGetters(["getModuleData", "getFields", "getAdminById", "getDB_ActionById", "getProvinces", "getDistrict", "getVehicles"]),
        },
        methods: {
                    
            updateRow(item, index, button) {
                this.infoModal.cols =  this.$store.getters.getFields.filter(x => x.infoShow == 1)
                this.infoModal.row = item
                this.isUpdate = true
                this.infoModal.title = `Row index: ${index + 1}`
                this.infoModal.content = JSON.stringify(item, null, 2)
                this.$root.$emit('bv::show::modal', this.infoModal.id, button)
            },
            SetActivePassive(Active, ID) {
                this.$store.dispatch("SetActivePassive", { Active, ID })
                    .then(() =>{
                            // setTimeout(() => this.getUsersList(), 1000)   
                        }
                    )
            }
        }
    }
</script>

<style>
    table#table-transition-example .flip-list-move {
        transition: transform 1s;
    }
</style>