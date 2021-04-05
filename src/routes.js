import Home from "./components/Home"
import ProductDetail from "./components/ProductDetail"
import Admin from "./components/Admin"

export const routes = [
    {path:"", component:Home},
    {path:"/detail", component:ProductDetail},
    {path:"/admin", component:Admin},
]