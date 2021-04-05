<template>
  <div id="app">
  <router-view/>
  </div>
</template>

<script> 
export default {
  data(){
    return{
    }
  },
  created(){
    this.$store.dispatch("initLog")
    this.$store.dispatch("getFirestore")
  }
}
</script>

<style>
  body{
    background-color: rgb(255, 241, 224);
  }
</style>
