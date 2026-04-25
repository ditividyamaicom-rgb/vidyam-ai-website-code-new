import React from 'react'
import './bookSession.css'
import { IoCloseSharp } from "react-icons/io5";


const BookSession = (props) => {
  return (props.trigger) ?(
    <div className="popUp">
        <div className="popupInner">
            <div className="closeBtn" onClick={()=> props.setTrigger(false)}><IoCloseSharp />
</div>
            {props.children}
        </div>
        </div>
  ): "";
}

export default BookSession