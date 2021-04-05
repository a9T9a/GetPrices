import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
//import {apparel} from "../data/depo"
//import {users} from "../data/users"
//import product from "../store/product"
//import {routes} from "../routes"
import { db } from "../data/firebase"
import  getPrices from "../data/prices"

Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        API:"AIzaSyAOX8Cmu4zfbdviI7n16dGAM5vQMAksXhU",
        token:"",
        logged:false,
        //users:[...users],
        apparel:[],
        products:[],
        catFilter:[],
        sub_categories:[],
        colors:[],
        discounted:[],
        sortingValue:"",
        categories:[]
    },
    getters:{
        getLog(state){
            return state.logged
        },
        getCategory(state){
            return state.catFilter
        },

        getCats(state){
            return state.categories
        },

        getFiltered(state){
            var arr=[]
            if(state.catFilter.length!=0) arr.push(state.catFilter)
            if(state.sub_categories.length!=0) arr.push(state.sub_categories)
            if(state.colors.length!=0) arr.push(state.colors)
            if(state.discounted.length!=0) arr.push(state.discounted)
            
            if(arr.length==0){
                state.products=state.apparel
            }else{
                var list = Array.from(arr).sort((a,b) => b.length-a.length)
                var nlist=list.reduce((acc,item)=>acc.filter(e=>item.includes(e)))
                state.products= state.apparel.filter(e=>nlist.includes(e.id))
            }
            if(state.sortingValue==""){
                return state.products
            }else if(state.sortingValue==="En Yüksek Fiyat"){
                return state.products.sort((a,b)=>b.newPrice-a.newPrice)
            }else if(state.sortingValue==="En Düşük Fiyat"){
                return state.products.sort((a,b)=>a.newPrice-b.newPrice)
            }else if(state.sortingValue==="En Yeni"){
                return state.products.sort((a,b)=>b.addDate-a.addDate)
            }else if(state.sortingValue==="En Eski"){
                return state.products.sort((a,b)=>a.addDate-b.addDate)
            }
            
        },

        get_subCategories(state){
            let list=[]
            var obj=state.apparel.find(e=>e.id==state.catFilter[0])
            if(state.catFilter.length!=0){
                state.apparel.filter(ap=>{
                    return ap.category==obj.category
                }).forEach(e=>{
                    if(list.indexOf(e.subCategory)===-1){
                        list.push(e.subCategory)
                    }
                })
                return list
            }
        },

        getColors(state){
            var list=[]
            state.apparel.forEach(e=>{
                if(list.indexOf(e.color)==-1){
                    list.push(e.color)
                }
            })
            
            return list
        },

        getProducts(state){
            return state.products
        },
        getLasts(state){
            let p = state.products.sort((a,b)=>b.addDate-a.addDate)
            return p.slice(0,6)
        }
    },
    mutations:{
        change_catFilter(state,value){
            if(value==""){
                state.catFilter=[]
            }else{
                state.catFilter=[]
                state.catFilter=state.apparel.filter(e=>value.includes(e.category)).map(e=>e.id)
                state.sub_categories=[]
            }
        },
        change_catFilter1(state,value){
            state.catFilter=value
            state.sub_categories=[]
        },
        change_subCategories(state,value){
            state.sub_categories=state.apparel.filter(e=>value.includes(e.subCategory)).map(e=>e.id)
        },
        changeColors(state,value){
            state.colors=state.apparel.filter(e=>value.includes(e.color)).map(e=>e.id)
        },
        getDiscounted(state,value){
            value ? state.discounted=state.apparel.filter(e=>e.indirim).map(e=>e.id) : state.discounted=[]
            
        },
        getSorted(state,value){
            if(value==state.sortingValue){
                state.sortingValue=""
            }else{
                state.sortingValue=value
            }
        },
        logged(state,value){
            state.logged=value
        },
        setToken(state,token){
            state.token=token
        },
        setProducts(state,products){
            state.apparel=products
        }
    },
    actions:{
        
        initLog({commit,dispatch,state}){
            let token = localStorage.getItem("token")
            if(token){
                let expirationDate = localStorage.getItem("expirationDate")
                let time = new Date().getTime()

                if(time >= +expirationDate){
                    dispatch("logout")
                }else{
                    let timeleft = +expirationDate-time
                    commit("setToken",token)
                    dispatch("setTimeoutTimer",timeleft)
                    state.logged=true
                }
            }else{
                state.logged=false
            }
        },
        login({commit,dispatch,state},user){
            let post_link="https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
            if(user.newUser){
                post_link="https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
            }
            axios.post(post_link+state.API,
                {
                    email:user.email,
                    password:user.password,
                    returnSecureToken:true
                }).then(response=>{
                    commit("logged",true)
                    commit("setToken",response.data.idToken)
                    localStorage.setItem("token",response.data.idToken)
                    localStorage.setItem("expirationDate", (new Date().getTime()+(+response.data.expiresIn*1000)))
                    dispatch("setTimeoutTimer",+response.data.expiresIn*1000)
                })
                .catch(error=>{
                    console.log(error.response.data.error.message)
                })
        },
        logout({commit}){
            commit("logged",false)
            localStorage.removeItem("token")
        },
        setTimeoutTimer({dispatch},expiresIn){
            setTimeout(()=>{
                dispatch("logout")
            },expiresIn)
        },
        async getFirestore({commit,state}){
            let products=[]
            let brands=[]
            await db.collection("products").get()
                .then(snap=>{
                    snap.forEach(d=>{
                        let obj=new Object(
                            {id:d.id,
                            ...d.data()}
                        )
                        products.push(obj)
                    })                
                })

            await db.collection("brands").get()
                .then(brand_s=>{
                    brand_s.forEach(bra=>{
                        let obje=new Object(
                            {
                                id:bra.id,
                                ...bra.data()
                            }
                        )
                        brands.push(obje)
                    })
                })

            await getPrices(products,brands).then((data)=>{
                commit("setProducts",data)
            })

            await db.collection("filters").doc("categories").get()
            .then(snap=>{
                state.categories=Object.keys(snap.data())
            })
        },
    }
})