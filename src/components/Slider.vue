<template>
    <div class="card-pic">
        <img :src="image" @mouseover="Slide" @mouseleave="StopSlide">
    </div>
</template>

<script>
export default {
    props:["product"],
    data(){
        return{
            images:this.product,
            index:1,
            timer:null
        }
    },
    computed:{
        image(){
            return this.images[this.index]
        }
    },
    methods:{
        Slide(){
            this.timer=setInterval(()=>{
                if(this.index==this.images.length-1){
                    this.index=0
                }else{
                    this.index++
                }  
            },500)
        },
        StopSlide(){
            clearInterval(this.timer)
        }
    }
}
</script>

<style scoped>
    .container .card .card-pic{
    position: relative;
    width: 24.5vmin;
    height:35vmin
  }

  .container .card .card-pic img{
    max-height: 35vmin;
    max-width: 100%;
    width: 100%;
    height: auto;
    border-radius: 5px; 
  }
</style>