import React, { useState } from "react";
import helpdesk from "@/layouts/helpdesk";
import TripDetails from "@/components/helpdesk/tripDetails";
import SearchModuleUsers from "@/components/helpdesk/searchModuleUsers";
import SearchModuleTrips from "@/components/helpdesk/searchModuleTrips";
import SearchModuleVehiclesAndDrivers from "@/components/helpdesk/searchModuleVehicles&Drivers";
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const MainComponent = () => {
  const [selectFormat, setSelectFormat] = useState("users");
  const [selectedTripId, setSelectedTripId] = useState("");
  const [tripDetailFlag, setTripDetailFlag] = useState(false);

  const handleTripInfoScreenClose = () => {
    console.log("Screen closed");
    setTripDetailFlag(false);
  };

  const handleTripClick = (tripId) => {
    // console.log("Search module Trip Id>>>>", tripId);
    setSelectedTripId(tripId);
    setTripDetailFlag(true);
  };

  const handleFormatChange = (e) => {
    setSelectFormat(e.target.value);
  };

  return (
    <div>
      {tripDetailFlag ? (
        <TripDetails
          tripId={selectedTripId}
          onClose={handleTripInfoScreenClose}
        />
      ) : (
        <div>
          <Box
            style={{
              display: "flex",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              margin: "30px 0 10px",
              padding: "20px 30px",
            }}
          >
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={selectFormat}
                onChange={handleFormatChange}
              >
                <FormControlLabel
                  value="users"
                  control={<Radio />}
                  label="Users"
                />
                <FormControlLabel
                  value="trips"
                  control={<Radio />}
                  label="Trips"
                />
                <FormControlLabel
                  value="vehicles&Drives"
                  control={<Radio />}
                  label="Vehicle & Drivers"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {selectFormat === "users" && <SearchModuleUsers />}
          {selectFormat === "trips" && (
            <SearchModuleTrips tripIdClicked={handleTripClick} />
          )}
          {selectFormat === "vehicles&Drives" && (
            <SearchModuleVehiclesAndDrivers tripIdClicked={handleTripClick} />
          )}
        </div>
      )}
    </div>
  );
};

export default helpdesk(MainComponent);
