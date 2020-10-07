import axios from "axios";
const instance = axios.create({
  baseURL: "https://chatapp-node-server.herokuapp.com",
});

const responseInterceptor = (instance) => {
  const resInterceptor = instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (!err.response) {
        alert("Not connected to internet");
      } else {
        alert(err.response.data.message);
      }
      return Promise.reject(err);
    }
  );
};

const requestInterceptor = (instance) => {
  const reqInterceptor = instance.interceptors.request.use(
    (req) => {
      console.log("Url",req.url);
      console.log("Method",req.method);
      console.log("Body",req.data)
      return req;
    },
    (err) => err
  );
};

requestInterceptor(instance);
responseInterceptor(instance);

export default instance;
