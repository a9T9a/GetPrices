<template>
    <div class="container">
        <div class="details">
            <form class="form" @submit.prevent>
                <p id="id" v-if="this.id!=null">id: {{this.id}}</p>
                <p id="tukendi" v-if="this.tukendi">KALDIRILDI</p>
                <div class="form-group">
                    <label>Category</label>
                    <select v-model="$v.product.category.$model" @change="onCatChange">
                        <option value="" selected disabled> Select Category</option>
                        <option v-for="(cat,index) of categories" :key="index" :value="cat.title">{{cat.title}}</option>
                    </select>
                    <button @click="add_New(1)">+</button>
                    <input v-model="addNew.addCategory" type="text" style="left:26vw; width:9vw; font-size:0.85vw" placeholder="Add New Category">
                </div>
                <div class="form-group">
                    <label>SubCategory</label>
                    <select v-model="$v.product.subCategory.$model">
                        <option value="" selected disabled> Select SubCategory</option>
                        <option v-for="(sub,index) of subCategories" :key="index" :value="sub">{{sub}}</option>
                    </select>
                    <button @click="add_New(2)">+</button>
                    <input v-model="addNew.addSubCategory" type="text" style="left:26vw; width:9vw; font-size:0.85vw" placeholder="Add New SubCategory">
                </div>
                <div class="form-group">
                    <label>Link</label>
                    <input type="text" v-model="product.link" @blur="$v.product.link.$touch()">
                </div>
                <div class="form-group">
                    <label>Color</label>
                    <select v-model="$v.product.color.$model">
                        <option value="" selected disabled> Select Color</option>
                        <option v-for="(color,index) of colors" :key="index" :value="color">{{color}}</option>
                    </select>
                    <button @click="add_New(3)">+</button>
                    <input v-model="addNew.addColor" type="text" style="left:26vw; width:9vw; font-size:0.85vw" placeholder="Add New Color">
                </div>
                <div class="form-group">
                    <label>Brand</label>
                    <select v-model="$v.product.brand.$model">
                        <option value="" selected disabled> Select Brand</option>
                        <option v-for="(brand,index) of brands" :key="index" :value="brand.id">{{brand.id}}</option>
                    </select>
                    <button @click="add_New(4)">+</button>
                    <input v-model="addNew.addBrand" type="text" style="left:26vw; width:9vw; font-size:0.85vw" placeholder="Add New Brand">
                    <input v-model="addNew.addFirstEl" type="text" style="left:36vw; width:9vw; font-size:0.85vw" placeholder="Add First Element">
                    <input v-model="addNew.addSecondEl" type="text" style="left:46vw; width:9vw; font-size:0.85vw" placeholder="Add Second Element">
                    <button @click="test" style="left:57vw; width:6vw; font-size:0.85vw">Test Et</button>
                </div>
                <div class="form-group">
                    <label>Price</label>
                    <input type="number" step="0.01" v-model="product.price" @blur="$v.product.price.$touch()">
                </div>
                <div class="form-group">
                    <label>Images</label>
                    <input multiple type="file" accept="image/*" ref="files" @change="onImagesChange" @input="$v.image.$touch()">
                </div>
                <div class="show-images">
                    <img v-for="(image,index) of images" :key="index" :src="image" alt="">
                </div>
                <button class="form-button" @click="onSave($event)" :disabled="$v.$invalid">Kaydet</button>
                <button class="form-button" @click="onUpdate" :disabled="$v.$invalid">Güncelle</button>
                <button class="form-button" @click="onDelete" :disabled="id==null">Sil</button>
                <p class="save" v-if="saving">{{this.txt}}</p>
                
            </form>
        </div>
        <div class="product-list">
            <ul id="list">
                <li v-for="(product,index) of getProducts" :key="index" class="list-item">
                    <div class="list-item-text" @click="chooseProduct(product.id)" :style="product.tukendi?{opacity:0.3}:null">
                        {{index+1}} - {{product.category}}<br>   {{product.subCategory}}<br>    {{product.color}}
                    </div>
                    <img :src="product.imageUrl[0]" alt="a">
                </li>
            </ul>
        </div>
    </div>
