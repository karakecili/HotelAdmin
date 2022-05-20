<template>
    <div class="pageContainer">
        <div v-if="!isEdit">
            <div :style="'max-height: calc(100vh - ' + (rows > perPage ? '40' : '0') + 'px);overflow-y: auto; min-height: calc(100vh - 50px);'">
                    
                <table class="table table-hover table-light table-bordered">
                    <thead>
                        <td>Kullanıcı
                            <b-dropdown :variant="searchData.UserName.length > 0 ? 'primary' : 'outline-primary'" text="Dropdown" class="filterDD">
                                <template #button-content>
                                    <i class="fas fa-filter"></i>
                                </template>
                                <input type="text" v-model="searchData.UserName" @input="getUsersList">
                            </b-dropdown>
                        </td>
                        <td>Ad-Soyad
                            <b-dropdown :variant="searchData.Name.length > 0 ? 'primary' : 'outline-primary'" text="Dropdown" class="filterDD">
                                <template #button-content>
                                    <i class="fas fa-filter"></i>
                                </template>
                                <input type="text" v-model="searchData.Name" @input="getUsersList">
                            </b-dropdown>
                        </td>
                        <td>Mail
                            <b-dropdown :variant="searchData.Mail.length > 0 ? 'primary' : 'outline-primary'" text="Dropdown" class="filterDD">
                                <template #button-content>
                                    <i class="fas fa-filter"></i>
                                </template>
                                <input type="text" v-model="searchData.Mail" @input="getUsersList">
                            </b-dropdown>
                        </td>
                        <td>Telefon</td>
                        <td>Rol
                            <b-dropdown :variant="searchData.RoleId != null ? 'primary' : 'outline-primary'" text="Dropdown" class="filterDD">
                                <template #button-content>
                                    <i class="fas fa-filter"></i>
                                </template>
                                <select name="" id="slct_role" @change="getUsersList" v-model="searchData.RoleId"> 
                                    <option selected :value="null">Hepsi</option>
                                    <option v-for="role in getRoleList" :value="role.RoleId" :key="role.RoleId">{{ role.Description }}
                                    </option>
                                </select>
                            </b-dropdown>
                        </td>
                        <td>Kayıt Tarihi</td>
                        <td>Son İşlem Tarihi</td>
                        <td>İşlem
                            <button class="btn-primary" style="border-radius: 12px; border: solid 2px #0d6efd; background-color: #007bff" title="Yeni Kullanıcı" @click="openNew">
                                <i class="fa fa-user-plus" aria-hidden="true"></i>
                            </button>
                        </td>
                    </thead>
                    <tbody>
                        <tr v-for="User in getUserList" :key="User.UserId">
                            <td> {{ User.UserName }} </td>
                            <td> {{ User.FirstName + " " + User.LastName  }} </td>
                            <td> {{ User.Mail }} </td>
                            <td> {{ User.PhoneNumber | formatToPhone }} </td>
                            <td> {{ getRoleById(User.RoleId).Description }} </td>
                            <td> {{ User.RegisterDate | formatDate }} </td>
                            <td> {{ User.DB_Datetime | formatDate }} </td>
                            <td>
                                <button class="btn-secondary btn-icon" style="border-radius: 12px; margin-right: 5px; border: solid 2px #6c757d;" title="Düzenle" @click="openEdit(User)">
                                    <i class="fa fa-user-edit" aria-hidden="true"></i>
                                </button>
                                <button :class="User.DB_Action == 0 ? 'btn-success' : 'btn-danger'" :title="User.DB_Action == 0 ? 'Aktife Al' : 'Pasife Al'"
                                    :style="User.DB_Action == 0 ? 'border-radius: 12px; border: solid 2px #198754;' : 'border-radius: 12px; border: solid 2px #dc3545'" 
                                    @click="SetActivePassive(User.DB_Action == 0, User.UserId)">
                                    <span v-show="User.DB_Action == 0"><i class="fa fa-user-check" aria-hidden="true"></i></span>
                                    <span v-show="User.DB_Action != 0"><i class="fa fa-user-times" aria-hidden="true"></i></span>
                                </button>
                            </td>
                        </tr>
                        <tr v-if="getUserList.length == 0">
                            <td colspan="8" class="noRequest">
                                <div class="alert noRequestDiv">
                                    <strong>Filtreye Uygun Bir Kayıt Bulunamadı</strong>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="paging" v-if="rows > perPage">
                <b-pagination
                    v-model="currentPage"
                    :total-rows="rows"
                    :per-page="perPage"
                    first-number
                    last-number
                    @input="getUsersList"
                ></b-pagination>
                <div v-html="PagingText"></div>
            </div>
        </div>
        <b-form @submit="onSubmit" @reset="onReset" v-else>
            <b-form-group
                id="input-group-1"
                label="Kullanıcı Adı:"
                label-for="input-1"
                description="Kullanıcı Adı Zorunludur."
            >
                <b-form-input
                    id="input-1"
                    v-model="Form.UserName"
                    placeholder="Kullanıcı Adı Giriniz"
                    :disabled="!isNew"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group
                id="input-group-11"
                label="Mail:"
                label-for="input-11"
                description="Mail Adresi Alanı Zorunludur."
            >
                <b-form-input
                    id="input-11"
                    v-model="Form.Mail"
                    type="email"
                    placeholder="Mail Giriniz"
                    :disabled="!isNew"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-21" label="Parola:" label-for="input-21">
                <b-form-input
                    id="input-21"
                    type="password"
                    v-model="Form.Password"
                    placeholder="Parola Giriniz"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Ad:" label-for="input-2">
                <b-form-input
                    id="input-2"
                    v-model="Form.FirstName"
                    placeholder="Ad Giriniz"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Soyad:" label-for="input-3">
                <b-form-input 
                    id="input-3"
                    v-model="Form.LastName"
                    placeholder="Soyad Giriniz"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-4" label="Doğum Tarihi:" label-for="input-4">
                <b-form-datepicker 
                    id="input-4" 
                    class="mb-2" 
                    placeholder="Tarih Giriniz"
                    locale="tr"
                    :start-weekday="1"
                    :label-help="'Takvim tarihlerinde gezinmek için imleç tuşlarını kullanınız'"
                    :show-decade-nav="true"
                    :hide-header="true"
                    @input="Form.DateOfBirth = $refs.birthdate.localYMD"
                    ref="birthdate"
                ></b-form-datepicker>
            </b-form-group>

            <b-form-group id="input-group-31" label="Telefon:" label-for="input-31">
                <b-form-input 
                    id="input-31"
                    type="text"
                    v-model="Form.PhoneNumber"
                    @change="formatPhone"
                    placeholder="Telefon Giriniz"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-5" label="Rol:" label-for="input-5">
                <b-form-select
                    id="input-5"
                    v-model="Form.RoleId"
                    required
                >
                    <option selected  value="">Lütfen Rol Seçiniz</option>
                    <option v-for="role in getRoleList" :value="role.RoleId" :key="role.RoleId">{{ role.RoleName }}
                    </option>
                </b-form-select>
            </b-form-group>

            <b-form-group class="buttonGroup">
                <b-button type="submit" variant="primary" style="margin-right: 5px;">Gönder</b-button>
                <b-button type="reset" variant="warning" v-if="isNew" style="margin-right: 5px;">Temizle</b-button>
                <b-button variant="danger" style="margin-right: 5px;" @click="openList">İptal</b-button>
            </b-form-group>
        </b-form>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";

    export default {
        data() {
            return {
                searchData: {
                    UserId: null,
                    UserName: '',
                    Mail: '',
                    Name: '',
                    RoleId: null,
                    isActivated: null,
                    currentPage: 1,
                    perPage: 20,
                },
                isEdit: false,
                isNew: false,
                Form: {
                    UserId: null,
                    UserName: '',
                    Password: '',
                    Mail: '',
                    FirstName: '',
                    LastName: '',
                    Language: 'tr',
                    DateOfBirth: null,
                    Address: '',
                    PhoneNumber: '',
                    RoleId: '',
                },
                rows: 0,
                perPage: 20,
                currentPage: 1,
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
                // return value
                let x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                return !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
                
            },
        },
        computed: {
            ...mapGetters(["getUserList"]),
            ...mapGetters(["getRoleList"]),
            PagingText() {
                return '<b>' +  this.rows + '</b> kayıt arasında ' + ((this.currentPage - 1) * this.perPage + 1) + ' - ' + Math.min((this.currentPage * this.perPage), this.rows) + ' arası kayıtlar'
            },
        },
        created() {
            this.getUsersList()
        },
        methods: {
            formatPhone() {
                let x = this.Form.PhoneNumber.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                this.Form.PhoneNumber = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
            },
            getUsersList() {
                this.searchData.perPage = this.perPage
                this.searchData.currentPage = this.currentPage

                this.$store.dispatch("getUsersList", { ...this.searchData })
                    .then(Response => {
                        if (Response.length > 0) {
                            this.rows = Response[0].OrderCount
                        }
                        else {
                            this.rows = 0
                        this.currentPage = 1
                        }
                    })
            },
            getRolesList() {
                this.$store.dispatch("getRolesList", { ...this.searchData })
            },
            getRoleById(id) {
                return this.$store.getters.getRoleById(id);
            },
            openEdit(User) {
                this.Form.UserId = User.UserId
                this.Form.UserName = User.UserName
                this.Form.Mail = User.Mail
                this.Form.Password = User.Password
                this.Form.FirstName = User.FirstName
                this.Form.LastName = User.LastName
                this.Form.Language = User.Language
                this.Form.DateOfBirth = User.DateOfBirth.substring(0, 10)
                this.Form.PhoneNumber = User.PhoneNumber
                this.Form.RoleId = User.RoleId
                this.isEdit=true
                this.isNew=false
                // this.$refs.birthdate.localYMD = User.DateOfBirth.substring(0, 10)
            },
            openNew() {
                this.isEdit=true
                this.isNew=true
                this.onReset()
            },
            onReset() {
                this.Form = {
                    UserId: null,
                    UserName: '',
                    Password: '',
                    Mail: '',
                    FirstName: '',
                    LastName: '',
                    Language: 'tr',
                    DateOfBirth: null,
                    Address: '',
                    PhoneNumber: '',
                    RoleId: '',
                }
                if(this.$refs.birthdate != undefined) {
                    this.$refs.birthdate.localYMD = ''
                }
                // this.$refs.birthdate.formattedValue = ''
            },
            openList() {
                this.getUsersList()
                this.isEdit=false
                this.isNew=false
            },
            onSubmit() {
                this.Form.PhoneNumber = this.Form.PhoneNumber.replace(/\D/g,'')
                this.$store.dispatch("UpdateUser", { ...this.Form })
                    .then(() =>{
                            this.isEdit=false
                            this.isNew=false 
                            this.getUsersList()
                        }
                    )
            },
            SetActivePassive(Active, ID) {
                this.$store.dispatch("SetActivePassive", { Active, ID })
                    .then(() =>{
                            this.getUsersList() 
                        }
                    )
            }
        },
    }
</script>