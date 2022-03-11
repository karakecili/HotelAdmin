<template>
    <div class="container">
        <b-table striped hover :items="getModuleData" :fields="getFields">
            <!-- Sıralama -->
            <template #cell(index)="data">
                {{ data.index + 1 }}
            </template>
            
            <template #head(Details)>
                İşlemler 
                <button class="btn-primary" style="border-radius: 12px; border: solid 2px #0d6efd; background-color: #007bff" title="Yeni Kayıt" @click="openNew($event.target)">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
            </template>
            
            <template #cell(Details)="row">
                <b-button size="sm" @click="row.toggleDetails" class="mr-2">
                    Son İşlem {{ row.detailsShowing ? 'Gizle' : 'Göster'}} 
                </b-button>

                <b-button variant="warning" size="sm" class="mr-2" @click="openUpdate(row.item, row.index, $event.target)">Düzenle</b-button>
                <b-button :variant="row.item.DB_Action == 0 ? 'primary' : 'danger'" size="sm" class="mr-2"> {{row.item.DB_Action == 0 ? 'Aktif' : 'Pasif' }}</b-button>
                <!-- <b-button variant="danger" size="sm" class="mr-2" v-else>Pasif</b-button> -->
            </template>

            <template #cell(IlId)="row">
                {{ !row.field.isPrimary && row.value != "" ? getProvinces.find(x => x.IlId == row.value).Il : row.value }}
            </template>

            <template #cell(IlceId)="row">
                {{ !row.field.isPrimary && row.value != "" ? getDistrict.find(x => x.IlceId == row.value).Ilce : row.value }}
            </template>

            <template #cell(ImageUrl)="row">
                <b-img :src="require(`../../../images/${GetModuleInfo.CurrentImagePath}/${row.value}`)" :alt="row.value" border=3 class="listImage" v-if="row.value!=''"></b-img>
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
                <b-form-group 
                    :label="col.label" 
                    :label-for="col.key" 
                    v-if="col.infoType != 'image' && col.infoShow == 1"
                >
                    <b-form-select
                        v-if="col.infoType == 'select'"
                        :id="col.key"
                        v-model="infoModal.row[col.key]"
                        :disabled="isUpdate ? !col.infoEdit : !col.infoNew"
                    >         
                        <template v-if="col.key == 'IlId'">
                            <option value="-1" disabled>Lütfen İl Seçiniz</option>
                            <option v-for="province in getProvinces" :value="province.IlId" :key="province.IlId">{{ province.Il }}</option>
                        </template>
                        <template v-else-if="col.key == 'IlceId'"> 
                            <option value="-1" disabled>Lütfen İlçe Seçiniz</option>
                            <option v-for="district in getDistrict" :value="district.IlceId" :key="district.IlceId">{{ district.Ilce }}</option>
                        </template>
                        <template v-else-if="col.key == 'Type'"> 
                            <option value="-1" disabled>Lütfen Araç Seçiniz</option>
                            <option v-for="vehicle in getVehicles" :value="vehicle" :key="vehicle">{{ vehicle }}</option>
                        </template>
                       
                    </b-form-select>
                    <b-form-input 
                        v-else
                        :id="col.key"
                        v-model="infoModal.row[col.key]"
                        :type="col.infoType"
                        :disabled="isUpdate ? !col.infoEdit : !col.infoNew"
                    ></b-form-input>
                </b-form-group>
                <b-form-group 
                    :label="col.label" 
                    :label-for="col.key" 
                    :disabled="isUpdate ? !col.infoEdit : !col.infoNew"
                    v-else-if="col.infoType == 'image' && col.infoShow == 1"
                >
                    <b-img 
                        v-if="isUpdate"
                        :src="require(`../../../images/${GetModuleInfo.CurrentImagePath}/${infoModal.row[col.key]}`)"
                        fluid 
                        alt="Responsive image"
                    ></b-img>
                    <b-form-file
                        v-model="uploadFile"
                        :state="Boolean(uploadFile)"
                        placeholder="Dosya seçiniz veya buraya sürükleyiniz..."
                        drop-placeholder="Dosyayı buraya sürükleyiniz..."
                        v-if="col.infoType == 'image' && col.infoEdit"
                    ></b-form-file>
                </b-form-group>

                <!-- TO DO -->
                <!-- <input type="text" :id=`name-${index}` name="name" v-model="list.name" />
                {{list.name}} -->
            </div>
    
            <template #modal-footer>
                <div class="w-100">
                    <b-button
                        variant="success"
                        class="float-left"
                        @click="saveRow"
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
    import UploadService from "../services/UploadFilesService";

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
                uploadFile: null,
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
            this.infoModal.cols = this.$store.getters.getFields
        },
        computed: {
            ...mapGetters(["getModuleData", "getFields", "getAdminById", "getDB_ActionById", "getProvinces", "getDistrict", "getVehicles", "GetModuleInfo"]),
        },
        methods: {
            openNew(button) {
                this.uploadFile = null
                this.isUpdate = false
                this.infoModal.cols = this.$store.getters.getFields
                let rows = {}
                this.infoModal.cols.forEach(e => {
                    rows[e.keyValue] = e.infoType == "text" ? "" :
                        e.infoType == "select" ? "-1" :
                        e.infoType == "image" ? "" : "";
                });
                this.infoModal.row = rows
                this.infoModal.title = `Yeni Kayıt`
                this.$root.$emit('bv::show::modal', this.infoModal.id, button)
            },
            openUpdate(item, index, button) {
                this.uploadFile = null
                this.isUpdate = true
                this.infoModal.cols = this.$store.getters.getFields
                let rows = {}
                // this.infoModal.row = item
                this.infoModal.cols.forEach(e => {
                    rows[e.keyValue] = item[e.keyValue]
                });
                this.infoModal.row = rows
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
            },
            saveRow() {
                this.isUpdate ? this.updateRow() : this.newRow()
            },
            updateRow() {
                console.log(this.infoModal)
                let data = JSON.stringify(this.infoModal.row)
                if ('ImageUrl' in this.infoModal.row) {
                    
                            UploadService.upload(this.uploadFile, (event) => {
                                var progress = Math.round((100 * event.loaded) / event.total);
                                console.log(progress)
                            })

                    this.$store.dispatch("AddPicture", { image: this.uploadFile })
                        .then((response) => {
                            console.log(response)
                        })
                    this.Upload(this.uploadFile)
                        .then(x => {
                            console.log([].concat(x))
                            
                    this.$store.dispatch("AddPicture", { image: x[0] })
                    
                        var dataURL = x[0].url
                        var blob = this.dataURItoBlob(dataURL);
                        var fd = new FormData(document.forms[0]);
                        fd.append("canvasImage", blob);
                        
                        }
                        )
                } else {
                    this.$store.dispatch("UpdateModule", { updateInfo: data })
                        .then((response) => {
                            console.log(response)
                            this.$bvModal.hide(this.infoModal.id)
                        })
                }
            },
            newRow() {
                console.log(this.infoModal)
                let data = JSON.stringify(this.infoModal.row)
                this.$store.dispatch("NewModule", { insertInfo: data })
                    .then((response) => {
                        console.log(response)
                        this.$bvModal.hide(this.infoModal.id)
                    })
            },
            Upload(formData) {
                const photos = []
                photos[0] = formData
                const promises = photos.map((x) => this.getImage(x)
                    .then(img => ({
                        id: img,
                        originalName: x.name,
                        fileName: x.name,
                        url: img
                    })));
                return Promise.all(promises);
            },
            getImage(file) {
                return new Promise((resolve) => {
                    const fReader = new FileReader();
                    const img = document.createElement('img');

                    fReader.onload = () => {
                        img.src = fReader.result;
                        resolve(this.getBase64Image(img));
                    }

                    fReader.readAsDataURL(file);
                })
            },
            getBase64Image(img) {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const dataURL = canvas.toDataURL('image/png');

                return dataURL;
                // return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            },
            downloadImage(data, filename = 'untitled.jpeg') {
                var a = document.createElement('a');
                a.href = data;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
            },
            dataURItoBlob(dataURI) {
                // convert base64/URLEncoded data component to raw binary data held in a string
                var byteString;
                if (dataURI.split(',')[0].indexOf('base64') >= 0)
                    byteString = atob(dataURI.split(',')[1]);
                else
                    byteString = unescape(dataURI.split(',')[1]);

                // separate out the mime component
                var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

                // write the bytes of the string to a typed array
                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                return new Blob([ia], {type:mimeString});
            }
        },
        destroyed () {
            console.log('destroyed');
        },
    }
</script>

<style>
    table#table-transition-example .flip-list-move {
        transition: transform 1s;
    }
</style>