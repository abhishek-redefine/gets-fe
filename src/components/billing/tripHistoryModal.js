import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

const TripHistoryModal = (props) => {
  const { onClose } = props;

  const handleModalClose = () => {
    console.log("modal closed");
    onClose();
  };

  const editedByData = [
    {
      editedBy: "Mohit.Kumar@ganagatourism.com",
      changes: ["Marked No Show to employee name", "Km changed from 40 to 42"],
      dateTime: "12-08-2024 / 09:20",
    },
    {
      editedBy: "Jane.Doe@ganagatourism.com",
      changes: ["Km changed from 30 to 33", "Marked No Show to employee name"],
      dateTime: "11-08-2024 / 14:30",
    },
    {
      editedBy: "John.Smith@ganagatourism.com",
      changes: ["Marked No Show to employee name"],
      dateTime: "10-08-2024 / 10:45",
    },
    {
      editedBy: "Emily.Jones@ganagatourism.com",
      changes: ["Marked No Show to employee name", "Km changed from 50 to 48"],
      dateTime: "09-08-2024 / 16:20",
    },
    {
      editedBy: "Michael.Brown@ganagatourism.com",
      changes: ["Km changed from 29 to 30"],
      dateTime: "08-08-2024 / 11:15",
    },
  ];

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
          height: "350px",
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
                Edited By:
              </p>
              <p style={{ marginRight: "10px" }}>{entry.editedBy}</p>
              <p>({entry.dateTime})</p>
            </div>
            <ul
              style={{
                paddingLeft: "20px",
                marginTop: "10px",
              }}
            >
              {entry.changes.map((change, idx) => (
                <li key={idx}>{change}</li>
              ))}
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
