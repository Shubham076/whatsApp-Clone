import React , {useEffect} from 'react';
import Login from "./containers/login/login"
import SignUp from "./containers/signUp/signUp"
import Layout from "./components/layout"
import Home from "./containers/Home/Home"
import {Switch , Redirect} from "react-router-dom"
import * as actions from "./store/actions/index"
import {connect} from "react-redux"
import Route from "./route"
import Logout from "./containers/logout"

function App(props) {

  useEffect(()=>{
    props.auth_check()
  } ,[])

  let routes = <Switch>
    <Route path="/signUp" component={SignUp} type="not-protected" />
    <Route path="/logout" component={Logout} type="protected" />
    <Route path="/home" component={Home} type="protected" />
    <Route path="/" component={Login} type="not-protected" />
    <Redirect to="/" />
</Switch>



  return (
      <div className="App">
        <Layout>
          {routes}
        </Layout>
      </div>
    
  );
}

const mapDispatchToProps = dispatch => {
  return{
    auth_check : ()=>dispatch(actions.auth_check())
  }
}

export default connect(null , mapDispatchToProps) (App);