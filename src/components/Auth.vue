<template>
    <div class="pageContainer-login">
        <div class="row  mt-5">
            <div class="col-md-4 offset-4 card card-primary p-3 border"
                 :class="{'border-primary' : isUser, 'border-success' : !isUser }">
                        
                <img class="authLogo" alt="logo" src="../assets/helisLogo.png"/>
                <hr>
                <form @submit.prevent="onSubmit">
                    <div class="loginForm">
                        <label>E-posta Adresiniz</label>
                        <input 
                            v-model="user.email" 
                            class="form-control"
                            placeholder="Kullanıcı adı veya E-posta adresinizi giriniz"
                        >
                    </div>
                    <div class="loginForm" :style="{visibility: !isForgotten ? 'visible' : 'hidden'}">
                        <label>Şifre</label>
                        <input 
                            v-model="user.password" 
                            type="password" 
                            class="form-control" 
                            placeholder="Şifreniz..."
                        >
                    </div>
                    <div class="button-container d-flex  flex-column align-items-center">
                        <button type="submit" :class="{'btn-primary' : !isForgotten, 'btn-danger' : isForgotten }"
                                class="btn btn-block mb-2">
                            {{ !isForgotten ? 'Giriş Yap' : 'Mail Sıfırla' }}
                        </button>
                        <a href="#" @click.prevent="isUser=!isUser" class="text-secondary" style="display: none">
                            {{ isUser ? 'Üye değilim' : 'Üyeliğim var'}}
                        </a>
                        <a href="#" @click.prevent="isForgotten=!isForgotten" class="text-secondary">
                            {{ isForgotten ? 'Parolamı Hatırlıyorum' : 'Parolamı Unuttum'}}
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                user: {
                    email: null,
                    password: null
                },
                isUser: true,
                isForgotten: false
            }
        },
        methods: {
            onSubmit() {
                this.$store.dispatch("login", { ...this.user, isUser : this.isUser, isForgotten : this.isForgotten })
                    .then(response => {
                        console.log(response)
                        // this.$router.push("/")
                        this.$store.dispatch("initAuth")
                    })
            }
        }
    }
</script>

<style scoped>
    .button-submit {
        color: #fff;
        background-color: #D6B761;
        border-color: #D6B761;
    }
</style>
