import React, { useEffect, useState } from "react";
import AdminSetting from "@/layouts/admin-settings";
import { useDispatch } from "react-redux";
import { ROUTING_TYPES } from "@/constants/app.constants.";
import Zone from "@/components/routing/zone";
import Area from "@/components/routing/area";
import NodalPoint from "@/components/routing/nodalPoint";
import HomeRoute from "@/components/routing/homeRoute";
import BusShuttleRoute from "@/components/routing/busShuttleRoute";

const Routing = () => {
  const [currentState, setCurrentState] = useState(ROUTING_TYPES.ZONE);
  const [selectedRoleType, setSelectedRoleType] = useState("ZONE");

  const changeState = (newState) => {
    setCurrentState(newState.value);
  };

  const RoutingType = [
    {
      defaultValue: "Zone",
      displayName: "Zone Name",
      value: "ZONE",
    },
    {
      defaultValue: "Area",
      displayName: "Area Name",
      value: "AREA",
    },
    {
      defaultValue: "Nodal",
      displayName: "Nodal Point",
      value: "NODAL_POINT",
    },
    {
      defaultValue: "Home",
      displayName: "Home Routes",
      value: "HOME_ROUTE",
    },
    {
      defaultValue: "Bus",
      displayName: "Bus/Shuttle Route",
      value: "BUS_SHUTTLE_ROUTE",
    },
  ];

  const onSuccess = () => {};

  return (
    <div className="mainSettingsContainer">
      <div className="currentStateContainer">
        {RoutingType.map((routeType, idx) => (
          <button
            key={idx}
            onClick={() => changeState(routeType)}
            className={`btn btn-secondary ${
              currentState === routeType.value ? "btn-blk" : ""
            }`}
          >
            {routeType.displayName}
          </button>
        ))}
      </div>
      <div>
        {currentState === ROUTING_TYPES.ZONE && (
          <Zone roleType={selectedRoleType} onSuccess={onSuccess} />
        )}
        {currentState === ROUTING_TYPES.AREA && (
          <Area roleType={selectedRoleType} onSuccess={onSuccess} />
        )}
        {currentState === ROUTING_TYPES.NODAL_POINT && (
          <NodalPoint roleType={selectedRoleType} onSuccess={onSuccess} />
        )}
        {currentState === ROUTING_TYPES.HOME_ROUTE && (
          <HomeRoute roleType={selectedRoleType} onSuccess={onSuccess} />
        )}
        {currentState === ROUTING_TYPES.BUS_SHUTTLE_ROUTE && (
          <BusShuttleRoute roleType={selectedRoleType} onSuccess={onSuccess} />
        )}
      </div>
    </div>
  );
};

export default AdminSetting(Routing);
