const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (user) =>{
    let token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.SECRET,
      {
        expiresIn: "1h",
      }
    );

    return token;
}

const generateRefreshToken = id => {
  let refreshToken = jwt.sign({
    id:id.toString()
  },
  process.env.REFRESH_SECRET)

  return refreshToken;
}

exports.signUp = async (req, res, next) => {
  let email = req.body.email;
  let contactNo = req.body.phoneNo;
  let password = req.body.password;
  let username = req.body.username;

  try {
    let user = await User.findOne({ email: email });
    if (user) {
      let err = new Error("Email already exist");
      err.status = 400;
      throw err;
      
    }

    user = await User.findOne({ contactNo:  contactNo });
    if (user) {
      let err = new Error("PhoneNo already exist");
      err.status = 400;
      throw err;
      
    }
  
    let hashPass = await bcrypt.hash(password, 12);
    let newUser = new User({
      email: email,
      password: hashPass,
      contactNo:contactNo,
      username:username
    });

    let newuser = await newUser.save();
    let token = generateToken(newuser);
    let refreshToken = generateRefreshToken(newuser._id);

    res.status(201).json({
      message: "new user created",
      token: token,
      refreshToken : refreshToken,
      username:newuser.username,
      contactNo:newuser.contactNo
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  try {
    let foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      let err = new Error("No account found with this email");
      email.status = 404;
      throw err;
    }

    let isEqual = await bcrypt.compare(password, foundUser.password);

    if (!isEqual) {
      let err = new Error("Invalid email or password");
      err.status = 401;
      throw err;
    }

    const token = generateToken(foundUser);
    let refreshToken = generateRefreshToken(foundUser._id);

    res.status(200).json({
      message: "Successfully Logged in",
      token: token,
      refreshToken:refreshToken,
      username:foundUser.username,
      contactNo:foundUser.contactNo
    });
  } catch (err) {
    next(err);
  }
};


exports.refreshToken = async (req, res, next)=>{
  let refreshToken = req.body.token;
  if(!refreshToken){
    let err = new Error("No token found")
    err.status = 404;
    next(err);
  }

  else{
    try{
      let user = await jwt.verify(refreshToken , process.env.REFRESH_SECRET);
      let foundUser = await User.findById(user.id);
      let token = generateToken(foundUser);
      return res.status(201).json({
        token:token
      })
    }

    catch(err){
      next(err);
    }
   
  }


}
