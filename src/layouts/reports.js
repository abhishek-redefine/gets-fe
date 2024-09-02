import withAuthLayout from "@/layouts/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const reports = (WrappedComponent) => {
  const Reports = (props) => {
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
            onClick={() => changeRoute("operations-reports")}
            className={`btn btn-secondary ${
              currentActiveState === "operations-reports" ? "btn-blk" : ""
            }`}
          >
            Operations Reports
          </button>
          <button
            onClick={() => changeRoute("billing-reports")}
            className={`btn btn-secondary ${
              currentActiveState === "billing-reports" ? "btn-blk" : ""
            }`}
          >
            Billing Reports
          </button>
          <button
            style={{width: "200px"}}
            onClick={() => changeRoute("security-reports")}
            className={`btn btn-secondary ${
              currentActiveState === "security-reports" ? "btn-blk" : ""
            }`}
          >
            Security Reports
          </button>
          <button
            style={{width: "200px"}}
            onClick={() => changeRoute("management-reports")}
            className={`btn btn-secondary ${
              currentActiveState === "management-reports" ? "btn-blk" : ""
            }`}
          >
            Management Reports
          </button>
        </div>
        <div>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
  return withAuthLayout(Reports);
};

export default reports;
