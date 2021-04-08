<template>
  <div id="app">
    <button class="filterButton" @click="filterDisplay">Filter</button>
    <!--<div class="filterlist" :style="this.disp?{display:'none'}:{display:'flex'}">-->
    <div class="filterlist" :class="{hide:this.disp}">
      <br>
      <div>
        <label class="item" style="text-transform:capitalize">İndirim</label>
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
    <div class="area">
      <div id="last">
        <div class="left-arrow">
          <img src="../assets/left-arrow.png" alt="" @click="left($event)" @mousedown="dragstart" @mouseup="dragstop">
        </div>
        <div id="last-added-area">
          <p class="header">Son Eklenenler</p>
          <div class="last-added" v-for="(product,index) of getLasts" :key="index">
            <img class="last-added-img" :style="drag?{cursor: 'grabbing'}:null" :src="product.imageUrl[0]" alt="" @mousedown="dragstart" @mousemove="mouse_move($event)" @mouseup="dragstop" @mouseout="dragstop">
            <p class="last-added-price">{{product.newPrice}}</p>
          </div> 
        </div>
        <div class="right-arrow">
          <img src="../assets/right-arrow.png" alt="" @click="right($event)">
        </div>
      </div>
      <div class="container">
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
    <div class="reklam">
      <p>İNDİRİM</p>
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
         drag:false,
         disp:true,
    }
  },
  computed:{
    ...mapGetters(["getFiltered","get_subCategories","getColors","getCategory","getLasts"]),
    

  },
  methods:{
    filterDisplay(){
      this.disp=!this.disp
    },
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
      event.target.parentElement.nextSibling.scrollLeft-=170
    },
    right(event){
      
      event.target.parentElement.previousSibling.scrollLeft+=170
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
    },
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
    justify-content: center;
    align-content: center;
  }

  .filterlist{
    position: fixed;
    left: 0;
    margin: 0;
    width: 13%;
    height: 100vh;
    left: 0;
    display: flex;
    flex-direction: column;
  }
  .area{
    margin-inline: 0;
    left: 0;
    right: 0;
    width: 74%;
    height: 100vh;
    display: block;
    justify-content: center;
    padding-inline:13vw ;   
  }
  .reklam{
    position: fixed;
    right: 0;
    margin: 0;
    padding: 0;
    width: 13%;
    height: 100vh;

  }

  .reklam p{
    width: 1px;
    margin: 25%;
  }
  .container{
    display: flex;
    justify-content: center;
    align-items: top;
    flex-wrap: wrap;
    flex-direction: row;
    margin:0px;
    padding:0px;
    padding-bottom: 5vmax ;
    position: relative;
  }

  .card{
    position: relative;
    height: 18vmax;
    width: 10vmax;
    box-sizing: border-box;
    margin: 3vmax;
    box-shadow:1px -2px 2px 1px grey;
    border-radius: 5px 5px 0px 5px;
    display: flex;
    justify-content: top ;
    align-items: center;
    flex-direction: column;
    background-color: rgb(35, 65, 120);
    color: bisque;
    font-size: 1vmax;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 500;
    padding-inline: 0.2vmax;
    padding-top: 0.2vmax ;
  }

  .card p{
    margin: 0.6vmax;
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

  .price{
    color: white;
    width: 5vmax;
    background-color: rgb(35, 65, 120);
    border-radius: 0px 0px 5px 5px;
    position: absolute;
    top: 100%;
    left: 50%;
    text-align: center;
    align-items: center;
    padding-top: 0.5vmax;
    padding-bottom: 0.5vmax;
    font-size: 0.7vmax;
    z-index: -1;
    box-shadow: 1px -2px 2px 1px grey;
  }

  .price-red:before{
      position: absolute;
      content:"";
      left: 1vmax;
      top: 50%;
      right: 1vmax;
      color: red;
      border-top: 2px solid;
      border-color: inherit;
      transform:rotate(-5deg);
      
    }

  .newPrice{
    color: white;
    background-color: red;
    width: 5vmax;
    border-radius: 0px 0px 5px 5px;
    position: absolute;
    top: 99.5%;
    left: 0%;
    text-align: center;
    align-items: center;
    padding-top: 0.5vmax;
    padding-bottom: 0.5vmax;
    font-size: 0.7vmax;
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
    font-size: 3.5vmax;
    font-family: Arial, Helvetica, sans-serif;
    top: 0;
    bottom: 0;
    margin-block: 16vh;
    vertical-align: center;
  }

  .filterlist p{
    color: rgb(35, 65, 120);
    font-size: 1vmax;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 900;
    margin: 0.5vmax;
    text-decoration-line: underline;
    box-sizing: content-box;
  }

  .hide{
    display: none;
  }

  .filterButton{
    position: fixed;
    top:0;
    left: 0;
    z-index: 3;
    font-size: 1.5vmax;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    color: rgb(35, 65, 120);
    display: none;
  }

  .list-item{
    overflow: hidden;
    float: left;
  }

  .list-item p{
    text-decoration-line: none;
    cursor: pointer;
    color: rgb(35, 65, 120);
    font-size: 1vmax;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-style: italic;
    margin :1vmin 1vmin 1vmin 2vmin;
  }

  .list-item p:hover{
    transform: translateX(0.8vmax);
    transition:ease 0.5s;
    overflow: auto;
  }

  .active{
    border: 1px solid rgb(35, 65, 120);
    border-radius: 3vmin;
    padding: 0.5vmin 2vmin 0.5vmin 2vmin;
    width: fit-content;
  }
  

  .list{
    position: relative;
    max-height: 9vmax;
    height: auto;
    width: 90%;
    overflow: auto;
    scroll-behavior: smooth;
    scrollbar-color: black;
    scrollbar-width: 0.1vmax;
    scrollbar-base-color: white;
  }

  .item{
    color: rgb(35, 65, 120);
    font-size: 1vmax;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 700;
    font-style: italic;
    margin :1vmin 1vmin 1vmin 2vmin;
  }
  
  input{
    position: absolute;
    left: 9vmax;
    cursor:pointer; 
    height: 0.8vmax;
    width: 0.8vmax;
  }

  #last{
      position: relative;
      margin:3vh;
      height: 18vmax;
      width: 55vmax;
      display: flex;
      justify-content: center;
      align-content: center;
      margin-inline: auto;
  }

    .left-arrow{
        position:absolute;
        height: auto;
        width: 5%;
        left: 0;
        top: 0;
        bottom: 0;
        display: flex;
    }
    .right-arrow{
        position:absolute;
        height: auto;
        width: 5%;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
    }

    .left-arrow img, .right-arrow img{
        height: auto;
        width: 100%;
        display: block;
        top: 0;
        bottom: 0;
        margin-block: auto;
        cursor: pointer;
    }

    #last-added-area{
        box-sizing: border-box;
        background-color: rgb(35, 65, 120);
        width: 90%;
        height: 100%;
        border-radius: 0.8vmax;
        padding-inline: 1.2%;
        padding-bottom: 1%;
        padding-top: 4.5%;
        display:flex;
        justify-content: start;
        overflow: hidden;
    }

    #last-added-area .header{
        position:absolute;
        top:3%;
        left: 7%;
        font-size: 0.8vmax;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 700;
        font-style: italic;
        color: bisque;
        text-align: left;
        justify-content: left;
        align-items: flex-start;
        margin: 0;
    }

    #last-added-area .last-added{
        position: relative;
        background-color: bisque;
        max-height: 100%;
        max-width: 20%;
        min-width: 20%;
        border-radius: 0.8vmax;
        margin-right: 1.4%;
        display:flex;

    }

    #last-added-area .last-added img{
        height: 100%;
        width: 100%;
        object-fit:cover;
        object-position: center;
        border-radius: 0.8vmax;
    }

    #last-added-area .last-added .last-added-price{
        background-color: bisque;
        border-radius: 0.5vmax;
        padding-inline:1.5%;
        position: absolute;
        bottom:0;
        left:5%;
        z-index: 1;
        color: red;
        font-size: 0.8vmax;
        font-weight: bold;
        font-family: Arial, Helvetica, sans-serif;
    }

    @media screen and (min-width:700px) {
        .filterlist{
            display: flex;
        }
    }

    @media screen and (max-width:700px) {

      ::-webkit-scrollbar-thumb {
          background:bisque
      }
      ::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 .5vmax grey; 
      }

        #app{
            display: flex;
            flex-direction:column;
            justify-content: center;
        }

        .area{
            width: 100%;
            margin: 0;
            padding:0;
        }
        
        #last{
            margin-top: 3vh;
            margin-bottom: 8vh;
            height: 20vmax;
            width:60vmax;
        }

        #last-added-area .header{
            font-size: 1.2vmax;
        }

        .filterlist{
            position: fixed;
            padding-top: 5vh;
            top:0;
            left:0;
            width:20vw;
            z-index: 2;
            background-color: rgb(35, 65, 120);
            opacity: 0.9;
        }

        .filterlist p{color: bisque;}
        .item{color: bisque;}

        .reklam {
            position: absolute;
            top: 34vh;
            width: 100%;
            height: fit-content;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
        }
        .reklam p{
            width: fit-content;
            height: fit-content;
            margin: 0;
            padding: 0;
        }

        .filterButton{
          display:block
        }
    }

    @media screen and (max-width:375px){
      #last{
        width: 50vmax;
        height: 16vmax;
      }

      .reklam{
        top: 29%;
      }

      
    }
</style>
