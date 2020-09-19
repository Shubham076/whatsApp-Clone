import React from 'react'
import {Route , Redirect} from "react-router-dom"
import {connect} from "react-redux"

const Routes = (props) => {
    const {type} = props;
    
    switch(type){

        case "protected":
            return props.authenticated ? <Route {...props} /> : <Redirect to="/" />
            
        case "not-protected":
            return <Route {...props} />
            

        default:return null
    }

       
    
}

const mapStateToProps = state => {
    return{
        authenticated : state.auth.token ? true : false || localStorage.getItem('token')
    }
}

export default connect(mapStateToProps , null)(Routes);
