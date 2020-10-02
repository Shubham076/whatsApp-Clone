import * as actionTypes from "./actionTypes";
import axios from "../../server";

const get_rooms_start = () => {
  return {
    type: actionTypes.GET_ROOMS_START,
  };
};

const get_rooms_failure = () => {
  return {
    type: actionTypes.GET_ROOMS_FAILURE,
  };
};

const get_rooms_success = (rooms) => {
  return {
    type: actionTypes.GET_ROOMS_SUCCESS,
    rooms: rooms,
  };
};

export const get_rooms = (no) => {
  return (dispatch) => {
    dispatch(get_rooms_start());
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    axios
      .post("/getRooms", { contactNo: no })
      .then((res) => {
        dispatch(get_rooms_success(res.data.rooms));
      })
      .catch((err) => {
        dispatch(get_rooms_failure());
      });
  };
};

export const add_room = (room) => {
  return {
    type: actionTypes.ADD_ROOM,
    room: room,
  };
};

export const select_room = (selectedRoom) => {
    return{
        type:actionTypes.SELECT_ROOM,
        room:selectedRoom
    }
}


// ADDING MESSAGE TO SELECTED ROOM ONLY
export const add_message = (message) => {
  return {
    type:actionTypes.ADD_MESSAGE,
    message:message
  }
}

export const add_message_to_room = (message)=>{
  return{
      type:actionTypes.ADD_MESSAGE_TO_ROOM,
      message:message
  }
}

export const update_count = (roomId) => {
  return{
    type:actionTypes.UPDATE_MESSAGE_COUNT,
    id:roomId
  }
}