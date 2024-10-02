import React, { useEffect, useState } from "react";
import Configurations from "@/layouts/configurations";
import Contract from "@/components/configurations/billing/contract";

const Billing = () => {
  const [currentState, setCurrentState] = useState("Contract");

  const changeState = (newState) => {
    setCurrentState(newState.displayName);
  };

  const ComplianceType = [
    {
      displayName: "Contract",
    },
  ];


  return (
    <div className="mainSettingsContainer">
      <div className="currentStateContainer">
        {ComplianceType.map((routeType, idx) => (
          <button
            key={idx}
            onClick={() => changeState(routeType)}
            className={`btn btn-secondary ${
              currentState === routeType.displayName ? "btn-blk" : ""
            }`}
          >
            {routeType.displayName}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 0" }}>

        <div>
          {currentState === "Contract" && <Contract />}
        </div>
      </div>
    </div>
  );
};

export default Configurations(Billing);