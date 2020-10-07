import React , {useEffect} from 'react'
import "./home.scss"
import Sidebar from "../../components/Sidebar/Sidebar"
import Chat from "../../components/Chat/Chat"
import {set_socket} from "../../store/actions/index"
import {connect} from "react-redux"
import openSocket from "socket.io-client"

const Home = (props) => {

    useEffect(() => {
      let socket = openSocket('https://chatapp-node-server.herokuapp.com' , {query:{id : localStorage.getItem('contactNo')}})
      props.setSocket(socket)

    }, [])
    return (
        <div className="home">
            <div className="home__body">
                <Sidebar/>
                <Chat/>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return{}
}

const mapDispatchToProps = dispatch =>{
    return {
        setSocket : (io)=>dispatch(set_socket(io))
    }
}

export default connect(mapStateToProps,mapDispatchToProps )(Home);