</template>



<script>
const axios = require("axios")
const cheerio = require("cheerio")
import {mapGetters} from "vuex"
import { db } from "../data/firebase"
import firebase from "firebase"
import { required} from "vuelidate/lib/validators"

export default {
    data(){
        return{
            product:{
                category:"",
                subCategory:"",
                color:"",
                brand:"",
                link:"",
                price:null,
                //images:[],
            },
            addNew:{
                addCategory:null,
                addSubCategory:null,
                addColor:null,
                addBrand:null,
                addFirstEl:null,
                addSecondEl:null
            },
            id:null,
            link:"",
            products:[],
            //categories:[...allCategories],
            categories:[],
            subCategories:[],
            //colors:[...colors],
            colors:[],
            //brands:[...brands],
            brands:[],
            images:[],
            image:[],
            tukendi:false,
            saving:false,
            txt:"Kaydediliyor",
            savetimer:undefined
        }
    },

    computed:{
        ...mapGetters(["getProducts"]),
        
    },

    validations:{
        product:{
            category:{
                required
            },
            subCategory:{
                required
            },
            color:{
                required
            },
            link:{
                required
            },
            brand:{
                required
            },
            price:{
                required
            },
        },
        image:{
            required
        }
        
    },

    mounted(){
        this.getFilters()
    },

    methods:{
        save_text:function(){
            this.savetimer=setInterval(()=>{
                this.txt+="."
            },500)
        },
        test(){
            if(this.product.link!=""){
                axios.get(this.product.link).then(res=>{
                    const $ = cheerio.load(res.data)
                    let price = $(this.addNew.addFirstEl).find(this.addNew.addSecondEl).text()
                    let n_price=""
                    for(let i=0;i<price.length;i++){
                        if(Number.isInteger(parseInt(price[i]))==true || price[i]=="." || price[i]==","){
                            if(price[i]==","){
                                n_price+="."
                            }else{
                                n_price+=price[i]
                            }
                        }
                    }
                    alert(n_price)
                })
            }else{
                alert("link verin")
            }
        },
        async chooseProduct(id){
            let products=this.getProducts
            let product=products.find(f=>{
                return f.id==id
            })
            this.id=product.id
            this.product.category=product.category
            await this.onCatChange()
            this.product.color=product.color
            this.product.brand=product.brand
            this.product.link=product.link
            this.product.price=product.price
            this.product.subCategory=product.subCategory
            
            this.images=product.imageUrl

            if(product.tukendi){
                this.tukendi=true
            }else{
                this.tukendi=false
            }
            
        },
        getFilters(){
            db.collection("filters").get().then(snap=>{
                snap.forEach(s=>{
                    let data=s.data()
                    if(s.id=="categories"){
                        Object.keys(data).forEach(key=>{
                            let obj = new Object({
                                "title":key,
                                "sub":data[key]
                            })
                            this.categories.push(obj)
                        })
                    }else if(s.id=="colors"){
                        let data=s.data()
                        this.colors=data["color"]
                    }
                })
            })
            db.collection("brands").get().then(snap=>{
                snap.forEach(s=>{
                    let obj =new Object({
                        id:s.id,
                        ...s.data()
                    })
                    this.brands.push(obj)
                })
            })
            
        },
        add_New(value){
            switch (value){
                case 1:
                    if(this.addNew.addCategory!=null){
                        let key =this.addNew.addCategory
                        db.collection("filters").doc("categories").update({[key]:[]})
                        .then(()=>{
                            let obj=new Object({
                                title:key,
                                sub:[]
                            })
                            this.categories.push(obj)
                            alert("Eklendi")
                        }).catch(()=>{
                            alert("Bir hata oldu")
                        })
                    }else{
                        alert("Boş alan var")
                    }
                    break;
                case 2:
                    if(this.addNew.addSubCategory!=null & this.product.category!=null){
                        let key =this.product.category
                        let value=this.addNew.addSubCategory
                        db.collection("filters").doc("categories").update({
                            [key]: firebase.firestore.FieldValue.arrayUnion(value)
                            })
                        .then(()=>{
                            this.subCategories.push(value)
                            alert("Eklendi")
                        }).catch(()=>{
                            alert("Bir hata oldu")
                        })
                    }else{
                        alert("Boş alan var")
                    }
                    break;
                case 3:
                    if(this.addNew.addColor!=null){
                        let value =this.addNew.addColor
                        db.collection("filters").doc("colors").update({
                            "color":firebase.firestore.FieldValue.arrayUnion(value)
                        }).then(()=>{
                            this.colors.push(value)
                            alert("Eklendi")
                        }).catch(()=>{
                            alert("Bir hata oldu")
                        })
                    }else{
                        alert("Boş alan var")
                    }
                    break;
                case 4:
                    if(this.addNew.addBrand!=null & this.addNew.addFirstEl!=null & this.addNew.addSecondEl!=null){
                        db.collection("brands").doc(this.addNew.addBrand).set({
                            item:[this.addNew.addFirstEl,this.addNew.addSecondEl]
                        }).then(()=>{
                            let obj =new Object({
                                id:this.addNew.addBrand,
                                item:[this.addNew.addFirstEl,this.addNew.addSecondEl]
                            })
                            this.brands.push(obj)
                            alert("Eklendi")
                        }).catch((error)=>{
                            alert(error)
                        })
                    }else{
                        alert("Boş alan var")
                    }
                    break;
            }
        },
        onCatChange(){
            this.subCategories=this.categories.filter(e=>{
                return e.title==this.product.category
            })[0].sub
        },
        onImagesChange(event){
            this.images = [];
            let fileList = Array.prototype.slice.call(event.target.files);
            this.image=fileList
            fileList.forEach(f => {
                if(!f.type.match("image.*")) {
                return;
                }

                let reader = new FileReader();
                let that = this;

                reader.onload = function (e) {
                    that.images.push(e.target.result);
                }
                reader.readAsDataURL(f);
            });
        },
        async onSave(event){
            let conf = confirm("Ürünü kaydetmek istediğinize emin misiniz?")
            if(conf){
                event.target.disabled=true
                this.saving=true
                this.save_text()
                var key
                let obje=[]           

                await db.collection("products").add({
                    ...this.product,
                    addDate: firebase.firestore.Timestamp.now().seconds
                })
                .then(result=>{
                    key = result.id
                    return key
                })
                .then(async key=>{
                    
                    for(let i=0;i<this.image.length;i++){
                        let filename = this.image[i].name
                        let ext = filename.slice(filename.lastIndexOf("."))

                        await firebase.storage().ref("images/"+key+"-"+i+ext).put(this.image[i])
                        .then(data=>{
                            return data.ref.getDownloadURL()
                        }).then(url=>{
                            console.log(url)
                            obje.push(url)
                        })
                    }
                })

                await db.collection("products").doc(key).update({imageUrl:obje})
                .then(()=>{
                    alert("Başarılı")
                    event.target.disabled=true
                    this.saving=false
                    clearInterval(this.savetimer)
                })
                .catch(err=>{
                    console.log(err)
                })
            }
            
        },
        onUpdate(){
            //let conf=confirm("Ürünü güncellemek istediğinize emin misiniz?")
            /*if(conf){
                db.collection("products").doc(this.id).update({
                    brand:this.product.brand,
                    category:this.product.category,
                    subCategory:this.product.subCategory,
                    color:this.product.color,
                    link:this.product.link,
                    price:this.product.price,
                    imageUrl:this.images
                    
                })
            }*/
            
        },
        onDelete(){
            let conf=confirm("Ürünü Silmek İstediğinize Emin Misiniz?")
            if(conf){
                for(let i=0; i<this.images.length;i++){
                    console.log(this.id)
                    firebase.storage().ref("images/"+this.id+"-"+i+".jpg").delete()
                    .then(()=>{
                        alert("silindi")
                    })
                    .catch(()=>{
                        alert("Bir sorun oluştu")
                    })
                }
                
                db.collection("products").doc(this.id).delete()
                .then(()=>{
                    alert("Ürün Silindi")
                }).catch(()=>{
                    alert("Bir sorun oluştu")
                })
            }

        }
    }
}
</script>

