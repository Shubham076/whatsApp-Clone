import React, { Component } from "react";
import "./sidebarChat.scss";
import Popup from "../../popup/Popup";
import { connect } from "react-redux";
import { select_room } from "../../../store/actions/index";

class SidebarChat extends Component {
  state = {
    seed: null,
    show: false,
    flag: true,
    typing: false,
  };

  componentDidMount() {
    let value = Math.floor(Math.random() * 5000);
    this.setState({ seed: value });

    setTimeout(() => {
      this.props.io.on("typing", (data) => {
        if(this.props._id === data.roomId){
          this.setState({typing:data.typing})
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

    this.props.selectRoom(room);
  };

  render() {
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
          this.props.noOfMessages > 0 ? (
            <div onClick={this.selectHandler} className="sidebar__chat">
              <img
                className="sidebar__chat__img"
                src={`https://avatars.dicebear.com/api/human/${this.state.seed}.svg`}
              />

              <div className="sidebar__chat__info">
                <h2>{this.props.name}</h2>
                {this.state.typing === true ? (
                  <p style={{ color: "#06d755", fontWeight: "bold"}}>
                    typing...<div><span className="unread_message_count">2</span></div>
                  </p>
                ) : (
                  <p>
                    12 minutes ago<span className="unread_message_count">2</span>
                  </p>
                )}
              </div>
            </div>
          ) : null
        ) : (
          <div onClick={this.createChat} className="sidebar__chat">
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SidebarChat);
