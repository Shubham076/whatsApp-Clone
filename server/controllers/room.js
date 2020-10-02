const Room = require("../models/room");
const User = require("../models/user");
const Message = require("../models/messages");

exports.addRoom = async (req, res, next) => {
  let room = req.body.room;
  const new_room = new Room(room);

  try {
    //     const checkRoom = await Room.findOne({$and:
    //         [{'users.0.contactNo':{$eq:room.users[0].contactNo}},
    //         {'users.1.contactNo':{$eq:room.users[1].contactNo}}
    // ]});
    const newRoom = await new_room.save();

    const foundUser1 = await User.findOne({
      contactNo: room.users[0].contactNo,
    });
    foundUser1.rooms.push(newRoom._id);
    await foundUser1.save();

    const foundUser2 = await User.findOne({
      contactNo: room.users[1].contactNo,
    });
    foundUser2.rooms.push(newRoom._id);
    await foundUser2.save();

    res.status(200).json({
      message: "Success",
    });
  } catch (err) {
    next(err);
  }
};

exports.getRooms = async (req, res, next) => {
  let contactNo = req.body.contactNo;
  try {
    let user = await await User.findOne({ contactNo: contactNo })
      .populate("rooms")
      .exec();
    const chatRooms = [];

    let getMessages = async (room_messages) => {
      let messages = [];
      for (let message of room_messages) {
        const m = await Message.findById(message);
        messages.push(m);
      }
      return messages;
    };

    for (let room of user.rooms) {
      let chatRoom = { createdBy: room.createdBy, users: room.users , _id:room._id};
      chatRoom.messages = await getMessages(room.messages);
      chatRoom.noOfMessages = chatRoom.messages.length
      chatRooms.push(chatRoom);
    }

    res.status(201).json({ rooms: chatRooms });
  } catch (err) {
    next(err);
  }
};
