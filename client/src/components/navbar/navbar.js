import React from 'react'
import classes from "./navbar.module.scss"
import Link from "./links"
import {connect} from "react-redux"

const navbar = (props) => {
    return (
        <div className = {classes.navbar}>
            <div className={classes.navbar__links}>

                
            <Link  type="low-protected"  to="/" value="Login"/>
            <Link  type="low-protected" to="/signUp" value="Sign Up" />
            <Link  type = "protected" to="/logout" value="Logout"/>
            <Link  type = "protected"  to="/home" value="Home" />


                { props.authenticated ? <a href="#"  className={classes.navbar__link}>{props.username}</a>:null}
                


            </div>
            
        </div>
    )
}

const mapStateToProps = state=>{
    return{
        authenticated:state.auth.token ? true :false || localStorage.getItem('username'),
        username : state.auth.username,
    }
}

export default connect(mapStateToProps , null)(navbar)