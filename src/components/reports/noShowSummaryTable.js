import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const NoShowSummaryTable = ({ list }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "tripDate",
        header: "Trip Date",
        size: 150,
      },
      {
        accessorKey: "rosteredEmployees",
        header: "Rostered Employees",
        size: 150,
      },
      {
        accessorKey: "noShow",
        header: "No Show",
        size: 150,
      },
      {
        accessorKey: "rerosteredCount",
        header: "Rerostered Count",
        size: 150,
      },
      {
        accessorKey: "rerosteredPercentage",
        header: "Rerostered (%)",
        size: 150,
      },
      {
        accessorKey: "noShowPercentage",
        header: "No Show (%)",
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

export default NoShowSummaryTable;
