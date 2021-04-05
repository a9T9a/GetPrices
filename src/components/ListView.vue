<template>
  <div id="app">
    <div class="filterlist">
      <br>
      <div style="width:24vmin">
        <label class="item" style="text-transform:capitalize">İndirimdekiler</label>
        <input v-model="discount" type="checkbox" :value="discount" @change="getDiscounted" style="float:right">
      </div>
      <br>
      <p>Kategoriler</p>
      <div class="list" v-if="getCategory!=''">
        <div v-for="(category,index) of get_subCategories" :key="index" class="item">
          <label style="text-transform:capitalize">{{category}}</label>
          <input v-model="sub_categories" type="checkbox" :value="category" @change="change_subCategory" style="float:right">
        </div>
      </div>
      <br>
      <p>Renk</p>
      <div class="list">
        <div v-for="(color,index) of getColors" :key="index" class="item" style="{overflow:scroll}">
          <label style="text-transform:capitalize">{{color}}</label>
          <input v-model="colors" type="checkbox" :value="color" @change="changeColor" style="float:right">
        </div>
      </div>
      <br>
      <p>Sıralama</p>
      <div class="list-item" v-for="(sValue,index) of sortingValues" :key="index">
        <p :class="{active:sValue==sortingValue}" @click="sortProducts(sValue,index)" >{{sValue}}</p>
      </div>
    </div>
    <div class="container">
      <div id="last">
        <div class="left-arrow">
          <img src="../assets/left-arrow.png" alt="" @click="left($event)" @mousedown="dragstart" @mouseup="dragstop">
        </div>
        <div id="last-added-area">
          <p id="header">Son Eklenenler</p>
          <div class="last-added" v-for="(product,index) of getLasts" :key="index">
            <img class="last-added-img" :style="drag?{cursor: 'grabbing'}:null" :src="product.imageUrl[0]" alt="" @mousedown="dragstart" @mousemove="mouse_move($event)" @mouseup="dragstop" @mouseout="dragstop">
            <p class="last-added-price">{{product.newPrice}}</p>
          </div> 
        </div>
        <div class="right-arrow">
          <img src="../assets/right-arrow.png" alt="" @click="right($event)">
        </div>
      </div>
      <div class="card" :style="product.tukendi?{opacity:0.7}:null" v-for="(product) of getFiltered" :key="product.id">
        <app-slider :product="product.imageUrl"/>
        <div class="price" :class="{'price-red':product.indirim}">{{product.price}} TL</div>
        <div class="soldout" v-if="product.tukendi"><p>Tükendi</p></div>
        <div class="discount" v-if="product.newPrice<(product.price-1)">İndirim</div>
        <div class="newPrice" v-if="product.indirim">{{product.newPrice}} TL</div>
        <!--<router-link
         tag="div"
         to="/detail">
          <p>Siteye Git</p>
        </router-link>-->
        
        <a :href="product.link" style="text-decoration:none; color:inherit;" target="_blank">
          <p>Siteye Git</p>
        </a>
        
      </div>
    </div>
  </div>
</template>

<script>
import Slider from "./Slider"
import { mapGetters } from "vuex"
import { eventBus } from "../main"
export default {
  components:{
    appSlider:Slider
  },
  data(){
    return{
         color:"black",
         sub_categories:[],
         colors:[],
         discount:false,
         sortingValues:["En Yüksek Fiyat","En Düşük Fiyat","En Yeni","En Eski"],
         sortingValue:"",
         drag:false
    }
  },
  computed:{
    ...mapGetters(["getFiltered","get_subCategories","getColors","getCategory","getLasts"]),
    

  },
  methods:{
    dragstart(){
      this.drag=true
      window.getSelection().removeAllRanges();
    },
    dragstop(){
      this.drag=false
    },
    mouse_move(event){
      event.target.draggable=false
      if(this.drag){
        event.target.parentElement.parentElement.scrollLeft-=event.movementX
      }
    },
    left(event){
      console.log(window)
      event.target.parentElement.nextSibling.scrollLeft+=170
    },
    right(event){
      event.target.parentElement.previousSibling.scrollLeft-=50
    },
    addClass(value){
      var nClass="active"
      if(value==this.sortingValues){
        return nClass
      }else{
        return null
      }
    },
    change_subCategory(){
      this.$store.commit("change_subCategories",this.sub_categories)
    },
    changeColor(){
      this.$store.commit("changeColors",this.colors)
    },
    getDiscounted(){
      this.$store.commit("getDiscounted", this.discount)
    },
    sortProducts(value){
      this.$store.commit("getSorted",value)
      if(this.sortingValue==value){
        this.sortingValue=""
      }else{
        this.sortingValue=value
      }
    }
  },
  created(){
    eventBus.$on("clear",()=>{
      this.sub_categories=[]
    })
  },
}
</script>

