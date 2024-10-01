import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";

const TripHistoryModal = (props) => {
  const { onClose,historyData } = props;

  const handleModalClose = () => {
    console.log("modal closed");
    onClose();
  };

  const [editedByData, setEditedByData] = useState(historyData);;

  useEffect(()=>{
    setEditedByData(historyData);
  },[historyData])

  return (
    <div
      style={{
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
        padding: "30px 40px",
        // height: "400px"
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Trip History</h3>
      <div
        style={{
          // backgroundColor: "pink",
          height: "400px",
          overflow: "scroll",
          marginBottom: "10px",
        }}
      >
        {editedByData.map((entry, index) => (
          <div
            key={index}
            style={{
              border: "solid",
              borderWidth: "1px",
              borderColor: "#f6ce47",
              borderRadius: "10px",
              padding: "10px 20px",
              fontFamily: "DM Sans",
              fontSize: "14px",
              margin: "0 15px 15px 0",
            }}
          >
            <div style={{ display: "flex" }}>
              <p style={{ marginRight: "10px", fontWeight: "bold" }}>
                Edited By: {entry.changedBy}
              </p>
              <p style={{ marginRight: "10px" }}>{entry.editedBy}</p>
              <p>({entry.changeAt})</p>
            </div>
            <ul
              style={{
                paddingLeft: "20px",
                marginTop: "10px",
              }}
            >
              <li key={index}>{entry.changedDataName}</li>
              <li>Previous value : {entry.changedDataPreviousValue}</li>
              <li>Current value: {entry.changedDataPreviousValue}</li>
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          // backgroundColor: "pink",
        }}
      >
        <button
          type="button"
          style={{
            backgroundColor: "#f6ce47",
            color: "black",
            border: "none",
            borderRadius: "6px",
            fontSize: "15px",
            padding: "13px 40px",
            cursor: "pointer",
          }}
          onClick={handleModalClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TripHistoryModal;
