<template>
    <div class="container" style="margin-top: 5px; margin-bottom: 5px;">
        <div v-if="!mansionSelected">
            <b-table striped hover :items="getMansions" :fields="fields" @row-clicked="selectRow" >

            </b-table>
        </div>
        <div v-else-if="!possessionSelected" class="divPost">
            <div class="divPosHeader">
                <b-button class="btn btn-danger" @click="mansionSelected=!mansionSelected">Geri</b-button>
                <span class="spnMansionInfo"> {{ MansionInfo }} </span>
                <b-button class="btn btn-success" v-b-modal.modalRoom>Yeni Oda</b-button>
                <b-button class="btn btn-success" v-b-modal.modalBlock v-if="selectedRow.IsBlocky">Yeni Blok</b-button>
            </div>
            <div class="divPosBody" :style="selectedRow.IsBlocky ? 'flex-wrap: no-wrap; flex-direction: column;' : 'flex-wrap: wrap; flex-direction: row;'">
                <div v-if="selectedRow.IsBlocky" class="PosOuter">
                    <div v-for="Block in getBlocks" :key="Block.BlockId" class="PosInner">
                        
                        <span> {{ Block.Name + ' (' + getPossessionsByBlock(Block.BlockId).length + ' Oda)' }} </span>
                        <div class="PosButtonList">
                            <button v-for="Possession in getPossessionsByBlock(Block.BlockId)" :key="Possession.PossessionId" class="PosButton"> {{ Possession.No }} </button>
                        </div>
                    </div>

                </div>
                <button v-else v-for="Possession in getPossessions" :key="Possession.PossessionId" class="PosButton"> {{ Possession.No }} </button>
            </div>

        </div>
        <div v-else>
            <b-form>
                 
            </b-form>
        </div>

        <b-modal id="modalRoom" title="Yeni Oda" hide-footer body-class="modalBody">
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

                <b-form-group label="Blok:" label-for="select2" label-cols="4" label-cols-lg="2">
                    <b-form-select 
                        id="select2" 
                        v-if="selectedRow.IsBlocky" 
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
                
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {required, minValue } from "vuelidate/lib/validators"

    export default {
        data() {
            return {
                mansionSelected: false,
                possessionSelected: false,
                possessionData: [],
                fields: [ 
                    { key: 'Name', label: 'Otel Adı', sortable: true, }, 
                    { key: 'Description', label: 'Tanım', sortable: true, }, 
                    { key: 'Title', label: 'Title', sortable: true, }, 
                    { key: 'ImageUrl', label: 'Görsel', sortable: true, }, 
                    { key: 'IlId', label: 'İl', sortable: true, }, 
                    { key: 'IlceId', label: 'İlçe', sortable: true, }, 
                    { key: 'Details', label: 'Detaylar', }, 
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
            }
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
            ...mapGetters(["getMansions", "getPossessionStatus", "getBlocks", "getPossessions", "getPossessionsByBlock"]),
            MansionInfo() {
                return this.selectedRow.Name + " (" + (this.selectedRow.IsBlocky ? this.$store.getters.getBlocks.length + " Blok " : "") + this.$store.getters.getPossessions.length + " Oda)"
            }
        },
        methods: {
            selectRow(Row) {
                this.Possession.MansionId = Row.MansionId
                this.Block.MansionId = Row.MansionId
                this.Possession.UserId = Row.OwnerUser
                this.mansionSelected = true
                this.selectedRow = Row
                this.ListPossessions()
                
                if (Row.IsBlocky) {
                    this.Possession.BlockId = -1
                    this.ListBlocks()
                }
            },
            ResetPossession() {
                this.Possession.No = ''
                this.Possession.Info = ''
                this.Possession.PossessionType = -1
                this.Possession.BlockId = null
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
                this.$store.dispatch("ListPossessions", this.Possession.MansionId)
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

                console.log(event)
                // this.$bvModal.hide('modalRoom')
            },
        },
    }
</script>

<style scoped>

</style>