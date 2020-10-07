import React, { Component } from 'react'
import "./sidebar.scss"
import Avatar from "../../svgs/Avatar"
import Donut from "../../svgs/Donut"
import Chat from "../../svgs/Chat"
import More from "../../svgs/More"
import Search from "../../svgs/search"
import SidebarChat from './SidebarChat/sidebarChat'
import {createObjectId} from "mongodb-objectid"
import {connect} from "react-redux"
import {get_rooms , add_room , update_room} from "../../store/actions/index";
import RoomSpinner from '../RoomSpinner/RoomSpinner'
import Options from "./options/Options"
import axios from "../../server";

class Sidebar extends Component {

    componentDidMount(){
        this.props.getRooms(localStorage.getItem('contactNo'));
        setTimeout(()=>{
            this.props.io.on('newRoom' , data => {
                let room = data.room;
                room.noOfMessages = 0
                this.props.addRoom(room);
            })

        },200)
}
    
    state={
        name:"",
        contactNo:"",
        showOptions:false,
        error:null
    }

    handleChange = (name , value)=>{
        this.setState({[name]: value});
    }

    viewOptions = ()=>{
        this.setState({showOptions:true});
    }

    hideOptions = () => {
        this.setState({showOptions:false})
    }


    handleSubmit = async ()=>{
      let _id = await createObjectId();
      
      let newRoom = {
          createdBy:localStorage.getItem('contactNo'),
          _id:_id,
          users:[
              {
                  contactNo:localStorage.getItem('contactNo'),
                  roomName:this.state.name
                },
                {
                    contactNo:this.state.contactNo
                }
            ],
            messages:[],
            noOfMessages:0
        }

        // case one user created the room previosuly
        let r = {...this.props.Rooms.find(r => r.users[1].contactNo === this.state.contactNo)};
        if(Object.keys(r).length > 0){
            alert("You already have a contact with this contact no")
            this.setState({ name:"" , contactNo:""})
            return;
        }

        // case when other user created the room not you
        let room = {...this.props.Rooms.find(r => r.users[0].contactNo === this.state.contactNo)};
        if(Object.keys(room).length > 0){
            if(room.users[1].roomName){
                alert("You already have a contact with this contact no")
                this.setState({ name:"" , contactNo:""})
                return;
            }
            room.users[1].roomName = this.state.name;
            this.props.updateRoom(room);
            this.setState({ name:"" , contactNo:""})
            axios.put("/updateRoom",{room:room})
            .then(()=>{

            })
            .catch(err=>{

            })
            
        }
        else{
            this.props.addRoom(newRoom);
            this.setState({ name:"" , contactNo:""})
    
            axios.post("/addRoom",{room:newRoom})
            .then((res)=>{
    
            })
            .catch(err => {
    
            })
        }
    }

    render() {
        
        return (
            <div className="sidebar">

                <div className="sidebar__header">
                    <Avatar/>
                    <div className="username">
                        {localStorage.getItem('username')}
                    </div>
                    <div className="sidebar__header-right">
                        <Donut/>
                        <Chat/>
                        <More click ={this.viewOptions}/>
                        <Options show={this.state.showOptions} close={this.hideOptions}/>
                    </div>
                    
                </div>

                <div className="sidebar__search">
                    <div className="sidebar__search__container">
                        <Search/>
                        <input type="text" placeholder="Search or start new chat"/>
                    </div>

                </div>

                <div className="sidebar__chats">
                    <SidebarChat handleSubmit={this.handleSubmit} addnewChat setNewChat={this.handleChange} name={this.state.name} contactNo = {this.state.contactNo}/>
                    {
                        this.props.Rooms && this.props.Rooms.length > 0 ? this.props.Rooms.map((chat) => {
                         return   <SidebarChat {...chat} key={chat._id} name={localStorage.getItem('contactNo') === chat.createdBy ? chat.users[0].roomName : chat.users[1].roomName ? chat.users[1].roomName : chat.users[0].contactNo}/>
                        }):

                            this.props.Rooms && this.props.Rooms.length == 0 ? (
                                <h3 className="not_found">No Messages Found</h3>
                            

                            ):(
                                <RoomSpinner/>
                            )
                    }
                   

                </div>
                
            </div>
        )
    }
}

const mapStateToProps = state =>{
    return{
        Rooms:state.chatRooms.rooms,
        io:state.socket.io,
    }
}

const mapDispatchToProps = dispatch => {
    return{
        getRooms : (no) =>dispatch(get_rooms(no)),
        addRoom : (room) => dispatch(add_room(room)),
        updateRoom : (room) => dispatch(update_room(room)) 
    }
}

export default connect(mapStateToProps , mapDispatchToProps)(Sidebar);
