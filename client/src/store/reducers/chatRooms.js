import * as actionTypes from "../actions/actionTypes"

const intitalState = {
    rooms:null,
    loading:false,
    selectedRoom:null,
    selected:false
}

const chatRoomReducer = (state=intitalState , action) => {
    switch(action.type){

        case actionTypes.GET_ROOMS_START:
            return{
                ...state,
                loading:true
            }
            
        case actionTypes.GET_ROOMS_SUCCESS:
            return{
                ...state,
                loading:false,
                rooms:action.rooms
            }

        case actionTypes.GET_ROOMS_FAILURE:
            return{
                ...state,
                loading:false
            }

        case actionTypes.ADD_ROOM:{
            const newRooms = [...state.rooms];
            newRooms.splice(0,0,action.room);
            return{
                ...state,
                rooms:newRooms
            }}

        case actionTypes.SELECT_ROOM:
            return{
                ...state,
                selectedRoom:action.room,
                selected:true
            }

        case actionTypes.ADD_MESSAGE:{
            let room = {...state.selectedRoom};
            let messages = [...room.messages];
            messages.push(action.message);
            room.messages = messages;
            return{
                ...state,
                selectedRoom:room
                
            }}

        case actionTypes.ADD_MESSAGE_TO_ROOM:{
            let chatRooms = [...state.rooms];
            let index = chatRooms.findIndex(c => c._id === action.message.roomId);
            let chatRoom = {...chatRooms[index]};
            let chat_messages = [...chatRoom.messages]
            chat_messages.push(action.message);
            chatRoom.messages = chat_messages;
            chatRooms[index] = chatRoom
            return{
                ...state,
                rooms:chatRooms
            }}
            
        case actionTypes.UPDATE_MESSAGE_COUNT:{
            let rooms = [...state.rooms];
            let i = rooms.findIndex(r => r._id === action.id)
            let chatroom = {...rooms[i]};
            let no = chatroom.noOfMessages;
            if(no === 0){
                chatroom.noOfMessages = chatroom.noOfMessages + 1;
            }
            rooms[i] = chatroom;
            return{
                ...state,
                rooms:rooms
            }}

        case actionTypes.MARK_READ_IN_SELECTED_ROOM:{
            let selectedRoom = {...state.selectedRoom}
            let messages = [...selectedRoom.messages]
            for(let m of action.messages){
                let index = messages.findIndex(msg => msg._id === m)
                let message = {...messages[index]};
                message.read = true;
                messages[index] = message
            }
            selectedRoom.messages = messages
            return{
                ...state,
                selectedRoom:selectedRoom

            }
        }

        case actionTypes.MARK_READ_IN_ROOM:{
            let rooms = [...state.rooms];
            let index = rooms.findIndex((r) => r._id === action.roomId);
            let room = {...rooms[index]};
            let messages = [...room.messages]
            for(let m of action.messages){
                let i = messages.findIndex(msg => msg._id === m)
                let message = {...messages[i]};
                message.read = true;
                messages[i] = message
            }
            room.messages = messages;
            rooms[index] = room;
            return{
                ...state,
                rooms:rooms
            }
            
        }
            

        case actionTypes.REMOVE_SELECTED_ROOM:
            return{
                ...state,
                rooms:null,
                selectedRoom:null,
                selected:false
            }

        default :return state
        
    }
} 

export default chatRoomReducer