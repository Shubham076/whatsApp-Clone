import React , {useState} from 'react'
import "./options.css"
import { Link} from "react-router-dom"
const Options = (props) => {

    const [options, _]  = useState(["New group" , "Profile" , "Archived" , "Starred"])
    return (
        <div className={`options ${props.show === true ? "options__active" : null}`}>
            <ul className="options__list" >

                {
                    options.map((o , i) => (
                        <li onClick={props.close} key={i}>{o}</li>
                    ) )
                }
                <Link style={{textDecoration:"none"}} to="/logout" onClick={props.close}><li>Logout</li></Link>

            </ul>
        </div>
    )
}

export default Options
