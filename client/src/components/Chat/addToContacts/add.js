import React , {useState} from 'react'
import "./add.css"
import AddPerson from "../../../svgs/AddPerson"
import Block from "../../../svgs/Block"
import {connect} from "react-redux"
import {update_room} from "../../../store/actions/index"
import axios from "../../../server"
import Popup from "../../popup/Popup"

const Add = (props) => {
    let room = props.currentRoom
    const [state , setState] = useState({name:"",contactNo:room.users[0].contactNo , show:false})
    const handleChange = (e)=>{
        setState({...state,[e.target.name]: e.target.value});
    }

    const hidePopup = ()=>{
        setState({...state,show:false});
    }

    const showPopup = ()=>{
        setState({...state,show:true})
    }

    const handleSubmit = ()=>{
   
        // case when other user created the room not you
          let room = {...props.Rooms.find(r => r.users[0].contactNo === state.contactNo)};
          if(Object.keys(room).length > 0){
            
              room.users[1].roomName = state.name;
              props.updateRoom(room);
              setState({...state, name:"" , contactNo:""})
              axios.put("/updateRoom",{room:room})
              .then(()=>{
  
              })
              .catch(err=>{
  
              })
              
          }
      }
  

    return room.createdBy !== localStorage.getItem('contactNo') && room.users[1].roomName === undefined ? (
        <div className="addToConTacts">
              <Popup
          show={state.show}
          save={handleSubmit}
          name={state.name}
          contactNo={state.contactNo}
          close={hidePopup}
          change={handleChange}
        />
            <p className="contacts__header">Sender is not in your contact list</p>
            <div onClick = {showPopup} className="item">
                <AddPerson/>
                <p className="item__text">Add to contacts</p>
            </div>
            <div  className="item">
                <Block/>
                <p className="item__text">Block</p>
            </div>
            
        </div>
    ):null
}

const mapStateToProps = state => {
    return{
        currentRoom: state.chatRooms.selectedRoom,
        Rooms:state.chatRooms.rooms
    }
}

const mapDispatchToProps = dispatch => {
    return{
        updateRoom : (room) => dispatch(update_room(room)) 

    }
}

export default connect(mapStateToProps , mapDispatchToProps)(Add)
