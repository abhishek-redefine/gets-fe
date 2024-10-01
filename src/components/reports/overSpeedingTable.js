import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const OverSpeedingTable = ({ list }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "sNo",
        header: "S.No",
        size: 100,
      },
      {
        accessorKey: "facility",
        header: "Facility",
        size: 100,
      },
      {
        accessorKey: "office",
        header: "Office",
        size: 150,
      },
      {
        accessorKey: "vendorName",
        header: "Vendor Name",
        size: 150,
      },
      {
        accessorKey: "vehicleId",
        header: "Vehicle ID",
        size: 150,
      },
      {
        accessorKey: "vehicleRegNo",
        header: "Vehicle Reg No",
        size: 150,
      },
      {
        accessorKey: "direction",
        header: "Direction",
        size: 150,
      },
      {
        accessorKey: "shift",
        header: "Shift",
        size: 100,
      },
      {
        accessorKey: "tripId",
        header: "Trip ID",
        size: 100,
      },
      {
        accessorKey: "speedAtWhichAlertRaised",
        header: "Speed At Which Alert Raised",
        size: 280,
      },
      {
        accessorKey: "maxSpeed",
        header: "Max Speed",
        size: 100,
      },
      {
        accessorKey: "duration",
        header: "Duration",
        size: 100,
      },
      {
        accessorKey: "driverName",
        header: "Driver Name",
        size: 150,
      },
      {
        accessorKey: "driverContactNumber",
        header: "Driver Contact Number",
        size: 250,
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
        size: 150,
      },
      {
        accessorKey: "updateTime",
        header: "Update Time",
        size: 150,
      },
      {
        accessorKey: "closedBy",
        header: "Closed By",
        size: 150,
      },
      {
        accessorKey: "comments",
        header: "Comments",
        size: 150,
      },
      {
        accessorKey: "triggeredLocation",
        header: "Triggered Location",
        size: 150,
      },
      {
        accessorKey: "state",
        header: "State",
        size: 100,
      },
      {
        accessorKey: "severity",
        header: "Severity",
        size: 100,
      },
      {
        accessorKey: "count",
        header: "Count",
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

export default OverSpeedingTable;
