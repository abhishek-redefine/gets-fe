import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const OnTimeDepartureSummaryTable = ({ list, isLoading }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "tripDate",
        header: "Trip Date",
        size: 150,
      },
      {
        accessorKey: "shift",
        header: "Shift",
        size: 100,
      },
      {
        accessorKey: "totalLogoutTrips",
        header: "Total Logout Trips",
        size: 150,
      },
      {
        accessorKey: "completedLogoutTrips",
        header: "Completed Logout Trips",
        size: 250,
      },
      {
        accessorKey: "incompleteTrips",
        header: "Incomplete Trips",
        size: 150,
      },
      {
        accessorKey: "delayedTrips",
        header: "Delayed Trips",
        size: 150,
      },
      {
        accessorKey: "otdTrips",
        header: "OTD Trips",
        size: 150,
      },
      {
        accessorKey: "otdPercentage",
        header: "% On Time Departure",
        size: 150,
      },
      {
        accessorKey: "employeeDelay",
        header: "Employee Delay",
        size: 100,
      },
      {
        accessorKey: "driverDelay",
        header: "Driver Delay",
        size: 100,
      },
      {
        accessorKey: "trafficDelay",
        header: "Traffic Delay",
        size: 100,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    state: {
      isLoading,
    },
    muiCircularProgressProps: {
      Component: <LoaderComponent />,
    },
  });

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <div>
      <MaterialReactTable table={tableInstance} />
    </div>
  );
};

export default OnTimeDepartureSummaryTable;
