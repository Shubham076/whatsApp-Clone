import React , {useEffect} from 'react'
import {connect} from "react-redux"
import * as actions from "../store/actions/index"
import {Redirect} from "react-router-dom"
import {remove_selected_room} from "../store/actions/index"

const Logout = (props) => {

    useEffect(()=>{
        props.logout();
        props.removeRoom()
        props.removeIo();
    },[])

    return (
        <div>

            <Redirect to="/" />
            
        </div>
    )
}

const mapDispatchToProps = dispatch =>{
    return{
        logout : () => dispatch(actions.auth_logout()),
        removeIo:()=>dispatch(actions.remove_io()),
        removeRoom:()=>dispatch(remove_selected_room())
    }
}

export default connect(null , mapDispatchToProps)(Logout)