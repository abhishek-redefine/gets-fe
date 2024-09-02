import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const SOSDeviceTable = ({ list }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "sNo",
        header: "S. No",
        size: 100,
      },
      {
        accessorKey: "facility",
        header: "Facility",
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
        accessorKey: "vehicleRegistrationNo",
        header: "Vehicle Registration No",
        size: 250,
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
        accessorKey: "triggerdTime",
        header: "Triggerd Time",
        size: 100,
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
        accessorKey: "status",
        header: "Status",
        size: 150,
      },
      {
        accessorKey: "severity",
        header: "Severity",
        size: 150,
      },
      {
        accessorKey: "escalationLevel",
        header: "Escalation Level",
        size: 150,
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

export default SOSDeviceTable;
