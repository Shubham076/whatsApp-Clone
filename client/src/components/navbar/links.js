import React from 'react'
import classes from "./navbar.module.scss"
import {NavLink} from "react-router-dom"
import {connect} from "react-redux"


const Links = (props) => {
    const {type , value} = props;
   switch(type){

    case "protected":
        return  props.authenticated ? <NavLink {...props}>{value}</NavLink> : null

    case "not-protected":
        return <NavLink {...props}>{value}</NavLink>

    case "low-protected":
        return !props.authenticated ? <NavLink {...props}>{value}</NavLink>:null


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
