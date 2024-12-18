import React, { useEffect, useMemo, useState } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const TollAndParkingTable = (props) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const columns = useMemo(
        () => [
            {
                accessorKey: "date",
                header: "Date",
                size: 200,
            },
            {
                accessorKey: "vehicleId",
                header: "Vehicle Id",
                size: 200,
            },
            {
                accessorKey: "tripId",
                header: "Trip Id",
                size: 200,
            },
            {
                accessorKey: "amount",
                header: "Amount",
                size: 200,
            },
            {
                accessorKey: "remark",
                header: "Remark",
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

    return (
        <div>
            <MaterialReactTable table={tableInstance} />
        </div>
    )
}

export default TollAndParkingTable;