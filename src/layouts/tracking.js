import withAuthLayout from "@/layouts/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const tracking = (WrappedComponent) => {
  const Tracking = (props) => {
    const router = useRouter();
    const [currentActiveState, setCurrentActiveState] = useState("");

    const changeRoute = (routeName) => {
      router.push(routeName);
      setCurrentActiveState(routeName);
    };

    useEffect(() => {
      let routeName = router?.pathname?.split("/");
      routeName = routeName?.[routeName?.length - 1];
      if (routeName) {
        setCurrentActiveState(routeName);
      }
    }, []);

    return (
      <div
        className="mainSettingsContainer"
        style={{ backgroundColor: "white" }}
      >
        <div className="currentStateContainer">
          <button
            onClick={() => changeRoute("live-tracking")}
            className={`btn btn-secondary ${
              currentActiveState === "routing" ? "btn-blk" : ""
            }`}
          >
            Live Tracking
          </button>
          <button
            onClick={() => changeRoute("security-dashboard")}
            className={`btn btn-secondary ${
              currentActiveState === "B2B-routing" ? "btn-blk" : ""
            }`}
          >
            Security Dashboard
          </button>
          <button
            style={{width: "200px"}}
            onClick={() => changeRoute("safe-reach-confirmation")}
            className={`btn btn-secondary ${
              currentActiveState === "vendor-allocation" ? "btn-blk" : ""
            }`}
          >
            Safe Reach Confirmation
          </button>
          <button
            onClick={() => changeRoute("incident-management")}
            className={`btn btn-secondary ${
              currentActiveState === "cab-allocation" ? "btn-blk" : ""
            }`}
          >
            Incident Management
          </button>
        </div>
        <div>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
  return withAuthLayout(Tracking);
};

export default tracking;
