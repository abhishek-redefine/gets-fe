import React, { useEffect, useState } from "react";
import Configurations from "@/layouts/configurations";
import BillingConfigurations from "@/components/configurations/billing/billing";

const Billing = () => {
  const [currentState, setCurrentState] = useState("Billing");

  const changeState = (newState) => {
    setCurrentState(newState.displayName);
  };

  const ComplianceType = [
    {
      displayName: "Billing",
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
        <div>{currentState === "Billing" && <BillingConfigurations />}</div>
      </div>
    </div>
  );
};

export default Configurations(Billing);
