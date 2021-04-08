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

  ::-webkit-scrollbar {
    width: 0.5vmax;
    height: 5vmax;
  }
  /* Track */
  ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 .5vmax rgba(0,0,0,0.3); 
      -webkit-border-radius: 6px;
      border-radius: 6px;
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
      -webkit-border-radius: 6px;
      border-radius: 6px;
      background: rgb(17, 97, 98);
  }
  ::-webkit-scrollbar-thumb:window-inactive {
      background: rgb(17, 97, 98);
  }
</style>
