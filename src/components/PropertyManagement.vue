<template>
    <div class="pageContainer">
        <div v-if="!mansionSelected">
            <b-table class="table-light" hover :items="getMansions" :fields="fields" @row-clicked="selectRow" >

                <template #cell(IlId)="row">
                    {{ !row.field.isPrimary && row.value != "" ? getProvinces.find(x => x.IlId == row.value).Il : row.value }}
                </template>

                <template #cell(IlceId)="row">
                    {{ !row.field.isPrimary && row.value != "" ? getDistrict.find(x => x.IlceId == row.value).Ilce : row.value }}
                </template>

                <template #cell(ImageUrl)="row">
                    <b-img :src="require(`../../../images/hotels/${row.value}`)" :alt="row.value" border=3 class="listImage" v-if="row.value!=''"></b-img>
                </template>
            </b-table>
        </div>
        <div v-else-if="!possessionSelected" class="divPost">
            <div class="divPosHeader">
                <b-button class="btn btn-danger" @click="mansionSelected=!mansionSelected">Geri</b-button>
                <b-button class="btn btn-primary" @click="selectMansion(Possession.MansionId)">Onay Bekleyenler</b-button>
                <span class="spnMansionInfo"> {{ MansionInfo }} </span>
                <b-button class="btn btn-success" v-b-modal.modalRoom>Yeni {{ RoomType }}</b-button>
                <b-button class="btn btn-success" v-b-modal.modalBlock v-if="selectedRow.IsBlocky">Yeni Blok</b-button>
            </div>
            <div class="divPosBody" :style="selectedRow.IsBlocky ? 'flex-wrap: no-wrap; flex-direction: column;' : 'flex-wrap: wrap; flex-direction: row;'">
                <div v-if="selectedRow.IsBlocky" class="PosOuter">
                    <div v-for="Block in getBlocks" :key="Block.BlockId" class="PosInner">
                        
                        <span> {{ Block.Name + ' (' + getPossessionsByBlock(Block.BlockId).length + ' ' + RoomType + ')' }} </span>
                        <div class="PosButtonList">
                            <button 
                                v-for="Possession in getPossessionsByBlock(Block.BlockId)" 
                                :key="Possession.PossessionId" 
                                class="PosButton"
                                :style="'background-color:' + getPossessionStatusById(Possession.PossessionType).Color"
                                @click="selectPossession(Possession.PossessionId, Possession.MansionId)"
                            > {{ Possession.No }} </button>
                        </div>
                    </div>
                </div>

                <button 
                    v-else 
                    v-for="Possession in getPossessions" 
                    :key="Possession.PossessionId" 
                    class="PosButton"
                    :style="'background-color:' + getPossessionStatusById(Possession.PossessionType).Color"
                    @click="selectPossession(Possession.PossessionId, Possession.MansionId)"
                > {{ Possession.No }} </button>
            </div>
        </div>
        <div v-else>
            <div class="divPosHeader">
                <b-button class="btn btn-danger" @click="possessionSelected=!possessionSelected">Geri</b-button>
                <span class="spnMansionInfo">
                    <div v-if="IsPossession">
                        {{ getPossessionInfo.Mansion + " " + (getPossessionInfo.Block == "" ? "" : "Blok: " + getPossessionInfo.Block + " ") + RoomType + ": " + getPossessionInfo.No }}
                    </div>
                    <div v-else>
                        {{ MansionInfo }}
                    </div>
                </span>
            </div>
            <div class="PosStatus" v-if="IsPossession">
                <div class="PosInfo">
                    <span><b>Mülk Sahibi: </b>  {{  getPossessionInfo.OwnerInfo.UserName + " (" + getPossessionInfo.OwnerInfo.FirstName + " " + getPossessionInfo.OwnerInfo.LastName + ")" }}</span>
                    <span><b>Mülk Statüsü: </b>  {{ getPossessionInfo.PossessionTypeDesc }}</span>
                    <div style="display: none">
                        <b-form-select id="input-5" v-model="getPossessionInfo.PossessionType">
                            <option v-for="Possession in getPossessionStatus" :value="Possession.PossessionStatus" :key="Possession.PossessionStatus">
                                {{ Possession.PossessionName }}
                            </option>
                        </b-form-select>
                    </div>
                </div>
                <div class="PostRent" v-if="getPossessionInfo.RentableRequest">
                    <span><b>Kiralama Durumu: </b>  </span>
                    <b-form-select
                        id="input-51"
                        v-model="getPossessionInfo.RentableRequest.Status"
                        class="PostRent-Select"
                        @change="UpdateRentable(getPossessionInfo.RentableRequest.Status, getPossessionInfo.RentableRequest.RequestId)"
                    >
                        <option v-for="RentableStatus in getRentableStatus" :value="RentableStatus.RentableStatus" :key="RentableStatus.RentableStatus">
                            {{ RentableStatus.RentableName }}
                        </option>
                    </b-form-select>
                </div>
                <div class="PosInfo" v-if="getPossessionInfo.RentableRequest && getRentableInfo.TimeList.length > 0">
                    <span><b>Müsait Olmayan Günler: </b> </span>
                    <span v-for="time in getRentableInfo.TimeList" :key="time.id">{{ time.BeginDate | formatDate }} - {{ time.EndDate | formatDate }}</span>
                </div>
                <div class="PosBooked" v-if="getPossessionInfo.BookingInfo">
                    <b>Kiracı Bilgisi: </b> {{ getPossessionInfo.BookedInfo.UserName + " (" + getPossessionInfo.BookedInfo.FirstName + " " + getPossessionInfo.BookedInfo.LastName + ")" }}
                    <b>Kira Süresi:    </b> {{ (getPossessionInfo.BookingInfo.BeginDate | formatDate) + " - " + (getPossessionInfo.BookingInfo.EndDate | formatDate) }}
                </div>
            </div>
            <div class="PosRequests" v-if="getRequestList.length > 0">
                <b>Gelen Talepler</b>
                <b-table striped hover :items="getRequestList" :fields="PosFields" @row-clicked="selectRow" >
                    <template #cell(Phone)="row">
                        {{ row.value | formatToPhone }}
                    </template>

                    <template #cell(BeginDate)="row">
                        {{ row.value | formatDate }}
                    </template>

                    <template #cell(EndDate)="row">
                        {{ row.value | formatDate }}
                    </template>

                    <template #cell(Details)="row">
                        <b-button 
                            variant="success" 
                            size="sm"
                            class="mr-2"  
                            @click="AcceptRequest(row.item.AvailableId)">
                                <i class="fa fa-check"></i>
                        </b-button>
                        <b-button 
                            variant="danger" 
                            size="sm" 
                            class="mr-2" 
                            @click="RejectRequest(row.item.AvailableId)">
                                <i class="fa fa-times"></i>
                        </b-button>
                    </template>
                    
                </b-table>
            </div>
        </div>

        <b-modal id="modalRoom" :title="'Yeni ' + RoomType" hide-footer body-class="modalBody">
            <b-container class="modalRoom">
                <b-form-group label="No:" label-for="input1" label-cols="4" label-cols-lg="2">
                    <b-form-input 
                        id="input1" 
                        v-model.lazy="Possession.No" 
                        type="text" 
                        debounce="500" 
                        placeholder="Lütfen No Giriniz"
                        :state="$v.Possession.No.$dirty ? !$v.Possession.No.$anyError : null" 
                        @blur="$v.Possession.No.$touch()"
                    ></b-form-input>
                    <div v-if="$v.Possession.No.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Possession.No.required" :state="$v.Possession.No.required">
                            Lütfen No Giriniz
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.Possession.No.isUnique" :state="$v.Possession.No.isUnique">
                            Aynı No'dan Birden Fazla Giremezsiniz
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>
                        
                <b-form-group label="Tip:" label-for="select1" label-cols="4" label-cols-lg="2">
                    <b-form-select 
                        id="select1" 
                        v-model.lazy="Possession.PossessionType" 
                        :state="$v.Possession.PossessionType.$dirty ? !$v.Possession.PossessionType.$anyError : null" 
                        @blur="$v.Possession.PossessionType.$touch()"
                    >
                        <option selected value="-1">Lütfen Tip Seçiniz</option>
                        <option v-for="Possession in getPossessionStatus" :value="Possession.PossessionStatus" :key="Possession.PossessionStatus">{{ Possession.PossessionName }}
                        </option>
                    </b-form-select>
                        <div v-if="$v.Possession.PossessionType.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Possession.PossessionType.minValue" :state="$v.Possession.PossessionType.minValue">
                            Lütfen Tip Giriniz
                        </b-form-invalid-feedback>
                        </div>
                </b-form-group>

                <b-form-group 
                    label="Blok:" 
                    label-for="select2" 
                    label-cols="4" 
                    label-cols-lg="2" 
                    v-if="selectedRow.IsBlocky" >
                    <b-form-select 
                        id="select2" 
                        v-model.lazy="Possession.BlockId"
                        :state="$v.Possession.BlockId.$dirty ? !$v.Possession.BlockId.$anyError : null" 
                        @blur="$v.Possession.BlockId.$touch()"
                    >
                        <option selected value="-1">Lütfen Blok Seçiniz</option>
                        <option v-for="Block in getBlocks" :value="Block.BlockId" :key="Block.BlockId">{{ Block.Name }}
                        </option>
                    </b-form-select>
                    <div v-if="$v.Possession.BlockId.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Possession.BlockId.minValue" :state="$v.Possession.BlockId.minValue">
                            Lütfen Blok Seçiniz
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>

                <b-form-group label="Not:" label-for="input2" label-cols="4" label-cols-lg="2">
                    <b-form-input id="input2" v-model="Possession.Info" type="text" debounce="500" required></b-form-input>
                </b-form-group>
            </b-container>
            <hr>
            <b-container class="modalFooter">
                <b-button variant="danger" class="float-left" @click="ResetPossession()">
                    Kapat
                </b-button>
                <b-button variant="success" class="float-right" @click="AddPossession">
                    Kaydet
                </b-button>
            </b-container>
        </b-modal>

        <b-modal id="modalBlock" title="Yeni Blok" hide-footer body-class="modalBody">
            <b-form style="padding: 0">
                <b-container class="modalRoom">
                    <b-form-group label="Blok:" label-for="input3" label-cols="4" label-cols-lg="2">
                        <b-form-input 
                            id="input3" 
                            v-model.lazy="Block.BlockName" 
                            type="text"
                            :state="$v.Block.BlockName.$dirty ? !$v.Block.BlockName.$anyError : null" 
                            @blur="$v.Block.BlockName.$touch()"
                        ></b-form-input>
                        <!-- 
                            :state="!$v.Block.BlockName.$error && null" 
                            hata yada renksiz istersen 
                        -->
                        <div v-if="$v.Block.BlockName.$dirty">
                            <b-form-invalid-feedback v-if="!$v.Block.BlockName.required" :state="$v.Block.BlockName.required">
                                Lütfen Blok Adı Giriniz
                            </b-form-invalid-feedback>
                            <b-form-invalid-feedback v-else-if="!$v.Block.BlockName.isUnique" :state="$v.Block.BlockName.isUnique">
                                Aynı Blok Adından Birden Fazla Giremezsiniz
                            </b-form-invalid-feedback>
                        </div>
                    </b-form-group>
                </b-container>
                <hr>
                <b-container class="modalFooter">
                    <b-button variant="danger" class="float-left" @click="ResetBlock()">
                        Kapat
                    </b-button>
                    <b-button variant="success" class="float-right" @click="AddBlock">
                        Kaydet
                    </b-button>
                </b-container>

            </b-form>
        </b-modal>

        <b-modal id="modalWarning" title="Uyarı" hide-footer body-class="modalBody">
            <b-form style="padding: 0">
                <b-container class="modalRoom">
                    <span> {{ warningText }} </span>
                </b-container>
                <hr>
                <b-container class="modalFooter">
                    <b-button variant="danger" class="float-left" @click="$bvModal.hide('modalWarning')">
                        Kapat
                    </b-button>
                </b-container>
            </b-form>
        </b-modal>
                
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import {required, minValue } from "vuelidate/lib/validators"

    export default {
        data() {
            return {
                mansionSelected: false,
                possessionSelected: false,
                possessionData: [],
                fields: [ 
                    { key: 'Name', label: 'Proje Adı', sortable: true, }, 
                    { key: 'IlId', label: 'İl', sortable: true, }, 
                    { key: 'IlceId', label: 'İlçe', sortable: true, }, 
                    { key: 'ImageUrl', label: 'Görsel', }, 
                ],
                PosFields: [ 
                    { key: 'UserName', label: 'Kullanıcı Adı', sortable: true, }, 
                    { key: 'FullName', label: 'Ad Soyad', sortable: true, }, 
                    { key: 'Phone', label: 'Telefon', sortable: true, }, 
                    { key: 'Mail', label: 'Mail', sortable: true, }, 
                    { key: 'BeginDate', label: 'İlk Tarih', sortable: true, }, 
                    { key: 'EndDate', label: 'Son Tarih', sortable: true, }, 
                    { key: 'Details', label: 'İşlemler', }, 
                ],
                Possession: {
                    MansionId: -1,
                    BlockId: null,
                    No: '',
                    UserId: -1,
                    PossessionType: -1,
                    IsSoldable: true,
                    Info: '',
                },
                Block: {
                    MansionId: -1,
                    BlockName: '',
                },
                // MansionInfo: '',
                IsBlocky: false,
                selectedRow: {},
                IsPossession: false,
                selectedPossessionId: -1, 
                selectedMansionId: -1,
                warningText: '',
            }
        },
        filters: {
            formatDate: function (value){
                let d = new Date(value)
                return d.toLocaleDateString()
            },
            formatToBool: function (value){
                return value == 1 ? "Evet" : "Hayır"
            },
            formatToPhone: function (value){
                let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            },
        },
        validations() {
            return {
                Possession: {
                    PossessionType: {
                        required,
                        minValue: minValue(1)
                    },
                    BlockId: {
                        minValue: minValue(this.selectedRow.IsBlocky ? 1 : -1)
                    },
                    No: {
                        required,
                        isUnique(value) {
                            if (this.selectedRow.IsBlocky) {
                                return this.$store.getters.getPossessions.find(x => x.BlockId == this.Possession.BlockId && x.No.toLocaleLowerCase() == value.toLocaleLowerCase()) ? false : true
                            } 
                            else {
                                return this.$store.getters.getPossessions.find(x => x.No.toLocaleLowerCase() == value.toLocaleLowerCase()) ? false : true    
                            }
                        }
                    }
                },
                Block: {
                    BlockName: {
                        required,
                        isUnique(value) {
                            return this.$store.getters.getBlocks.find(x => x.Name.toLocaleLowerCase() == value.toLocaleLowerCase()) ? false : true
                        }
                    }
                }
                // RoomNo: {
                //     required,
                //     minValue: minValue(1)//Burası güncellenecek
                // },
            }
        },
        computed: {
            ...mapGetters(["getProvinces", "getDistrict", "getMansions", "getPossessionStatus", "getPossessionStatusById", "getBlocks", "getPossessions", 
                "getPossessionsByBlock", "getPossessionInfo", "getRentableInfo", "getRequestList", "getRentableStatus"]),
            MansionInfo() {
                return this.selectedRow.Name + " (" + (this.selectedRow.IsBlocky ? this.$store.getters.getBlocks.length + " Blok " : "") + this.$store.getters.getPossessions.length + " Daire)"
            },
            RoomType() {
                return this.selectedRow.RoomType == 1 ? "Daire" : this.selectedRow.RoomType == 2 ? "Bağımsız Bölüm" : ""
            }
        },
        methods: {
            selectRow(Row) {
                this.Possession.MansionId = Row.MansionId
                this.Block.MansionId = Row.MansionId
                this.Possession.UserId = Row.OwnerUser
                this.Possession.PossessionType = Row.PossessionType
                this.mansionSelected = true
                this.selectedRow = Row
                this.ListPossessions()
                
                if (Row.IsBlocky) {
                    this.Possession.BlockId = -1
                    this.ListBlocks()
                } 
                else {
                    this.Possession.BlockId = null
                }
            },
            ResetPossession() {
                this.Possession.No = ''
                this.Possession.Info = ''
                this.Possession.PossessionType = this.selectedRow.PossessionType
                this.Possession.BlockId = -1 ?? null
                this.$v.Possession.$reset()
                this.$bvModal.hide('modalRoom')
            },
            ResetBlock() {
                this.Block.BlockName = ''
                this.$v.Block.$reset()
                this.$bvModal.hide('modalBlock')
            },
            AddPossession() {
                this.$v.Possession.$touch()
                if (!this.$v.Possession.$anyError) {
                    this.$store.dispatch("AddPossession", { ...this.Possession })
                        .then(() =>  {
                            this.ListPossessions()
                        }
                    )
                }
            },
            AddBlock() {
                this.$v.Block.$touch()
                if (!this.$v.Block.$anyError) {
                    this.$store.dispatch("AddBlock", { ...this.Block })
                        .then(() =>  {
                            this.ListBlocks()
                        }
                    )
                }
            },
            ListPossessions() {
                this.ResetPossession()
                this.$store.dispatch("ListPossessions", { MansionId: this.Possession.MansionId })
            },
            ListBlocks() {
                this.ResetBlock()
                this.$store.dispatch("ListBlocks", this.Block.MansionId)
            },
            onSubmit(event) {
                event.preventDefault()
                // alert(JSON.stringify(this.Possession))
                // this.Block.BlockName.$touch()
                this.$v.Block.$touch()
                if (this.$v.Block.$anyError) {
                    alert(JSON.stringify('hatalı'))
                } else {
                    alert(JSON.stringify(this.Block))
                }

            },
            selectPossession(PossessionId, MansionId) {
                this.selectedPossessionId = PossessionId
                this.selectedMansionId = MansionId
                this.$store.dispatch("PossessionInfo", PossessionId)
                    .then(res => {
                        if (res.RentableRequest) {
                            this.$store.dispatch("RentableInfo", PossessionId)
                        }
                    })
                this.$store.dispatch("RequestList", { PossessionId, MansionId })
                this.IsPossession = true
                this.possessionSelected = true
            },
            selectMansion(MansionId) {
                this.selectedMansionId = MansionId
                this.selectedPossessionId = -1
                this.$store.dispatch("RequestList", { PossessionId: '', MansionId })
                this.IsPossession = false
                this.possessionSelected = true
            },
            AcceptRequest(AvailableId) {
                this.$store.dispatch("AcceptRequest", AvailableId)
                    .then((response) => {
                        if (response.ErrorCode) {
                            this.warningText = response.ErrorMsg
                            this.$bvModal.show('modalWarning')
                        } else {
                            if (this.IsPossession) {
                                this.$store.dispatch("RequestList", { PossessionId: this.selectedPossessionId, MansionId: this.selectedMansionId })
                            } else {
                                this.$store.dispatch("RequestList", { PossessionId: '', MansionId: this.selectedMansionId })
                            }
                        }
                    })
            },
            RejectRequest(AvailableId) {
                this.$store.dispatch("RejectRequest", AvailableId)
                    .then(() => {
                        if (this.IsPossession) {
                            this.$store.dispatch("RequestList", { PossessionId: this.selectedPossessionId, MansionId: this.selectedMansionId })
                        } else {
                            this.$store.dispatch("RequestList", { PossessionId: '', MansionId: this.selectedMansionId })
                        }
                    })
            },
            UpdateRentable(Status, RequestId) {
                this.$store.dispatch("UpdateRentable", { Status: Status, RequestId: RequestId })
                    .then(() => {
                        this.$store.dispatch("PossessionInfo", this.selectedPossessionId)
                    })
            },
        },
    }
</script>

<style scoped>

</style>