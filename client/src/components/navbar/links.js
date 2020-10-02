import React from 'react'
import {NavLink} from "react-router-dom"
import {connect} from "react-redux"
import classes from "./navbar.module.scss"


const Links = (props) => {
    const {type , value ,to} = props;
   switch(type){

    case "protected":
        return  props.authenticated ? <NavLink  activeClassName={classes.active} className={classes.navbar__link} to={to}>{value}</NavLink> : null

    case "not-protected":
        return <NavLink activeClassName={classes.active}   className={classes.navbar__link} to={to}>{value}</NavLink>

    case "low-protected":
        return !props.authenticated ? <NavLink exact={to === "/"} activeClassName={classes.active} className={classes.navbar__link} to={to} >{value}</NavLink>:null


    default: return null;
   }
}

const mapStateToProps = state=>{
    return{
        authenticated:state.auth.token ? true :false || localStorage.getItem('token'),
        username : state.auth.username
    }
}

export default connect(mapStateToProps , null)(Links)
