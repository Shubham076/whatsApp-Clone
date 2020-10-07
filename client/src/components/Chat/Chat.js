import React, { Component } from "react";
import Search from "../../svgs/search";
import Attach from "../../svgs/Attach";
import More from "../../svgs/More";
import Emoji from "../../svgs/Emoji";
import Mic from "../../svgs/Mic";
import Send from "../../svgs/Send"
import "./chat.scss";
import { connect } from "react-redux";
import Phone from "../../images/phone.jpg";
import {
  add_message,
  update_count,
  add_message_to_room,
  mark_read_in_selected,
  mark_read_in_room,
  update_room
} from "../../store/actions/index";
import { createObjectId } from "mongodb-objectid";
import axios from "../../server";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import Cross from "../../svgs/Cross";
import Tick from "../../svgs/Tick";
import UIfx from "uifx"
import sentSound from "../../sounds/send.mp3"
import receiveSound from "../../sounds/recieves.mp3"
import notification from "../../sounds/notification.mp3"
import AddToContacts from "./addToContacts/add"

export class Chat extends Component {
  constructor(props) {
    super(props);
    this.chatRef = React.createRef();
    this.sendSound = new UIfx(sentSound,{volume:1});
    this.receivesound = new UIfx(receiveSound,{volume:1})
    this.notificationSound = new UIfx(notification,{volume:1})
  }

  state = {
    seed: null,
    message: "",
    messages: [],
    typing: false,
    showPicker: false,
  };

   componentDidMount() {
    let value = Math.floor(Math.random() * 5000);
    this.setState({ seed: value });
    this.scrollToBottom();

    setTimeout(() => {
      this.props.io.on("newMessage", async (data) => {
        if (
          this.props.currentRoom &&
          this.props.currentRoom.id === data.message.roomId
        ) {
          data.message.read = true;
          this.props.addMessage(data.message);
          this.receivesound.play();
          this.markMessageRead(data.message);
          this.props.addMessageToRoom(data.message);
        }

        else{
          console.log("what ")
          this.props.addMessageToRoom(data.message);
          this.notificationSound.play();
          this.props.updateCount(data.message.roomId);
        }

    
      });

      // typing
      this.props.io.on("typing", (data) => {
        if (
          this.props.currentRoom &&
          this.props.currentRoom.id === data.roomId
        ) {
          this.setState({ typing: data.typing });
        }
      });

      // markRead
      this.props.io.on("markRead", (data) => {
        if (
          this.props.currentRoom &&
          this.props.currentRoom.id === data.roomId
        ) {
          this.props.markReadInSelectedRoom(data.messages);
          this.props.markReadInRoom(data.messages, data.roomId);
        }
      });
    }, 200);
  }

