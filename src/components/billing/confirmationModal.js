import * as React from "react";
import Typography from "@mui/material/Typography";
import { Box, TextField } from "@mui/material";
import { useState } from "react";

const ConfirmationModal = ({ pass, fail, onClose }) => {
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState(false);

  const handleSubmitClick = () => {
    if (remarks.trim() === "") {
      setRemarksError(true);
    } else {
      console.log("Remarks:", remarks);
      setRemarksError(false);
      onClose();
    }
  };

  const handleModalClose = () => {
    console.log("Remarks:", remarks);
    onClose();
  };

  return (
    <div>
      {pass ? (
        <div
          style={{
            fontFamily: "DM Sans, sans-serif",
            padding: "50px",
          }}
        >
          {fail ? (
            <div
              style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
              }}
            >
              <img
                src="/images/redTick.svg"
                width={150}
                height={150}
                alt="ConfirmationFailed"
                style={{ margin: "" }}
              />
              <Typography
                id="modal-title"
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                  margin: "20px 0 0",
                  textAlign: "center",
                }}
              >
                Oops! Approval Failed
              </Typography>
              <Typography
                id="modal-modal-title"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  margin: "15px 0 10px",
                  textAlign: "center",
                }}
              >
                Something went wrong please try again after some time.
              </Typography>
              <Box
                component="form"
                style={{
                  width: "98%",
                  marginTop: "25px",
                  marginBottom: "40px",
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Write your remarks*"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  inputProps={{
                    style: {
                      fontFamily: "DM Sans",
                      fontSize: 15,
                    },
                  }}
                />
              </Box>
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
                onClick={handleModalClose}
              >
                Submit
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
              }}
            >
              <img
                src="/images/greenTick.svg"
                width={150}
                height={150}
                alt="ConfirmationSuccess"
                style={{ margin: "" }}
              />
              <Typography
                id="modal-title"
                style={{
                  fontSize: "25px",
                  fontWeight: "bold",
                  margin: "20px 0 0",
                  textAlign: "center",
                }}
              >
                Great!
              </Typography>
              <Typography
                id="modal-modal-title"
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  margin: "15px 0 10px",
                  textAlign: "center",
                }}
              >
                Thanks for your approval.
              </Typography>
              <Box
                component="form"
                style={{
                  width: "98%",
                  marginTop: "25px",
                  marginBottom: "40px",
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Write your remarks*"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  error={remarksError}
                  helperText={remarksError ? "Remarks are mandatory." : ""}
                  inputProps={{
                    style: {
                      fontFamily: "DM Sans",
                      fontSize: 15,
                    },
                  }}
                />
              </Box>
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
                onClick={handleSubmitClick}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            alignItems: "center",
            fontFamily: "DM Sans, sans-serif",
            padding: "50px",
          }}
        >
          <img
            src="/images/cross.svg"
            width={150}
            height={150}
            alt="ConfirmationReject"
            style={{ margin: "" }}
          />
          <Typography
            id="modal-title"
            style={{
              fontSize: "25px",
              fontWeight: "bold",
              margin: "20px 0 0",
              textAlign: "center",
            }}
          >
            Are you sure!
          </Typography>
          <Box
            component="form"
            style={{
              width: "98%",
              marginTop: "30px",
              marginBottom: "40px",
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Write your remarks*"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              size="small"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              error={remarksError}
              helperText={remarksError ? "Remarks are mandatory." : ""}
              inputProps={{
                style: {
                  fontFamily: "DM Sans",
                  fontSize: 15,
                },
              }}
            />
          </Box>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "80%",
            }}
          >
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
              onClick={handleSubmitClick}
            >
              Yes
            </button>
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
              onClick={handleModalClose}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmationModal;
