<template>
  <div id="app">
    <div class="head">
      <router-link tag="div" to="/admin">
        <img src="../assets/user.png" alt="">
      </router-link>
      
      <img src="../assets/cart.png" alt="">
    </div>
    <app-header/>

    <div class="main">
      <div class="list">
        <app-list-view/>
      </div>
      <div class="reklam">
        <p>İNDİRİM</p>
      </div>

    </div>
  </div>
</template>

<script>
import Header from "./Header"
import ListView from "./ListView"
export default {
  components:{
    appHeader : Header,
    appListView : ListView,
  },
  data(){
    return{
    }
  },
}
</script>

<style>
  .main{
    display: flex;
    justify-content: center;
  }

  .list{
    width: 85vw;
  }

  .reklam{

    color: red;
    width: 15vw;
    height: 100%;
    font-size: 10vmin;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 500;
    margin-block: 1vmin;
    text-align: center;
    justify-content: center;
  }

  .reklam p{
    align-items: center;
    justify-content: center;
    width: 1px;
    word-wrap: break-word;
    margin: 5vmin auto;
    white-space:pre-wrap;
  }

  .head{
    margin-right: 5vmin;
  }

  .head img{
    margin:1vmin 5vmin 1vmin 1vmin;
    float: right;
    width:3.5vmin;
    cursor: pointer;
  }
</style>
