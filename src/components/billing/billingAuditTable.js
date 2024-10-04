import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const BillingAuditTable = ({ list, vehicleIdClicked }) => {
  const [data, setData] = useState([]);

  const handleVehicleIdClick = (row) => {
    // console.log("Clicked vehicle id row>>>>", row);
    vehicleIdClicked(row);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "vehicleId",
        header: "Vehicle ID",
        size: 150,
        Cell: ({ cell, row }) => {
          const vehicleId = cell.getValue();
          return (
            <a
              onClick={() => handleVehicleIdClick(row.original)}
              style={{
                color: "blue",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {vehicleId}
            </a>
          );
        },
      },
      {
        accessorKey: "vehicleRegistration",
        header: "Vehicle Registration",
        size: 250,
      },
      {
        accessorKey: "vehicleType",
        header: "Vehicle Type",
        size: 150,
      },
      {
        accessorKey: "vendor",
        header: "Vendor",
        size: 150,
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 100,
      },
      {
        accessorKey: "id",
        header: "Trip ID",
        size: 150,
        Cell: ({ cell }) => {
          return <div>TRIP-{cell.getValue()}</div>;
        },
      },
      {
        accessorKey: "km",
        header: "Km.",
        size: 100,
      },
      {
        accessorKey: "hrs",
        header: "Hrs",
        size: 100,
      },
      {
        accessorKey: "issueType",
        header: "Issue Type",
        size: 150,
      },
      {
        accessorKey: "shiftTime",
        header: "Shift Time",
        size: 150,
      },
      {
        accessorKey: "shiftType",
        header: "Shift Type",
        size: 150,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    getRowId: (row) => row.vehicleId,
  });

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <div>
      <MaterialReactTable
        table={tableInstance}
        getRowId={(row) => row.vehicleId}
      />
    </div>
  );
};

export default BillingAuditTable;
