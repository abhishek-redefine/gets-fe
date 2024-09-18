import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const EmployeeTripTable = ({ pointHeaderLabel, tripMembersList }) => {
  const [data, setData] = useState(tripMembersList);
  const [point, setPoint] = useState("");

  const handleRespectiveHeaderLabel = () => {
    if (pointHeaderLabel == "LOGIN") {
      setPoint("Pickup Point");
    } else if (pointHeaderLabel == "LOGOUT") {
      setPoint("Drop Point");
    }
  };

  const [columns, setColumns] = useState(
    () => [
      {
        accessorKey: "empId",
        header: "Employee ID",
        size: 150,
      },
      {
        accessorKey: "name",
        header: "Employee Name",
        size: 150,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        size: 150,
      },
      {
        accessorKey: "areaName",
        header: point,
        size: 150,
      },
      {
        accessorKey: "vehicleReportTime",
        header: "Vehicle Report Time",
        size: 200,
      },
      {
        accessorKey: "signIn",
        header: "Sign In",
        size: 100,
      },
      {
        accessorKey: "signOut",
        header: "sign Out",
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
      },
      {
        accessorKey: "mob",
        header: "Phone No.",
        size: 150,
      },
      // {
      //   accessorKey: "action",
      //   header: "Action",
      //   size: 150,
      // },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: false,
    enableMultiRowSelection: false,
    enableTopToolbar: false,
    initialState: {
      density: "compact",
      pagination: { pageIndex: 0, pageSize: 12 },
    },
    muiTableBodyCellProps: {
      sx: {
        fontFamily: "DM Sans",
        fontSize: "14px",
      },
    },
  });

  useEffect(() => {
    if (tripMembersList) {
      setData(tripMembersList);
      let prev = [...columns];
      prev.map((columns) => {
        if (columns.accessorKey === "areaName") {
          if (pointHeaderLabel === "LOGIN") {
            columns.header = "Pickup Point";
          } else {
            columns.header = "Drop Point";
          }
        }
      });
    }
  }, [tripMembersList]);

  return (
    <div>
      <div>
        <MaterialReactTable table={tableInstance} />
      </div>
    </div>
  );
};

export default EmployeeTripTable;