<style scoped>
    #id{
        position: absolute;
        top: 0vw;
        left: 60vw;
        font-size: 0.7vw;
    }

    #tukendi{
        position: absolute;
        top: 5vh;
        left: 60vw;
        color: rgb(137, 0, 0);
        font-size: 1.5vw;
    }

    .container{
        display: flex;
        flex-direction: row;
        margin: 2vmin;
        
    }

    .details{
        width: 80%;
        height: auto;
        margin: 2vmin;
        
    }

    .product-list{
        width: 20%;
        height: auto;
        margin: 2vmin;
        border: 1px solid black;
    }

    .form{
        padding: 2vmin;
        border: 1px solid black;
        background-color: rgb(154, 201, 201);
        position: relative;
    }

    .form-group{
        position: relative;
        width: 100vmin;
        height: auto;
        margin: 2.5vmin;
        align-items: center;
    }

    .form-group label{
        color: rgb(35, 65, 120);
        font-size: 1.3vw;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 400;
    }

    .form-group input{
        position: absolute;
        left: 11vw;
        height: 1.5vw;
        width: 12vw;
        border:none;
        border-radius: 1vmin ;
        padding-left: 1vmin;
        box-shadow: 0vmin 0vmin 1vmin -0.01vmin gray ;
        font-size:0.85vw
    }

    .form-group select{
        position: absolute;
        left: 11vw;
        height: 1.7vw;
        width: 10vw;
        border:none;
        border-radius: 1vmin ;
        padding-left: 1vmin;
        font-family: Arial, Helvetica, sans-serif;
        font-size:0.85vw;
        font-weight: 400;
        box-shadow: 0vmin 0vmin 1vmin -0.01vmin gray ;
    }

    .form-group button{
        position: absolute;
        left:24vw;
        background: white;
        border-radius: 1vmin;
        font-size:1.2vw ;
        border: none;
        box-shadow: 0vmin 0vmin 1vmin -0.01vmin gray ;
        height: 1.7vw;
        width: 1.7vw;
        cursor: pointer;
    }

    .form-group input:focus{
        outline: none;
    }

    .form-group select:focus{
        outline: none;
    }

    .form-button{
        border-radius: 1vmin;
        box-shadow: 0vmin 0vmin 3vmin 0.1vmin gray ;
        margin: 2vmin;
        padding: 1vmin 2vmin;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 600;
        color: rgb(35, 65, 120);
        background-color: bisque;
        cursor:pointer;
    }

    #list{
        color: black;
        list-style: none;
        height: fit-content;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 400;
        color: rgb(35, 65, 120);
        max-height: 70vh;
        overflow: scroll;
        overflow: auto;
    }

    #list img{
        width: 5vmin;
        height: auto;
    }

    .list-item{
        display: flex;
        flex-direction: row;
        margin: 1vmin;
        cursor: pointer;
    }

    .list-item-text{
        width:40%
    }
    
    .show-image{
        display: flex;
        flex-direction: row;
    }

    .show-images img{
        width: 20vmin;
        height: auto;
        margin: 2.5vmin;
        align-items: center;
    }

    .save{
        height: 5vh ;
        width: auto;
        padding-left: 1.3vw;
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        font-weight: 400;
        color: rgb(35, 65, 120);
    }

</style>