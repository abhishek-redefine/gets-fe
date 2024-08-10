import withAuthLayout from "@/layouts/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const billing = (WrappedComponent) => {
  const Billing = (props) => {
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
            onClick={() => changeRoute("billing-issues")}
            className={`btn btn-secondary ${
              currentActiveState === "billing-issues" ? "btn-blk" : ""
            }`}
          >
            Billing Issues
          </button>
          <button
            onClick={() => changeRoute("trip-sheet-entry")}
            className={`btn btn-secondary ${
              currentActiveState === "trip-sheet-entry" ? "btn-blk" : ""
            }`}
          >
            Trip Sheet Entry
          </button>
          <button
            style={{width: "200px"}}
            onClick={() => changeRoute("billing-audit")}
            className={`btn btn-secondary ${
              currentActiveState === "billing-audit" ? "btn-blk" : ""
            }`}
          >
            Billing Audit
          </button>
          <button
            style={{width: "200px"}}
            onClick={() => changeRoute("billing-approvals")}
            className={`btn btn-secondary ${
              currentActiveState === "billing-approvals" ? "btn-blk" : ""
            }`}
          >
            Billing Approvals
          </button>
        </div>
        <div>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
  return withAuthLayout(Billing);
};

export default billing;
