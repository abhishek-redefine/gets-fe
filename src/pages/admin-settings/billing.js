import React, { useEffect, useState } from "react";
import ContractType from "@/components/admin-settings/billing/contractType";
import adminSettings from "@/layouts/admin-settings";

const Billing = () => {
  const [currentState, setCurrentState] = useState("Contract Type");

  const changeState = (newState) => {
    setCurrentState(newState.displayName);
  };

  const ComplianceType = [
    {
      displayName: "Contract Type",
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
        <div>{currentState === "Contract Type" && <ContractType />}</div>
      </div>
    </div>
  );
};

export default adminSettings(Billing);
