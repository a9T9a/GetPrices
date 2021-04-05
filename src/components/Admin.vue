<template>
    <div id="app">
        <div class="header">
            <div @click="exit" v-if="getLog">
                <img src="../assets/exit.png">
            </div>
            <router-link tag="div" to="/admin">
                <img src="../assets/user.png">
            </router-link>
            <router-link tag="div" to="/">
                <img src="../assets/cart.png">
            </router-link>
            <router-link tag="div" to="/">
                <img src="../assets/home_black.png">
            </router-link>
        </div>
        <div class="container">
            <app-login v-if="!getLog" style="margin-top:10vmin"/>
            <app-set-products v-else />
        </div>
    </div>
</template>

<script>
import Login from "./Login"
import SetProducts from "./SetProducts"
import { mapGetters } from "vuex"
export default {
    data(){
        return {
            
        }
    },
    components:{
        appLogin:Login,
        appSetProducts:SetProducts
    },
    methods:{
        exit(){
            this.$store.dispatch("logout",false)
        }
    },
    computed:{
        ...mapGetters(["getLog"]),
    },
    
}
</script>

<style scoped>
    .header{
        width: 98%;
        height: 5vmin;
        display: flex;
        flex-direction: row-reverse;
        margin: 2vmin 4vmin 1vmin 4vmin;
    }
    .header img{
        width: 4vmin;
        margin-right: 4vmin;
        height: auto;
        cursor: pointer;
    }

    .container{
        display: flex;
        width: 100%;

        justify-content: center;
    }

</style>