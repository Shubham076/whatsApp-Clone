import React from 'react'

const Send = (props) => {
    return (
        <svg onClick={props.click} className="icon icon__send" viewBox="0 0 24 24">
            <path d="M2.016 21v-6.984l15-2.016-15-2.016v-6.984l21 9z"></path>
        </svg>
    )
}

export default Send
