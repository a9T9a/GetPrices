import {users} from "../data/users"

const state={
    users:[...users]
}

const getters={
    getUsers(state){
        return state.users
    }
}

export default {
    state,
    getters
}