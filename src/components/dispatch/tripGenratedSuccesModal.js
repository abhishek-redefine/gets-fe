import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  text: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: "3px 0 35px",
    textAlign: "center",
    fontFamily: "DM Sans, sans-serif",
    margin:'20px 0 15%'
  },
};

export default function ConfirmationModal({ pass, onClose}) {

  return (
    <div style={{height:'600px'}}>
      {pass ? (
        <>
          <div
            style={{
              display: "flex",
              flexFlow: "column",
              alignItems: 'center',
              padding: "50px",
            }}
          >
            <img
              src="/images/confirmationCheck.jpg"
              width={230}
              height={230}
              alt="Confirmation"
              style={{margin: '20px 0 0'}}
            /> 
            <Typography id="modal-modal-title" sx={style.text}>
              Successfully trip generated!
            </Typography>
              <Button
                style={{
                  color: "black",
                  width:'160px',
                  backgroundColor: '#f6ce47',
                  borderRadius: "6px",
                  padding: "6px 10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textTransform: "unset",
                }}
                onClick={onClose}
                
              >
                Close
              </Button>
          </div>
        </>
      ) : (
        <>
        <div
            style={{
              display: "flex",
              flexFlow: "column",
              alignItems: 'center',
              padding: "50px",
              height: '100%'
            }}
          >
            <img
              src="/images/confirmationCross.jpg"
              width={140}
              height={140}
              alt="Confirmation"
              style={{margin: '70px 0 0'}}
            /> 
            <Typography style={{marginTop:'60px'}} id="modal-modal-title" sx={style.text}>
              Trip generation failed!
            </Typography>
              <Button
                style={{
                  color: "black",
                  width:'160px',
                  backgroundColor: '#f6ce47',
                  borderRadius: "6px",
                  padding: "6px 10px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textTransform: "unset",
                }}
                onClick={onClose}
              >
                Close
              </Button>
          </div>
        </>
      )}
    </div>
  );
}
