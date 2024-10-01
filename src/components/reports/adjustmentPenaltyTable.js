import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const AdjustmentPenaltyTable = ({ list, isLoading }) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        size: 150,
      },
      {
        accessorKey: "tripId",
        header: "Trip ID",
        size: 100,
      },
      {
        accessorKey: "vendorName",
        header: "Vendor Name",
        size: 150,
      },
      {
        accessorKey: "cabID",
        header: "Cab ID",
        size: 150,
      },
      {
        accessorKey: "registrationNo",
        header: "Registration no.",
        size: 150,
      },
      {
        accessorKey: "seatingCapacity",
        header: "Seating Capacity",
        size: 150,
      },
      {
        accessorKey: "penaltyType",
        header: "Penalty Type",
        size: 150,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        size: 150,
      },
      {
        accessorKey: "comment",
        header: "Comment",
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

export default AdjustmentPenaltyTable;
