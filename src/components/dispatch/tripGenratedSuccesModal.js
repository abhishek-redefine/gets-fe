import * as React from "react";
import Typography from "@mui/material/Typography";

const ConfirmationModal = ({ pass, onClose, type, reason }) => {
  const onHandleClose = () => {
    onClose();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 800,
        height: 650,
        borderRadius: 5,
        backgroundColor: "white",
        padding: "10px 0 30px",
      }}
    >
      {pass ? (
        <>
          <div
            style={{
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
              padding: "50px",
            }}
          >
            <img
              src="/images/greenTick.svg"
              width={150}
              height={150}
              alt="Confirmation"
              style={{ margin: "30px 0 0 " }}
            />
            <Typography
              id="modal-modal-title"
              style={{
                fontSize: "25px",
                fontWeight: "bold",
                margin: "70px 0 190px",
                textAlign: "center",
                fontFamily: "DM Sans, sans-serif",
                // backgroundColor: "green"
              }}
            >
              Successfully Trips{" "}
              {type === "replicate" ? "Replicated!" : "Generated!"}
            </Typography>
            <button
              type="button"
              style={{
                color: "black",
                width: "180px",
                backgroundColor: "#f6ce47",
                border: "none",
                borderRadius: "6px",
                padding: "15px 35px",
                fontSize: "16px",
                cursor: "pointer",
                zIndex: 1,
              }}
              onClick={onHandleClose}
            >
              Close
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
              padding: "50px",
              height: "100%",
            }}
          >
            <img
              src="/images/cross.svg"
              width={150}
              height={150}
              alt="Confirmation"
              style={{ margin: "30px 0 0 " }}
            />
            <Typography
              id="modal-modal-title"
              style={{
                fontSize: "25px",
                fontWeight: "bold",
                margin: "70px 0 30px",
                textAlign: "center",
                fontFamily: "DM Sans, sans-serif",
                // backgroundColor: "green"
              }}
            >
              Trip generation failed!
            </Typography>
            <Typography
              style={{ marginTop: "20px" }}
              id="modal-modal-title"
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
                margin: "0 0 80px",
                textAlign: "center",
                fontFamily: "DM Sans, sans-serif",
                // color: "pink"
              }}
            >
              {reason}.
            </Typography>
            <button
              type="button"
              style={{
                color: "black",
                width: "180px",
                backgroundColor: "#f6ce47",
                border: "none",
                borderRadius: "6px",
                padding: "15px 35px",
                fontSize: "16px",
                cursor: "pointer",
              }}
              onClick={onHandleClose}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConfirmationModal;