<style scoped>

  #app{
    display: flex;
    flex-direction: row;
  }

  .container{
    left: 15vw;
    width: 83%;
    display: flex;
    justify-content: center;
    align-items: top;
    flex-wrap: wrap;
    flex-direction: row;
    margin:0px;
    padding:0px;
    padding-bottom: 10vmin ;
    position: relative;
    
  }

  .card{
    position: relative;
    width: 25vmin;
    height: 40vmin;
    margin: 5vmin;
    border: 1px solid grey;
    box-shadow:1px -2px 2px 1px grey;
    border-radius: 5px 5px 0px 5px;
    display: flex;
    justify-content: top ;
    align-items: center;
    flex-direction: column;
    background-color: rgb(35, 65, 120);
    color: bisque;
    font-size: 2.5vmin;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 500;
  }

  .card p{
    margin: 1.5vmin;
  }

  .card:hover{
    background-color:rgb(17, 97, 98);
    cursor: pointer;
    transform: translateY(15px);
    transition: 0.5s;
    z-index: 1;
  }

  .card:hover > .price{
    background-color:rgb(17, 97, 98);
    transition: 0.5s;
    z-index: -1;
  }

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

  .price{
    color: white;
    width: 12.5vmin;
    background-color: rgb(35, 65, 120);
    border-radius: 0px 0px 5px 5px;
    position: absolute;
    top: 100%;
    left: 50%;
    text-align: center;
    align-items: center;
    padding-top: 1vmin;
    padding-bottom: 1vmin;
    font-size: 12px;
    z-index: -1;
    box-shadow: 1px -2px 2px 1.8px grey;
  }

  .price-red:before{
      position: absolute;
      content:"";
      left: 2vmin;
      top: 50%;
      right: 2vmin;
      color: red;
      border-top: 2px solid;
      border-color: inherit;
      transform:rotate(-5deg);
      
    }

  .newPrice{
    color: white;
    background-color: red;
    width: 12.5vmin;
    border-radius: 0px 0px 5px 5px;
    position: absolute;
    top: 99.5%;
    left: 0%;
    text-align: center;
    align-items: center;
    padding-top: 1vmin;
    padding-bottom: 1vmin;
    font-size: 12px;
    box-shadow: 1px -2px 2px 1px grey;
    z-index: -1;
  }

  .discount{
    position: absolute;
    left: -10%;
    color: white;
    background-color: red;
    width: auto;
    height: auto;
    text-anchor: middle;
    transform: rotate(312deg);
    padding:2.5%;
  }

  .soldout{
    position: absolute;
    top: 0;
    bottom:0;
    left: 0;
    right: 0;
    padding: auto;
    height: fit-content;
    width: fit-content;
    height: auto;
    width: auto;

    color:rgb(138, 2, 2);
    z-index: 2;
    text-align: center;

  }

  .soldout p{
    z-index: 3;
    font-weight: bolder;
    font-size: 4.5vmin;
    font-family: Arial, Helvetica, sans-serif;
    top: 0;
    bottom: 0;
    margin-block: 16vh;
    vertical-align: center;
  }

  .filterlist{
    position: fixed;
    width: 17%;
  }

  .filterlist p{
    color: rgb(35, 65, 120);
    font-size: 2vmin;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 900;
    margin: 2vmin;
    text-decoration-line: underline;
    box-sizing: content-box;
  }

  .filterlist li{
    list-style-type: none;
    color: rgb(35, 65, 120);
    font-size: 2vmin;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-style: italic;
    margin-top :3vmin;
    cursor:pointer;
  };

  .list-item{
    overflow: auto;
    float: left;
  }

  .list-item p{
    text-decoration-line: none;
    cursor: pointer;
    color: rgb(35, 65, 120);
    font-size: 2vmin;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-style: italic;
    margin :3vmin 1vmin 3vmin 3vmin;
  }

  .list-item p:hover{
    transform: translateX(10px);
    transition:ease 0.5s;
  }

  .active{
    border: 1px solid rgb(35, 65, 120);
    border-radius: 3vmin;
    padding: 0.5vmin 2vmin 0.5vmin 2vmin;
    width: fit-content;
  }

  .item{
    color: rgb(35, 65, 120);
    font-size: 2vmin;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-style: italic;
    margin :3vmin 1vmin 3vmin 3vmin;
  }

  input{
    margin-left: 1vmin;
    cursor:pointer; 
  }

  div.list{
    max-height: 25vmin;
    height: auto;
    width: 25vmin;
    overflow: auto;
    scroll-behavior: smooth;
    scrollbar-color: black;
    scrollbar-width: 0.5vmin;
    scrollbar-base-color: white;
  }

  #last{
    display: flex;
    flex-direction: row;
    max-width: 65vw;
    position: relative;
    padding-top: 2vh;
  }

  #last-added-area{
    display: flex;
    flex-direction:row;
    height:35vh;
    flex-wrap:nowrap;
    align-items: center;
    justify-content:flex-start;
    background-color: rgb(35, 65, 120);
    padding: 0.5vw;
    padding-top: 4.5vh;
    margin-bottom: 0.5vh;
    margin-top: 1vh;
    border-radius: 1vw;
    overflow:hidden;
    position: relative;
  }

  .left-arrow, .right-arrow{
    height: fit-content;
    width: 3vw;
    margin: 1vw;
    display: block;    
  }

  .left-arrow > img, .right-arrow > img{
    position:absolute;
    top: 0;
    bottom: 0;
    display: block;
    align-content: center;
    height: 5vh;
    margin-block: auto;
    cursor:pointer
  }
  
  .last-added{
    max-height: 35vh;
    width: auto;
    position: relative;
    margin-right: 0.5vw;
  }

  .last-added-img{
    max-height: 35vh;
    width: auto;
    border-radius: 1vw;
    user-select: none;
  }

  .last-added-price{
    left: 1vw;
    bottom: -10px;
    position: absolute;
    z-index: 1;
    color: red;
    font-size: 1vw;
    font-weight: bold;
  }

  #header{
    position:absolute;
    top: -2%;
    left:2%;
    font-size: 2vmin;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-style: italic;
    color: bisque;
    text-align: left;
    justify-content: left;
    align-items: flex-start;
  }
</style>
