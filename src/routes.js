import Home from "./components/Home"
import ProductDetail from "./components/ProductDetail"
import Admin from "./components/Admin"
import Cart from "./components/Cart"

export const routes = [
    {path:"", component:Home},
    {path:"/detail", component:ProductDetail},
    {path:"/admin", component:Admin},
    {path:"/cart", component:Cart},
]