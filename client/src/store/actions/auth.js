import * as actionTypes from "./actionTypes";
import axios from "../../server";
import jwtDecode from "jwt-decode";

export const auth_start = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const auth_check_timeout = (time) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(refreshToken())
    }, time);
  };
};

const refresh = (newToken , refreshToken , username , contactNo) => {
  return{
    type:actionTypes.REFRESH_TOKEN,
    newToken: newToken,
    refreshToken : refreshToken,
    username: username,
    contactNo: contactNo

  }
}

const refreshToken = ()=> {
return dispatch => {
  let refreshToken = localStorage.getItem("refreshToken");
  axios.post("/refreshToken" , {token : refreshToken})
  .then(res => {
    let username = localStorage.getItem("username");
    let contactNo = localStorage.getItem("contactNo");
    let newToken = res.data.token;

    let decodedToken = jwtDecode(newToken);
    let expirationTime = decodedToken.exp * 1000;
    let expirationDate = new Date(expirationTime - 300000);

    localStorage.setItem("token" , newToken);
    localStorage.setItem("expirationDate", expirationDate);
    axios.defaults.headers.common['Authorization'] = newToken;

    dispatch(refresh(newToken , refreshToken , username , contactNo));
    dispatch(auth_check_timeout(expirationTime - new Date().getTime() - 300000));

  })
}
 

}

export const auth_logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("username");
  localStorage.removeItem("contactNo");

  delete axios.defaults.headers.common["Authorization"];

  return {
    type: actionTypes.LOGOUT,
  };
};

export const auth_failure = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    err: error,
  };
};

export const auth_success = (token,refreshToken, username, contactNo) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    refreshToken : refreshToken,
    username: username,
    contactNo: contactNo,
  };
};

export const auth = (email, password, username, contactNo, props) => {
  return (dispatch) => {
    dispatch(auth_start());

    let user;
    let url;

    if (username.trim() === "") {
      user = {
        email: email,
        password: password,
      };

      url = "/login";
    } else {
      user = {
        email: email,
        password: password,
        username: username,
        phoneNo: contactNo,
      };

      url = "/signup";
    }

    axios
      .post(url, user)
      .then((res) => {
        const token = res.data.token;
        let refreshToken = res.data.refreshToken;
        let decodedToken = jwtDecode(token);
        let expirationTime = decodedToken.exp * 1000;
      
        let expirationDate = new Date(expirationTime - 300000);
        let username = res.data.username;
        let contactNo = res.data.contactNo;

        localStorage.setItem("token", token);
        localStorage.setItem("contactNo", contactNo);
        localStorage.setItem("refreshToken" , refreshToken)
        localStorage.setItem("username" , username);
        localStorage.setItem("expirationDate", expirationDate);

        dispatch(auth_success(token, refreshToken, username , contactNo ));
        dispatch(auth_check_timeout(expirationTime - new Date().getTime() - 300000));
        props.history.push("/home");
        axios.defaults.headers.common["Authorization"] = token;
      })

      .catch((err) => {
        if (err.response) {
          dispatch(auth_failure(err.response.data.message));
        }
      });
  };
};

export const auth_check = () => {
  return (dispatch) => {
    let token = localStorage.getItem("token");
    let expirationDate = new Date(localStorage.getItem("expirationDate"));

    if (!token) {
      dispatch(auth_logout());
    } else if (expirationDate > new Date()) {

      axios.defaults.headers.common["Authorization"] = token;
      let username = localStorage.getItem("username");
      let contactNo = localStorage.getItem("contactNo")
      let refreshToken = localStorage.getItem("refreshToken")

      dispatch(auth_success(token, refreshToken,  username, contactNo));
      dispatch(
        auth_check_timeout(expirationDate.getTime() - new Date().getTime())
      );
    } else {
      dispatch(auth_logout());
    }
  };
};

export const clear = () => {
  return {
    type: actionTypes.CLEAR_ERRORS,
  };
};
