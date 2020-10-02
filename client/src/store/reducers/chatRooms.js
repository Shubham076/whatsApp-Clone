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

        case actionTypes.ADD_ROOM:
            const newRooms = [...state.rooms];
            newRooms.splice(0,0,action.room);
            return{
                ...state,
                rooms:newRooms
            }

        case actionTypes.SELECT_ROOM:
            return{
                ...state,
                selectedRoom:action.room,
                selected:true
            }

        case actionTypes.ADD_MESSAGE:
            let room = {...state.selectedRoom};
            let messages = [...room.messages];
            messages.push(action.message);
            room.messages = messages;
            return{
                ...state,
                selectedRoom:room
                
            }

        case actionTypes.ADD_MESSAGE_TO_ROOM:
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
            }
            
        case actionTypes.UPDATE_MESSAGE_COUNT:
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