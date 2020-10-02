import * as actionTypes from "../actions/actionTypes"

const intitalState = {
    io:null
}

const io = (state = intitalState , action) =>{
    switch(action.type){
        case actionTypes.SET_SOCKET:
            return{
                ...state,
                io:action.io
            }

        case actionTypes.REMOVE_SOCKET:
            return{
                ...state,
                io:null
            }

        default:return state;
    }
}

export default io;

