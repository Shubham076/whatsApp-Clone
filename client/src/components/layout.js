import React , {Fragment} from 'react'
import Navbar from "./navbar/navbar"

const Layout = (props) => {
    return (
        <Fragment>
            {/* <Navbar />  */}
            {props.children}

        </Fragment>
        
            
    )
}

export default Layout