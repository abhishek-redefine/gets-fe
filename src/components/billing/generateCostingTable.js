import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const GenerateCostingTable = ({ list, isLoading }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "vendorName",
        header: "Vendor Name",
        size: 200,
      },
      {
        accessorKey: "tripCount",
        header: "Trip Count",
        size: 200,
      },
      {
        accessorKey: "totalKm",
        header: "Total Km",
        size: 200,
      },
      {
        accessorKey: "totalCost",
        header: "Total Cost",
        size: 200,
      },
      {
        accessorKey: "totalTripDuration",
        header: "Total Trip Duration",
        size: 200,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    state: { isLoading },
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

export default GenerateCostingTable;
