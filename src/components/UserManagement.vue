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
        <b-form class="userForm-main" @reset="onReset" v-else>
            <div class="userForm">
                <b-form-group class="userForm-group" id="input-group-1" label="Kullanıcı Adı:" label-for="input-1">
                    <b-form-input
                        id="input-1"
                        v-model="Form.UserName"
                        placeholder="Kullanıcı Adı Giriniz"
                        :disabled="!isNew"
                        :state="$v.Form.UserName.$dirty ? !$v.Form.UserName.$anyError : null"
                        @blur="$v.Form.UserName.$touch()"
                    ></b-form-input>
                    <div v-if="$v.Form.UserName.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Form.UserName.required" :state="$v.Form.UserName.required">
                            Lütfen Kullanıcı Adı Giriniz
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.Form.UserName.minLength" :state="$v.Form.UserName.minLength">
                            Kullanıcı Adı en az 6 karakterden oluşmaktadır
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.Form.UserName.isUnique" :state="$v.Form.UserName.isUnique">
                            Kullanıcı Adı Kullanılmaktadır
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>

                <b-form-group class="userForm-group" id="input-group-11" label="Mail:" label-for="input-11">
                    <b-form-input
                        id="input-11"
                        v-model="Form.Mail"
                        type="email"
                        placeholder="Mail Giriniz"
                        :disabled="!isNew"
                        :state="$v.Form.Mail.$dirty ? !$v.Form.Mail.$anyError : null"
                        @blur="$v.Form.Mail.$touch()"
                    ></b-form-input>
                    <div v-if="$v.Form.Mail.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Form.Mail.required" :state="$v.Form.Mail.required">
                            Lütfen Mail Giriniz
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.Form.Mail.email" :state="$v.Form.Mail.email">
                            Lütfen Mail Adresini Doğru Formatta Giriniz
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.Form.Mail.isUnique" :state="$v.Form.Mail.isUnique">
                            Mail Adresi Kullanılmaktadır
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>

                <b-form-group class="userForm-group" id="input-group-2" label="Ad:" label-for="input-2">
                    <b-form-input
                        id="input-2"
                        v-model="Form.FirstName"
                        placeholder="Ad Giriniz"
                        :state="$v.Form.FirstName.$dirty ? !$v.Form.FirstName.$anyError : null"
                        @blur="$v.Form.FirstName.$touch()"
                    ></b-form-input>
                    <div v-if="$v.Form.FirstName.$dirty">
                        <b-form-invalid-feedback :state="$v.Form.FirstName.required">
                            Lütfen Ad Giriniz
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>

                <b-form-group class="userForm-group" id="input-group-3" label="Soyad:" label-for="input-3">
                    <b-form-input 
                        id="input-3"
                        v-model="Form.LastName"
                        placeholder="Soyad Giriniz"
                        :state="$v.Form.LastName.$dirty ? !$v.Form.LastName.$anyError : null"
                        @blur="$v.Form.LastName.$touch()"
                    ></b-form-input>
                    <div v-if="$v.Form.LastName.$dirty">
                        <b-form-invalid-feedback :state="$v.Form.LastName.required">
                            Lütfen Soyad Giriniz
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>

                <b-form-group class="userForm-group" id="input-group-21" label="Parola:" label-for="input-21">
                    <b-form-input
                        id="input-21"
                        type="password"
                        v-model="Form.Password"
                        placeholder="Parola Giriniz"
                        :state="$v.Form.Password.$dirty ? !$v.Form.Password.$anyError : null"
                        @blur="$v.Form.Password.$touch()"
                    ></b-form-input>
                    <div v-if="$v.Form.Password.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Form.Password.required" :state="$v.Form.Password.required">
                            Lütfen Parola Adı Giriniz
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.Form.Password.minLength" :state="$v.Form.Password.minLength">
                            Parolanız en az 6 karakterden oluşmalıdır
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>

                <b-form-group class="userForm-group" id="input-group-4" label="Doğum Tarihi:" label-for="input-4">
                    <b-form-datepicker 
                        id="input-4" 
                        class="mb-2" 
                        placeholder="Tarih Giriniz"
                        locale="tr"
                        :start-weekday="1"
                        :label-help="'Takvim tarihlerinde gezinmek için imleç tuşlarını kullanınız'"
                        :show-decade-nav="true"
                        :hide-header="true"
                        v-model="Form.DateOfBirth"
                    ></b-form-datepicker>
                </b-form-group>

                <b-form-group class="userForm-group" id="input-group-31" label="Telefon:" label-for="input-31">
                    <b-form-input 
                        id="input-31"
                        type="text"
                        v-model="Form.PhoneNumber"
                        @change="formatPhone"
                        placeholder="Telefon Giriniz"
                    ></b-form-input>
                </b-form-group>

                <b-form-group class="userForm-group" id="input-group-5" label="Rol:" label-for="input-5">
                    <b-form-select
                        id="input-5"
                        v-model="Form.RoleId"
                        :disabled="!isNew"
                        :state="$v.Form.RoleId.$dirty ? !$v.Form.RoleId.$anyError : null" @input="setRole">

                        <option selected disabled value="-1">Lütfen Rol Seçiniz</option>
                        <option v-for="role in getRoleList" :value="role.RoleId" :key="role.RoleId">{{ role.Description }}
                        </option>
                    </b-form-select>
                    <div v-if="$v.Form.RoleId.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Form.RoleId.minValue" :state="$v.Form.RoleId.minValue">
                            Lütfen Rol Seçiniz
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>
            </div>

            <div class="userForm" v-if="IsSubUser">
                <b-form-group class="userForm-group" id="input-group-6" label="Üst Kullanıcı:" label-for="input-6">
                    <b-form-select
                        id="input-6"
                        v-model="Form.PrimaryUser"
                        :disabled="!isNew"
                        :state="$v.Form.PrimaryUser.$dirty ? !$v.Form.PrimaryUser.$anyError : null">

                        <option selected disabled value="-1">Lütfen Üst Kullanıcı Seçiniz</option>
                        <option v-for="user in getPrimaryList" :value="user.UserId" :key="user.UserId">{{ user.FullName }}
                        </option>
                    </b-form-select>
                    <div v-if="$v.Form.PrimaryUser.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Form.PrimaryUser.minValue" :state="$v.Form.PrimaryUser.minValue">
                            Lütfen Üst Kullanıcı Seçiniz
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>
            </div>

            <div class="userForm" v-if="IsUser">
                <b-form-group class="userForm-group" id="input-group-7" label="Proje:" label-for="input-7">
                    <b-form-select id="input-7" v-model="Form.MansionId" :state="$v.Form.MansionId.$dirty ? !$v.Form.MansionId.$anyError : null" @input="setMansion">
                        <option selected disabled value="-1">Lütfen Proje Seçiniz</option>
                        <option v-for="Mansion in getMansions" :value="Mansion.MansionId" :key="Mansion.MansionId">{{ Mansion.Name }}
                        </option>
                    </b-form-select>
                    <div v-if="$v.Form.MansionId.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Form.MansionId.minValue" :state="$v.Form.MansionId.minValue">
                            Lütfen Proje Seçiniz
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>

                <b-form-group class="userForm-group" id="input-group-71" label="Blok:" label-for="input-71" v-if="IsUser && IsBlocky">
                    <b-form-select
                        id="input-71"
                        v-model="Form.BlockId"
                        :state="$v.Form.BlockId.$dirty ? !$v.Form.BlockId.$anyError : null"
                        @input="setBlock">

                        <option selected disabled value="-1">Lütfen Blok Seçiniz</option>
                        <option v-for="Block in getBlocks" :value="Block.BlockId" :key="Block.BlockId">{{ Block.Name }}
                        </option>
                    </b-form-select>
                    <div v-if="$v.Form.BlockId.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Form.BlockId.minValue" :state="$v.Form.BlockId.minValue">
                            Lütfen Blok Seçiniz
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>

                <b-form-group class="userForm-group" id="input-group-72" label="Daire:" label-for="input-72">
                    <b-form-select
                        id="input-72"
                        v-model="Form.PossessionId"
                        :state="$v.Form.PossessionId.$dirty ? !$v.Form.PossessionId.$anyError : null"
                        @input="setRoom">

                        <option selected disabled value="-1">Lütfen Daire Seçiniz</option>
                        <option v-for="Possession in getPossessions" :value="Possession.PossessionId" :key="Possession.PossessionId">{{ Possession.No }}
                        </option>
                    </b-form-select>
                    <div v-if="$v.Form.PossessionId.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Form.PossessionId.minValue" :state="$v.Form.PossessionId.minValue">
                            Lütfen Daire No Seçiniz
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>

                <b-form-group class="userForm-group" id="input-group-73" label="Giriş Tarihi:" label-for="input-73" v-if="IsDated">
                    <b-form-datepicker 
                        id="input-73" 
                        placeholder="Giriş Tarihi Seçiniz" 
                        :state="$v.Form.BeginDate.$dirty ? !$v.Form.BeginDate.$anyError : null"
                        @blur="$v.Form.BeginDate.$touch()"
                        locale="tr"
                        :start-weekday="1"
                        :label-help="'Takvim tarihlerinde gezinmek için imleç tuşlarını kullanınız'"
                        :show-decade-nav="true"
                        :hide-header="true"
                        v-model="Form.BeginDate"
                    ></b-form-datepicker>
                    <div v-if="$v.Form.BeginDate.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Form.BeginDate.required" :state="$v.Form.BeginDate.required">
                            Lütfen Giriş Tarihi Seçiniz
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.Form.BeginDate.dateMax" :state="$v.Form.BeginDate.dateMax">
                            Başlangıç Tarihi Bitiş Tarihinden Sonra Olamaz
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.Form.BeginDate.noPast" :state="$v.Form.BeginDate.noPast">
                            Geçmiş Tarih Seçimi Yapılamaz
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.Form.BeginDate.isBusy" :state="$v.Form.BeginDate.isBusy">
                            Belirtilen Tarihler Arası Daire Müsaitliği Bulunmuyor
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>

                <b-form-group class="userForm-group" id="input-group-74" label="Çıkış Tarihi:" label-for="input-74" v-if="IsDated">
                    <b-form-datepicker 
                        id="input-74" 
                        placeholder="Çıkış Tarihi Seçiniz" 
                        :state="$v.Form.EndDate.$dirty ? !$v.Form.EndDate.$anyError : null"
                        @blur="$v.Form.EndDate.$touch()"
                        locale="tr"
                        :start-weekday="1"
                        :label-help="'Takvim tarihlerinde gezinmek için imleç tuşlarını kullanınız'"
                        :show-decade-nav="true"
                        :hide-header="true"
                        v-model="Form.EndDate"
                    ></b-form-datepicker>
                    <div v-if="$v.Form.EndDate.$dirty">
                        <b-form-invalid-feedback v-if="!$v.Form.EndDate.required" :state="$v.Form.EndDate.required">
                            Lütfen Çıkış Tarihi Seçiniz
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.Form.EndDate.dateMin" :state="$v.Form.EndDate.dateMin">
                            Başlangıç Tarihi Bitiş Tarihinden Sonra Olamaz
                        </b-form-invalid-feedback>
                        <b-form-invalid-feedback v-else-if="!$v.Form.EndDate.isBusy" :state="$v.Form.EndDate.isBusy">
                            Belirtilen Tarihler Arası Daire Müsaitliği Bulunmuyor
                        </b-form-invalid-feedback>
                    </div>
                </b-form-group>
            </div>

            <b-form-group class="buttonGroup">
                <b-button variant="primary" style="margin-right: 5px;" @click="onSubmit">Gönder</b-button>
                <b-button type="reset" variant="warning" v-if="isNew" style="margin-right: 5px;">Temizle</b-button>
                <b-button variant="danger" style="margin-right: 5px;" @click="openList">İptal</b-button>
            </b-form-group>
        </b-form>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import { required, email, minLength, minValue, requiredIf } from "vuelidate/lib/validators"
    import axios from "axios"

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
                    RoleId: -1,
                    PrimaryUser: -1,
                    MansionId: -1,
                    BlockId: -1,
                    PossessionId: -1,
                    BeginDate: null,
                    EndDate : null,
                },
                IsBlocky: false,
                IsRoom: false,
                IsDated: false,
                IsUser: false,
                IsSubUser: false,
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
        created() {
            this.getUsersList()
        },
        validations() {
            return {
                Form: {
                    UserName: {
                        required,
                        minLength: minLength (6),
                        isUnique(UserName) {
                            return UserName.length >= 6 && this.isNew ?
                                axios.get("User/CheckUserName?UserName=" + UserName)
                                    .then(response => { return response.data})
                                : true
                        }
                    },
                    Password: {
                        required,
                        minLength: minLength (6)
                    },
                    Mail: {
                        required,
                        email,
                        isUnique(Mail) {
                            return Mail.length >= 6 && this.isNew ?
                                axios.get("User/CheckMail?Mail=" + Mail)
                                    .then(response => { return response.data})
                                : true
                        }
                    },
                    FirstName: {
                        required
                    },
                    LastName: {
                        required
                    },
                    PrimaryUser: {
                        minValue: minValue (this.IsSubUser ? 1 : -1)
                    },
                    RoleId: {
                        minValue: minValue (1)
                    },
                    MansionId: {
                        minValue: minValue (this.IsUser && this.isNew ? 1 : -1)
                    },
                    BlockId: {
                        minValue: minValue (this.IsUser && this.IsBlocky ? 1 : -1)
                    },
                    PossessionId: {
                        minValue: minValue (this.IsUser && this.isNew ? 1 : -1)
                    },
                    BeginDate: {
                        required: requiredIf(function() {
                            return this.IsDated && this.IsUser;
                        }),
                        dateMax(val, { EndDate }) {
                            return EndDate != null && val > EndDate ? false : true
                        },
                        noPast(val) {
                            return !this.IsDated ? true : (new Date(val)).toLocaleDateString() >= (new Date()).toLocaleDateString()
                        },
                        isBusy(PossessionId, BeginDate, EndDate) {
                            return PossessionId > 0 && BeginDate != null && EndDate != null ?
                                axios.get("User/CheckBusy?PossessionId=" + PossessionId + "&BeginDate=" + BeginDate + "&EndDate=" + EndDate)
                                    .then(response => { return response.data})
                                : true
                        }
                    },
                    EndDate: {
                        required: requiredIf(function() {
                            return this.IsDated && this.IsUser;
                        }),
                        dateMin(val, { BeginDate }) {
                            return BeginDate != null && val < BeginDate ? false : true
                        },
                        isBusy(PossessionId, BeginDate, EndDate) {
                            return PossessionId > 0 && BeginDate != null && EndDate != null ?
                                axios.get("User/CheckBusy?PossessionId=" + PossessionId + "&BeginDate=" + BeginDate + "&EndDate=" + EndDate)
                                    .then(response => { return response.data})
                                : true
                        }
                    },
                }
            }
        },
        computed: {
            ...mapGetters(["getUserList", "getRoleList", "getPrimaryList", "getMansions", "getPossessionStatus", "getBlocks", "getPossessions", "getPossessionsByBlock"]),
            PagingText() {
                return '<b>' +  this.rows + '</b> kayıt arasında ' + ((this.currentPage - 1) * this.perPage + 1) + ' - ' + Math.min((this.currentPage * this.perPage), this.rows) + ' arası kayıtlar'
            },
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
            setMansion() {
                this.$v.Form.MansionId.$touch()
                this.Form.BlockId = -1
                this.Form.PossessionId = -1
                this.$v.Form.BeginDate.$reset()
                this.$v.Form.EndDate.$reset()

                let Mansion = this.$store.getters.getMansions.find(x => x.MansionId == this.Form.MansionId)
                this.IsDated = Mansion.PossessionType == 4

                if (Mansion.IsBlocky) {
                    this.IsBlocky = true
                    this.IsRoom = false
                    this.$store.dispatch("ListBlocks", this.Form.MansionId)
                        .then(() => {
                            this.$v.Form.BlockId.$reset()
                        })
                } else {
                    this.IsRoom = true
                    this.IsBlocky = false
                    this.$store.dispatch("ListPossessionsNS", { MansionId: this.Form.MansionId })
                    .then(() => {
                        this.$v.Form.PossessionId.$reset()
                    })
                }
            },
            setBlock() {
                this.$v.Form.BlockId.$touch()
                this.IsRoom = true
                this.$store.dispatch("ListPossessionsNS", { MansionId: this.Form.MansionId, BlockId: this.Form.BlockId })
                    .then(() => {
                        this.Form.PossessionId = -1
                        this.$v.Form.PossessionId.$reset()
                    })
            },
            setRoom() {
                this.$v.Form.PossessionId.$touch()
                this.$v.Form.BeginDate.$reset()
                this.$v.Form.EndDate.$reset()

                let Possession = this.$store.getters.getPossessions.find(x => x.PossessionId == this.Form.PossessionId)
                this.IsDated = Possession.PossessionType != 3
            },
            setRole() {
                this.IsBlocky = false
                this.IsRoom = false
                this.IsUser = false
                this.IsSubUser = false
                this.$v.Form.$reset()
                let role = this.getRoleById(this.Form.RoleId)

                if (role) {
                    switch (role.RoleName) {
                        case 'User': 
                            this.IsUser = true
                            break;
                        case 'Subuser':
                            this.IsSubUser = true
                            break;
                        default:
                            break;
                    }
                }
            },
            openEdit(User) {
                this.onReset()
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
                this.Form.PrimaryUser = User.PrimaryUser || -1
                this.setRole()
                this.isEdit = true
                this.isNew = false
                // this.$refs.birthdate.localYMD = User.DateOfBirth.substring(0, 10)
            },
            openNew() {
                this.isEdit = true
                this.isNew = true
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
                    RoleId: -1,
                    PrimaryUser: -1,
                    MansionId: -1,
                    BlockId: -1,
                    PossessionId: -1,
                    BeginDate: null,
                    EndDate : null,
                }
                this.IsSubUser = false
                this.IsUser = false
                this.$v.Form.$reset()
                // if(this.$refs.birthdate != undefined) {
                //     this.$refs.birthdate.localYMD = ''
                // }
            },
            openList() {
                this.getUsersList()
                this.isEdit=false
                this.isNew=false
            },
            onSubmit() {
                this.$v.Form.$touch()

                if (this.$v.Form.$anyError) {
                    // Sorgu
                    JSON.stringify(this.$v.Form.$model);
                } else {
                    // alert(JSON.stringify(this.Form))
                    this.Form.PhoneNumber = this.Form.PhoneNumber.replace(/\D/g,'')
                    this.Form.PrimaryUser = this.Form.PrimaryUser == -1 ? null : this.Form.PrimaryUser 

                    if (this.isNew) {
                        
                        this.$store.dispatch("AddUser", { ...this.Form })
                            .then(() =>{
                                this.isEdit=false
                                this.isNew=false 
                                this.getUsersList()
                            })
                    } else {
                        
                        this.$store.dispatch("UpdateUser", { ...this.Form })
                            .then(() =>{
                                this.isEdit=false
                                this.isNew=false 
                                this.getUsersList()
                            })
                    }
                }
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