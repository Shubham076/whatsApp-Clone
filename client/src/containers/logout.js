import React , {useEffect} from 'react'
import {connect} from "react-redux"
import * as actions from "../store/actions/index"
import {Redirect} from "react-router-dom" 

const Logout = (props) => {

    useEffect(()=>{
        props.logout();
    },[])

    return (
        <div>

            <Redirect to="/" />
            
        </div>
    )
}

const mapDispatchToProps = dispatch =>{
    return{
        logout : () => dispatch(actions.auth_logout())
    }
}

export default connect(null , mapDispatchToProps)(Logout)