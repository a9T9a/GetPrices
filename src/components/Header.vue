<template>
    <div id="header">
        <router-link id="icon" tag="div" to="/">
            <img src="../assets/filter.png">
        </router-link>
        <div class="header-item" @click="e_filter(''),isActive=0" :class="{active:isActive==0}">Tümü</div>
        <p class="header-item" v-for="(cat,index) in getCats" :key="index" @click="e_filter(cat),isActive=index+1" :class="{active:isActive==index+1}">{{cat}}</p>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"
import { eventBus } from "../main"
export default {
    data(){
        return{
            isActive:""
        }
    },
    computed:{
        ...mapGetters(["getFiltered", "getProducts", "getCats"]),
        ...mapMutations(["change_catFilter"])
    },
    methods:{
        e_filter(tarz){
            this.$store.commit("change_catFilter",tarz)
            eventBus.$emit("clear")
        },
    }
}
</script>

<style scoped>
    #header{
        position: relative;
        width: 100%;
        height: 9vmin;
        background-color: rgb(17, 97, 98);
        color: bisque;
        font-size: 2.5vmin;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 500;
        display: flex;
        flex-direction: row;
        justify-content:space-around;
        align-items: center;
    }

    #icon{
        max-height: 10vmin;
        width: auto;
        margin: 5vmin;
        cursor: pointer;
    }

    #icon img{
        justify-content: center;
        max-height: 5vmin;
        width: auto;
    }

    .header-item{
        display: inline-flex;
        justify-content: center;
        align-items: center;
        height: 9.5vmin;
        width: 100%;
        transition: ease 0.3s;
    }

    .header-item:hover{
        cursor: pointer;
        background-color: rgb(35, 65, 120);
        border: 1px solid bisque;
    }
    
    .active{
        background-color: rgb(35, 65, 120);
        border: 1px solid bisque;
    }

</style>