  markMessageRead = (m) => {
    let messages = [m._id];
    let room = this.props.currentRoom;
    axios
      .put("/markRead", { messages: messages })
      .then((res) => {
        this.props.io.emit("markRead", {
          messages: messages,
          receiver:
            room.createdBy === localStorage.getItem("contactNo")
              ? room.users[1].contactNo
              : room.users[0].contactNo,
          roomId: room.id,
        });
      })
      .catch((err) => {});
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom = () => {
    if (this.chatRef.current) {
      this.chatRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  };

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  };

  showPickerHandler = () => {
    this.setState({ showPicker: true });
  };

  hidePickerHandler = () => {
    this.setState({ showPicker: false });
  };

  sendMessage = async (e) => {
    e.preventDefault();
    if (this.state.message !== "") {
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

      newMessage.date = dayjs(newMessage.createdAt).format("D MMMM YYYY");
      this.props.addMessage(newMessage);
      this.props.addMessageToRoom(newMessage);
      this.sendSound.play();
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
    }
  };

  sendTypingIndication = (e) => {
    let room = this.props.currentRoom;

    if (e.key === "Enter") {
      this.setState({showPicker:false})
      this.props.io.emit("stopTyping", {
        typing: {
          receiver:
            room.createdBy === localStorage.getItem("contactNo")
              ? room.users[1].contactNo
              : room.users[0].contactNo,
          roomId: room.id,
        },
      });
    } else if (this.state.message.length <= 1) {
      this.props.io.emit("stopTyping", {
        typing: {
          receiver:
            room.createdBy === localStorage.getItem("contactNo")
              ? room.users[1].contactNo
              : room.users[0].contactNo,
          roomId: room.id,
        },
      });
    } else {
      setTimeout(() => {
        this.props.io.emit("startTyping", {
          typing: {
            receiver:
              room.createdBy === localStorage.getItem("contactNo")
                ? room.users[1].contactNo
                : room.users[0].contactNo,
            roomId: room.id,
          },
        });
      }, 200);
    }
  };

  addEmojiToMessage = (emoji) => {
    let message = this.state.message;
    let updatedMessage = `${message}${emoji.native}`;
    this.setState({ message: updatedMessage });
  };

  render() {
    dayjs.extend(relativeTime);
    dayjs.extend(localizedFormat);
    let now = dayjs().format("D MMMM YYYY");

    // for showing timestamps between messages
    let map = new Map();
    let lastSeen;
    if (this.props.roomSelected === true) {
      for (let message of this.props.currentRoom.messages) {
        if (map.has(message.date)) {
          continue;
        } else {
          map.set(message.date, message.createdAt);
        }
      }
      // for last seen
      let Messages = [...this.props.currentRoom.messages];
      for (let message of Messages.reverse()) {
        if (message.sender !== localStorage.getItem("contactNo")) {
          lastSeen = dayjs(message.createdAt).fromNow();
          break;
        }
      }

      // unreadMesssage
      for (let message of this.props.currentRoom.messages) {
        if (message.read === false) {
          localStorage.setItem("unreadMessage", message._id);
          break;
        }
      }
    }

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
                <p style={{ color: "#777", fontWeight: "bold" }}>
                  {this.state.typing === true
                    ? "Typing..."
                    : `Last seen ${lastSeen ? lastSeen : "..."}`}
                </p>
              </div>

              <div className="chat__header__right">
                <Search />
                <Attach />
                <More />
              </div>
            </div>

            <div className="chat__body">
              {this.props.currentRoom.messages.map((m) => (
                <React.Fragment key={m._id}>

                  {/* showing unread message status */}
                  {localStorage.getItem('unreadMessage') && localStorage.getItem("unreadMessage") === m._id &&
                  m.sender !== localStorage.getItem("contactNo") ? (
                    <div className="blockdate">
                      <span>
                        {localStorage.getItem("count") > 1
                          ? `${localStorage.getItem("count")} unread messages`
                          : `${localStorage.getItem(
                              "count"
                            )} unread message`}{" "}
                      </span>
                    </div>
                  ) : null}

                {/* showing timestamps between messages */}
                  {map.has(m.date) && map.get(m.date) === m.createdAt ? (
                    <div className="blockdate">
                      <span>{now === m.date ? "Today" : m.date}</span>
                    </div>
                  ) : null}

                  <p
                    className={`message__body ${
                      localStorage.getItem("contactNo") === m.sender
                        ? "message__sender"
                        : "message__receiver"
                    }`}
                  >
                    <span>{m.body}</span>
                    <span className="message__timestamp">
                      {dayjs(m.createdAt).format("LT")}
                      {localStorage.getItem("contactNo") === m.sender ? (
                        <Tick color={m.read === true ? "30e0b6" : "757575"} />
                      ) : null}
                    </span>
                  </p>
                </React.Fragment>
              ))}
              <AddToContacts/>
              <div ref={this.chatRef}></div>
            </div>

            <div className="chat__footer">
              <Picker
                title="Pick your emoji"
                set="apple"
                emojiSize={35}
                onSelect={this.addEmojiToMessage}
                style={{ display: this.state.showPicker ? "block" : "none" }}
              />

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  padding: "2.5rem",
                }}
              >
                {this.state.showPicker ? (
                  <Cross click={this.hidePickerHandler} />
                ) : (
                  <Emoji click={this.showPickerHandler} />
                )}
                <form
                  onSubmit={this.sendMessage}
                  className="chat__footer__input"
                >
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
                <Send click={this.sendMessage}/>
                <Mic />
              </div>
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
    markReadInSelectedRoom: (m) => dispatch(mark_read_in_selected(m)),
    markReadInRoom: (m, id) => dispatch(mark_read_in_room(m, id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
