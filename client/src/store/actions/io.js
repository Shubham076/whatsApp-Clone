import * as actionTypes from "./actionTypes"

export const set_socket = io => {
    return{
        type:actionTypes.SET_SOCKET,
        io:io
    }
}

export const remove_io = io => {
    return{
        type:actionTypes.REMOVE_SOCKET,
    }
}