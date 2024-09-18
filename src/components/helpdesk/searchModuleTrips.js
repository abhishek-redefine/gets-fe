import React, { useEffect, useState } from "react";
import TripsTable from "./tripsTable";
import { TextField } from "@mui/material";
import TripService from "@/services/trip.service";

const SearchModuleTrips = ({ tripIdClicked }) => {
  const [list, setList] = useState([]);
  const [tripId, setTripId] = useState(null);

  const fetchSummary = async () => {
    try {
      const response = await TripService.getTripByTripId(tripId);
      console.log("Trip response data>>>", response.data);
      const data = [response.data];
      setList(data);
    } catch (err) {
      console.log(err);
    }
  };

  const resetFilter = () => {
    setTripId("");
  };

  const handleTripClick = (tripId) => {
    // console.log("Search module trip Trip Id>>>>", tripId);
    tripIdClicked(tripId);
  };

  return (
    <div>
      <div
        className="filterContainer"
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "10px",
          margin: "30px 0",
          padding: "0 13px",
        }}
      >
        <div className="form-control-input">
          {/* <InputLabel id="trip-id-label">Trip Id</InputLabel> */}
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Trip Id"
            fullWidth
            style={{ backgroundColor: "#ffffff" }}
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
          />
        </div>
        <div className="form-control-input" style={{ minWidth: "70px" }}>
          <button
            type="submit"
            onClick={() => fetchSummary()}
            className="btn btn-primary filterApplyBtn"
          >
            Apply
          </button>
        </div>
        <div className="form-control-input" style={{ minWidth: "70px" }}>
          <button
            type="submit"
            onClick={resetFilter}
            className="btn btn-primary filterApplyBtn"
          >
            Reset
          </button>
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "6px",
          padding: "15px 0 20px",
          // backgroundColor: "green",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            margin: "10px 20px 3px",
            padding: "20px 20px",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <h3>Booking Summary</h3>
        </div>
        <TripsTable list={list} tripIdClicked={handleTripClick} />
      </div>
    </div>
  );
};

export default SearchModuleTrips;
