import React, { useEffect, useState } from "react";
import TripsTable from "./tripsTable";
import { TextField } from "@mui/material";
import TripService from "@/services/trip.service";
import LoaderComponent from "../loader";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";

const SearchModuleTrips = ({ tripIdClicked }) => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [tripId, setTripId] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    let hasError = false;
    if (!tripId) {
      setError((prevError) => ({
        ...prevError,
        tripId: "Trip ID cannot be empty.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, tripId: "" })); // Clear error if valid
    }

    if (hasError) {
      console.log("Trip ID is mandatory");
    } else {
      try {
        setLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        const response = await TripService.getTripByTripId(tripId);
        console.log("Trip response data>>>", response.data);
        const data = [response.data];
        setList(data);
        if (response.status === 500) {
          dispatch(
            toggleToast({
              message: `Failed! Please try again later.`,
              type: "error",
            })
          );
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
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
          {error.tripId && (
            <div
              style={{
                color: "#d32f2f",
                margin: "0 0 5px 8px",
                fontSize: "12px",
              }}
            >
              {error.tripId}
            </div>
          )}
          {/* <InputLabel id="trip-id-label">Trip Id</InputLabel> */}
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Trip Id"
            fullWidth
            style={{ backgroundColor: "#ffffff" }}
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            error={!!error.tripId}
            // helperText={error.tripId}
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
        <TripsTable list={list} tripIdClicked={handleTripClick} isLoading={loading}/>
      </div>
      {/* {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            // backgroundColor: "#000000",
            zIndex: 1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 1,
            color: "#000000",
            // height: "100vh",
            // width: "100vw",
          }}
        >
          <LoaderComponent />
        </div>
      ) : (
        " "
      )} */}
    </div>
  );
};

export default SearchModuleTrips;
