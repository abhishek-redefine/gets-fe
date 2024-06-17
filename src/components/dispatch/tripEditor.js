import React, { useState } from "react";
import { Table, useTable, EditingMode, DataType, SortingMode } from "ka-table";
import { updateGroupsExpanded } from "ka-table/actionCreators";

const initDataArray = [
  
    {
        "id": 1,
        "tripId": 1,
        "noOfSeats": 4,
        "memberCount": 2,
        "pickupPoint": "",
        "dropPoint": "",
        "pickupTime": "11:15"
    },
    {
        "id": 2,
        "tripId": 1,
        "noOfSeats": 4,
        "memberCount": "MALE",
        "pickupPoint": "",
        "dropPoint": "HCLND0001",
        "pickupTime": "11:15"
    },
    {
        "id": 3,
        "tripId": 1,
        "noOfSeats": 4,
        "memberCount": "MALE",
        "pickupPoint": "",
        "dropPoint": "HCLND0001",
        "pickupTime": "11:15"
    },
    {
        "id": 4,
        "tripId": 2,
        "noOfSeats": 4,
        "memberCount": 1,
        "pickupPoint": "",
        "dropPoint": "",
        "pickupTime": "11:15"
    },
    {
        "id": 5,
        "tripId": 2,
        "noOfSeats": 4,
        "memberCount": "MALE",
        "pickupPoint": "",
        "dropPoint": "HCLND0001",
        "pickupTime": "11:15"
    }

];

const headers = [
  { key: "tripId", title: "Trip Id", dataType: DataType.String },
  { key: "noOfSeats", title: "Number of Seats", dataType: DataType.String },
  { key: "memberCount", title: "Employee Count", dataType: DataType.String },
  { key: "pickupPoint", title: "Pickup Point", dataType: DataType.String },
  { key: "dropPoint", title: "Drop Point", dataType: DataType.String },
  { key: "pickupTime", title: "Special Status", dataType: DataType.String },
];

const TripEditor = () => {
  const table = useTable({
    onDispatch: (action, newProps) => {
      const { data, ...settingsWithoutData } = newProps;
      // Save settings to localStorage
      localStorage.setItem(
        "excel-like-table-settings",
        JSON.stringify(settingsWithoutData)
      );
    },
  });

  const [selectedData, setSelectedData] = useState(null);

  const handleRowClick = (event, extendedEvent) => {
    table.selectSingleRow(extendedEvent.childProps.rowKeyValue);
    setSelectedData(extendedEvent.childProps.rowData);
  };

  const handleDeselect = () => {
    table.deselectAllRows();
    setSelectedData(null);
  };

  return (
    <div className="excel-like-table">
      <Table
        table={table}
        columns={headers}
        data={initDataArray}
        rowKeyField={"id"}
        editingMode={EditingMode.Cell}
        rowReordering={true}
        columnReordering={true}
        
        //groups={[{ columnKey: "country" }, { columnKey: "type" }]}
        sortingMode={SortingMode.Single}
        childComponents={{
          groupRow: {
            content: ({ groupIndex, isExpanded, dispatch, text, groupKey }) => (
              <>
                <td className="ka-group-cell" colSpan={4}>
                  <button
                    onClick={() => dispatch(updateGroupsExpanded(groupKey))}
                    style={{ marginRight: 5 }}
                  >
                    {isExpanded ? "Hide Group Items" : "Show Group Items"}
                  </button>
                  {text}
                </td>
              </>
            ),
          },
          dataRow: {
            elementAttributes: () => ({
              onClick: handleRowClick,
            }),
          },
        }}
      />
      {selectedData && (
        <div className="selected-data-info">
          Selected: {selectedData.name} ({selectedData.country})
          <button onClick={handleDeselect}>Deselect</button>
        </div>
      )}
    </div>
  );
};

export default TripEditor;
