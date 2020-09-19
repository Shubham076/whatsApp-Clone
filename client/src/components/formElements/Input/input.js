import React from 'react'
import ErrorBox from "../textError/textError"
import { Field, ErrorMessage } from 'formik'
import classes from "./input.module.scss"

const Input = ( props ) => {

    const { label, name, touched, type, ...rest } = props
    return (
        <div className = {classes.input}>
            <Field id = {name} {...rest} className={classes.input__field} type={type} name= {name} />
				<label className={classes.input__label +' ' +
				(touched ? classes.move : null)}
		        htmlFor = {name}>
                    {label}
				</label>
                <ErrorMessage component = {ErrorBox} name = {name}/>
                           
        </div>
    )
}

export default Input