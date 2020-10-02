import React from 'react'
import "./popup.scss"

const Popup = (props) => {

    const save = ()=>{
        props.save();
        props.close()
    }

    return props.show ? (
        <div  className='popup'>
            <div className={"popup__content " +(props.show === true ?"popup__content__active":"" ) }>

                <div style={{display:"flex",flexDirection:"column"}}>
                    <label style={{marginBottom:"1rem"}} htmlFor="newChat">Name</label>
                    <input type="text" name="name" onChange={e => props.change(e)} value={props.name}/>
                </div>

                <div style={{display:"flex",flexDirection:"column"}}>
                    <label style={{marginBottom:"1rem"}} htmlFor="newChat">Contact No</label>
                    <input type="text" name="contactNo" onChange={e => props.change(e)} value={props.contactNo}/>
                </div>

              
                <div className="btns">
                    <button onClick={save} className="btn btn__green">Save</button>
                    <button className="btn btn__yellow" onClick={() => props.close()}>Cancel</button>
                </div>
                
            </div>
            
        </div>
    ):null
}

export default Popup
