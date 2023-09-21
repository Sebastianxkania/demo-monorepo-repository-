import React from "react";
import popup from './../CSS/popup.module.css';
 
const Popup = props => {
  return (
    <div className={popup.popup_box}>
      <div lassName={popup.box}>
        <span className={popup.close_icon} onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
  );
};
 
export default Popup;
