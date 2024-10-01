import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const NoShowSummaryTable = ({ list, isLoading }) => {
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
        accessorKey: "reRosteredCount",
        header: "Rerostered Count",
        size: 150,
      },
      {
        accessorKey: "reRosteredPercentage",
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

export default NoShowSummaryTable;
