import withAuthLayout from "@/layouts/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const helpdesk = (WrappedComponent) => {
  const Helpdesk = (props) => {
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
            onClick={() => changeRoute("search-module")}
            className={`btn btn-secondary ${
              currentActiveState === "search-module" ? "btn-blk" : ""
            }`}
          >
            Search Module
          </button>
          <button
            onClick={() => changeRoute("change-request-module")}
            className={`btn btn-secondary ${
              currentActiveState === "change-request-module" ? "btn-blk" : ""
            }`}
          >
            Change Request Module
          </button>
          <button
            style={{width: "200px"}}
            onClick={() => changeRoute("trip-feedback")}
            className={`btn btn-secondary ${
              currentActiveState === "trip-feedback" ? "btn-blk" : ""
            }`}
          >
            Trip Feedback
          </button>
        </div>
        <div>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
  return withAuthLayout(Helpdesk);
};

export default helpdesk;
