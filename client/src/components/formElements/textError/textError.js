
import React from 'react'
import classes from "./textError.module.scss"

const TextError = (props) => {
    return (
        <div className = {classes.error_box}>
            {props.children}
        </div>
    )
}

export default TextError