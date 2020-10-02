import React, { Component } from "react";
import Search from "../../svgs/search";
import Attach from "../../svgs/Attach";
import More from "../../svgs/More";
import Emoji from "../../svgs/Emoji";
import Mic from "../../svgs/Mic";
import "./chat.scss";
import { connect } from "react-redux";
import Phone from "../../images/phone.jpg";
import {
  add_message,
  update_count,
  add_message_to_room,
} from "../../store/actions/index";
import { createObjectId } from "mongodb-objectid";
import axios from "../../server";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat"

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.chatRef = React.createRef();
  }

  state = {
    seed: null,
    message: "",
    messages: [],
    typing:false,
    uniqueDates:[]
  };

  componentDidMount() {
    let value = Math.floor(Math.random() * 5000);
    this.setState({ seed: value });
    this.scrollToBottom();

    setTimeout(() => {
      this.props.io.on("newMessage", (data) => {
        if (
          this.props.currentRoom &&
          this.props.currentRoom.id === data.message.roomId
        ) {
          this.props.addMessage(data.message);
        }

        this.props.addMessageToRoom(data.message);
        this.props.updateCount(data.message.roomId);
      });

      this.props.io.on('typing',data => {
        if(this.props.currentRoom && this.props.currentRoom.id === data.roomId){
            this.setState({typing:data.typing})
        }
      })
    }, 200);
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (this.chatRef.current) {
      this.chatRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  };

  getUniqueDates = async () => {
    let uniqueDates = []
    if(this.props.roomSelected === true){
      for(let message of this.props.currentRoom.messages){
        if(await !uniqueDates.includes(message.date)){
          uniqueDates.push({
            date:message.date,
            createdAt:message.createdAt
          })

          console.log(uniqueDates.includes('2 October 2020'))
        }

      }
      return uniqueDates
    }
}

  

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  };

  sendMessage = async (e) => {
    e.preventDefault();
    let room = this.props.currentRoom;

    let newMessage = {
      _id: await createObjectId(),
      body: this.state.message,
      sender: localStorage.getItem("contactNo"),
      receiver:
        room.createdBy === localStorage.getItem("contactNo")
          ? room.users[1].contactNo
          : room.users[0].contactNo,
      roomId: this.props.currentRoom.id,
      createdAt: new Date().toISOString(),
      read: false,
    };

    newMessage.date = dayjs(newMessage.createdAt).format('D MMMM YYYY')
      

    this.props.addMessage(newMessage);
    this.props.addMessageToRoom(newMessage);
    this.setState({ message: "" });

    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "token"
    );
    axios
      .post("/addMessage", { message: newMessage })
      .then(() => {
        this.props.io.emit("sendMessage", { message: newMessage });
      })
      .catch((err) => {});
  };

  sendTypingIndication = (e) => {
    let room = this.props.currentRoom;

    if(e.key === 'Enter'){
      this.props.io.emit('stopTyping',{
        typing: {
          receiver: room.createdBy === localStorage.getItem("contactNo")
            ? room.users[1].contactNo
            : room.users[0].contactNo,
          roomId:room.id
        },
      })
    }

    else if(this.state.message.length <= 1){
      this.props.io.emit('stopTyping',{
        typing: {
          receiver: room.createdBy === localStorage.getItem("contactNo")
            ? room.users[1].contactNo
            : room.users[0].contactNo,
            roomId:room.id
        },
      })
    }
    else{
    setTimeout(() => {
      this.props.io.emit("startTyping", {
        typing: {
          receiver: room.createdBy === localStorage.getItem("contactNo")
            ? room.users[1].contactNo
            : room.users[0].contactNo,
            roomId:room.id
        },
      });
    }, 200)}
  };

  render() {
    // dayjs.extend(relativeTime);
    dayjs.extend(localizedFormat)
    let dates = this.getUniqueDates();

    return (
      <React.Fragment>
        {this.props.roomSelected === true ? (
          <div className="chat">
            <div className="chat__header">
              <img
                className="chat__header__img"
                src={`https://avatars.dicebear.com/api/human/${this.state.seed}.svg`}
              />

              <div className="chat__header__info">
                <h3>
                  {localStorage.getItem("contactNo") ===
                  this.props.currentRoom.createdBy
                    ? this.props.currentRoom.users[0].roomName
                    : this.props.currentRoom.users[1].roomName
                    ? this.props.currentRoom.users[1].roomName
                    : this.props.currentRoom.users[0].contactNo}
                </h3>
                <p style={{color:"#777" , fontWeight:"bold"}}>{this.state.typing === true ? "Typing...":"Last seen..."}</p>
              </div>

              <div className="chat__header__right">
                <Search />
                <Attach />
                <More />
              </div>
            </div>

            <div className="chat__body">
              {this.props.currentRoom.messages.map((m, i) => (
                <p
                  key={m._id}
                  className={`message__body ${
                    localStorage.getItem("contactNo") === m.sender
                      ? "message__sender"
                      : "message__receiver"
                  }`}
                >
                  {m.body}
                  <span className="message__timestamp">
                    {dayjs(m.createdAt).format('LT')}
                  </span>
                  {/* <span className="message__name">
                    {localStorage.getItem("contactNo") === m.sender
                      ? localStorage.getItem("username")
                      : this.props.currentRoom.createdBy === m.receiver
                      ? this.props.currentRoom.users[0].roomName
                      : this.props.currentRoom.users[1].roomName
                      ? this.props.currentRoom.users[1].roomName
                      : m.sender}
                  </span> */}
                </p>
              ))}

              <div ref={this.chatRef}></div>
            </div>

            <div className="chat__footer">
              <Emoji />
              <form onSubmit={this.sendMessage} className="chat__footer__input">
                <input
                  autoFocus
                  onChange={this.handleChange}
                  onKeyDown={this.sendTypingIndication}
                  value={this.state.message}
                  placeholder="Send a message"
                  type="text"
                />
                <button className="chat__footer__btn"></button>
              </form>
              <Mic />
            </div>
          </div>
        ) : (
          <div className="splashScreen">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img className="splashScreen__image" src={Phone} />
              <h4 className="splashScreen__text">
                Quickly send and receive messages right from your computer
              </h4>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    roomSelected: state.chatRooms.selected,
    currentRoom: state.chatRooms.selectedRoom,
    io: state.socket.io,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addMessage: (m) => dispatch(add_message(m)), //adding message to selected room only
    updateCount: (id) => dispatch(update_count(id)),
    addMessageToRoom: (m) => dispatch(add_message_to_room(m)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
