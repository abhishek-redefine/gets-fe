import React, { useState } from "react";
import helpdesk from "@/layouts/helpdesk";
import TripDetails from "@/components/helpdesk/tripDetails";
import SearchModuleUsers from "@/components/helpdesk/searchModuleUsers";
import SearchModuleTrips from "@/components/helpdesk/searchModuleTrips";
import SearchModuleVehiclesAndDrivers from "@/components/helpdesk/searchModuleVehicles&Drivers";

const MainComponent = () => {
  const [selectFormat, setSelectFormat] = useState("Users");
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
          <div
            style={{
              display: "flex",
              margin: "40px 0",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              margin: "30px 0 10px",
              padding: "20px 13px",
            }}
          >
            <input
              type="radio"
              id="users"
              name="selectFormat"
              value="Users"
              className="radio-item"
              style={{ margin: "0 10px 0 25px" }}
              checked={selectFormat === "Users"}
              onChange={handleFormatChange}
            />
            <label for="users" style={{ marginRight: "15px" }}>
              Users
            </label>
            <input
              type="radio"
              id="trips"
              name="selectFormat"
              value="Trips"
              className="radio-item"
              style={{ margin: "0 10px 0 25px" }}
              checked={selectFormat === "Trips"}
              onChange={handleFormatChange}
            />
            <label for="trips" style={{ marginRight: "15px" }}>
              Trips
            </label>
            <input
              type="radio"
              id="vehicles&Drives"
              name="selectFormat"
              value="Vehicle & Drivers"
              className="radio-item"
              style={{ margin: "0 10px 0 25px" }}
              checked={selectFormat === "Vehicle & Drivers"}
              onChange={handleFormatChange}
            />
            <label for="vehicles&Drives" style={{ marginRight: "15px" }}>
              Vehicle & Drivers
            </label>
          </div>
          {selectFormat === "Users" && <SearchModuleUsers />}
          {selectFormat === "Trips" && (
            <SearchModuleTrips tripIdClicked={handleTripClick} />
          )}
          {selectFormat === "Vehicle & Drivers" && (
            <SearchModuleVehiclesAndDrivers tripIdClicked={handleTripClick} />
          )}
        </div>
      )}
    </div>
  );
};

export default helpdesk(MainComponent);
