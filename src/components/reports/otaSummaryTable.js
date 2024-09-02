import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const OnTimeArrivalSummaryTable = ({ list }) => {
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
        accessorKey: "totalLoginTrips",
        header: "Total Login Trips",
        size: 150,
      },
      {
        accessorKey: "completedLoginTrips",
        header: "Completed Login Trips",
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
        accessorKey: "otaTrips",
        header: "OTA Trips",
        size: 150,
      },
      {
        accessorKey: "otaPercentage",
        header: "% On Time Arrival",
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

export default OnTimeArrivalSummaryTable;
