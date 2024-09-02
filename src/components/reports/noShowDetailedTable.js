import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const NoShowDetailedTable = ({ list }) => {
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
        accessorKey: "Office",
        header: "Office",
        size: 150,
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 150,
      },
      {
        accessorKey: "empId",
        header: "Employee ID",
        size: 150,
      },
      {
        accessorKey: "employeeName",
        header: "Employee Name",
        size: 150,
      },
      {
        accessorKey: "project",
        header: "Project",
        size: 150,
      },
      {
        accessorKey: "tripID",
        header: "Trip ID",
        size: 150,
      },
      {
        accessorKey: "direction",
        header: "Direction",
        size: 150,
      },
      {
        accessorKey: "time",
        header: "Time",
        size: 150,
      },
      {
        accessorKey: "cabID",
        header: "Cab ID",
        size: 150,
      },
      {
        accessorKey: "cabNo",
        header: "Cab no.",
        size: 150,
      },
      {
        accessorKey: "plannedPickupTime",
        header: "Planned Pickup Time",
        size: 150,
      },
      {
        accessorKey: "markedBy",
        header: "Marked By",
        size: 150,
      },
      {
        accessorKey: "noShowMarkingTime",
        header: "No Show Marking Time",
        size: 250,
      },
      {
        accessorKey: "alternateTripId",
        header: "Alternate Trip ID",
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

export default NoShowDetailedTable;
