import React, { Component } from "react";
import "./sidebarChat.scss";
import Popup from "../../popup/Popup";
import { connect } from "react-redux";
import { select_room, mark_read_in_selected,
  mark_read_in_room } from "../../../store/actions/index";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import axios from "../../../server"

class SidebarChat extends Component {
  state = {
    seed: null,
    show: false,
    flag: true,
    typing: false,
    showCount:true
  };

  componentDidMount() {
    let value = Math.floor(Math.random() * 5000);
    this.setState({ seed: value });

    setTimeout(() => {
      this.props.io.on("typing", (data) => {
        if (this.props._id === data.roomId) {
          this.setState({ typing: data.typing });
        }
      });
    }, 200);
  }

  createChat = () => {
    this.setState({ show: true });
  };

  hidePopup = () => {
    this.setState({ show: false });
  };

  handleChange = (e) => {
    this.props.setNewChat(e.target.name, e.target.value);
  };

  selectHandler = () => {
    const room = {
      id: this.props._id,
      users: this.props.users,
      messages: this.props.messages,
      createdBy: this.props.createdBy,
    };

    let unreadMessages = [];
    localStorage.removeItem('unreadMessage');
    this.props.selectRoom(room);
    for(let message of this.props.messages){
      if(message.read === false && message.sender != localStorage.getItem('contactNo')){
        unreadMessages.push(message._id);
      }
    }

    // case when both room is not selected or in a diiferent room
    if(unreadMessages.length > 0){
      
      let room  = this.props;
      axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
      axios.put("/markRead",{messages:unreadMessages})
      .then(res => {
        this.props.io.emit("markRead", {
          messages: unreadMessages,
          receiver:
            room.createdBy === localStorage.getItem("contactNo")
              ? room.users[1].contactNo
              : room.users[0].contactNo,
              roomId:room._id
        });

        this.props.markReadInSelectedRoom(unreadMessages)
        this.props.markReadInRoom(unreadMessages , this.props._id)
      })
      .catch(err=>{

      })


    }

  };

  render() {
    dayjs.extend(localizedFormat);

    // for last seen
    let count = 0;
    let lastMessage;
    let lastTime;
    if (this.props.messages) {

      // unread message count
      for (let message of this.props.messages) {
        if (message.read === false && localStorage.getItem('contactNo') !== message.sender) {
          count++;
        }
      }
      localStorage.setItem('count',count);

      // last message;
      if(this.props.messages.length >=1){ 
      lastMessage = this.props.messages[this.props.messages.length - 1].body;
      lastTime = dayjs(
        this.props.messages[this.props.messages.length - 1].createdAt
      ).format("LT");
      }
    }

    return (
      <>
        <Popup
          show={this.state.show}
          save={this.props.handleSubmit}
          name={this.props.name}
          contactNo={this.props.contactNo}
          close={this.hidePopup}
          change={this.handleChange}
        />

        {!this.props.addnewChat ? (
          this.props.createdBy === localStorage.getItem("contactNo") ||
          this.props.noOfMessages > 0 || this.props.users[1].roomName ? (
            <div onClick={this.selectHandler} className="sidebar__chat">
              <img
                className="sidebar__chat__img"
                src={`https://avatars.dicebear.com/api/human/${this.state.seed}.svg`}
              />

              <div className="sidebar__chat__info">
                <h3>{this.props.name}</h3>
                {this.state.typing === true ? (
                  <div style={{ color: "#06d755", fontWeight: "bold" }}>
                    typing...
                    {count > 0 ? (
                      <div>
                        <span className="unread_message_time">{lastTime}</span>
                        <span className="unread_message_count">{count}</span>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div style={{fontFamily:"'Nunito' ,'Apple Color Emoji'"}}>
                    <p style={{fontSize:"1.25rem"}}>{lastMessage ? lastMessage : ""}</p>
                    {count > 0? (
                      <div>
                        <span className="unread_message_time">{lastTime}</span>
                        <span className="unread_message_count">{count}</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ) : null
        ) : (
          <div  style={{height:"7rem"}} onClick={this.createChat} className="sidebar__chat">
            <h2 className="addNew">Add new chat</h2>
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    io: state.socket.io,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectRoom: (room) => dispatch(select_room(room)),
    markReadInSelectedRoom: (m) => dispatch(mark_read_in_selected(m)),
    markReadInRoom : (m , id) => dispatch(mark_read_in_room(m,id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarChat);
