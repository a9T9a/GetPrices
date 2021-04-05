<template>
    <div>
        <div class="content">

            <form @submit.prevent="onSubmit" class="container">
                <p @click="new_User" class="new">{{!user.newUser?"Yeni Kayıt":"Kayıtlı Kullanıcı"}}</p>
                <h2>Login</h2>
                <div class="formgroup">
                    <label>E-Posta</label>
                    <input type="email" v-model="$v.user.email.$model" autocomplete="on">
                </div>
                <div class="formgroup">
                    <label>Şifre</label>
                    <input type="password" v-model="$v.user.password.$model" autocomplete="on">
                </div>
                <div class="formgroup" v-show="user.newUser">
                    <label>Şifre Tekrarı</label>
                    <input type="password" v-model="$v.user.repassword.$model" autocomplete="on">
                </div>
                <div class="btns">
                    <button id="login" type="submit" :disabled="$v.$invalid">{{user.newUser? "Kayıt":"Giriş"}}</button>
                    <button id="forget" >Şifremi Unuttum</button>
                </div>
            </form>
            <p v-if="$v.$invalid">hata</p>           
        </div>        
    </div>
</template>

<script>
import {required,email,sameAs} from "vuelidate/lib/validators"
export default {
    data(){
        return {
            user:{
                email:"",
                password:"",
                repassword:"",
                newUser:false,
            },
            
        }
    },

    validations:{
        user:{
            email:{
                required,email
            },
            password:{
                required
            },
            repassword:{
                sameAs:sameAs((vm)=>{
                    return vm.newUser===true ? vm.password : ""
                })
            }
        }
    },

    computed:{
        
    },
    methods:{
        new_User(){
            this.user.newUser=!this.user.newUser
            this.user.repassword=""
        },
        onSubmit(){
            this.$store.dispatch("login",{...this.user}) 
        }
    }
}
</script>

<style scoped>
    .container{
        position: relative;
        width: 50vmin;
        min-height: 50vmin;
        height: fit-content;
        background-color: rgb(154, 201, 201);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 1vmin;
        box-shadow: 0vmin 0vmin 3vmin 0.1vmin gray ;
    }

    .container input{
        margin: 0.5vmin 1vmin 3vmin 1vmin;
        height: 4vmin;
        width: 37vmin;
        border-radius: 0.8vmin;
        border:none;
        box-shadow: 0vmin 0vmin 1vmin -0.01vmin gray ;
    }

    .new {
        color:rgb(35, 65, 120);
        font-size: 1.7vmin;
        font-family: Arial, Helvetica, sans-serif;
        position: absolute;
        right: 5%;
        top: 1%;
        cursor: pointer;
    }

    .formgroup{
        display: flex;
        flex-direction: column;
        color:rgb(35, 65, 120);
        font-size: 2.5vmin;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 600;
    }

    .formgroup input{
        height: 4.5vmin;
        font-size: 2vmin;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 400;
        padding-inline: 1vmin;
    }

    .formgroup input:focus{
        outline:none 
    }

    .btns{
        margin-top: 2vmin ;
        margin-bottom: 3vmin;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content:space-around;
    }

    h2{
        font-family: Arial, Helvetica, sans-serif;
        color:rgb(35, 65, 120);
        margin-bottom: 3vmin;
    }
    
    #login{
        color:rgb(35, 65, 120);
        width: 10vmin;
        height: 4vmin;
        border:none;
        border-radius: 0.5vmin;
        background-color:rgb(140, 190, 190);
        box-shadow: 0vmin 0vmin 0.6vmin 0.3vmin gray;
        font-weight: 700;
        cursor: pointer;
    }

    #login:focus{
        outline:none;
        background-color: cornflowerblue;
        transition:background 0.2s ease-out;
    }

    #forget{
        color:rgb(35, 65, 120);
        width: fit-content;
        border:none;
        background-color: rgb(154, 201, 201);
        cursor:pointer;
    }

    #forget:focus{
        outline:none;
    }
</style>