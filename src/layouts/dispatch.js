import withAuthLayout from "@/layouts/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const dispatch = (WrappedComponent) => {
  const Dispatch = (props) => {
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
      <div className="mainSettingsContainer">
        <div className="currentStateContainer">
          <button
            onClick={() => changeRoute("routing")}
            className={`btn btn-secondary ${
              currentActiveState === "routing" ? "btn-blk" : ""
            }`}
          >
            Routing
          </button>
          {/* <button
            onClick={() => changeRoute("vendor-allocation")}
            className={`btn btn-secondary ${
              currentActiveState === "vendor-allocation" ? "btn-blk" : ""
            }`}
          >
            Vendor Allocation
          </button>
          <button
            onClick={() => changeRoute("cab-allocation")}
            className={`btn btn-secondary ${
              currentActiveState === "cab-allocation" ? "btn-blk" : ""
            }`}
          >
            Cab Allocation
          </button>
          <button
            onClick={() => changeRoute("dispatch-notification")}
            className={`btn btn-secondary ${
              currentActiveState === "dispatch-notification" ? "btn-blk" : ""
            }`}
          >
            Dispatch Notification
          </button>
          <button
            onClick={() => changeRoute("approvals-workflow")}
            className={`btn btn-secondary ${
              currentActiveState === "approvals-workflow" ? "btn-blk" : ""
            }`}
          >
            Approvals workflow
          </button>
          <button
            onClick={() => changeRoute("operation-penalty")}
            className={`btn btn-secondary ${
              currentActiveState === "operation-penalty" ? "btn-blk" : ""
            }`}
          >
            Operation Penalty
          </button> */}
        </div>
        <div>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
  return withAuthLayout(Dispatch);
};

export default dispatch;
