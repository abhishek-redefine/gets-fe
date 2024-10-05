import React, { useEffect, useState } from "react";
import Grid from "@/components/grid";
import { display } from "@mui/system";
import AddContract from "./addContract";

const ContractType = () => {
  const headers = [
    {
      key: "contractId",
      display: "Contract ID",
    },
    {
      key: "ContractName",
      display: "Contract Name",
    },
    {
      key: "type",
      display: "Type",
    },
    {
      key: "startDate",
      display: "Start Date",
    },
    {
      key: "sittingCapacity",
      display: "Sitting Capacity",
    },
    {
      key: "hamburgerMenu",
      html: (
        <>
          <span className="material-symbols-outlined">more_vert</span>
        </>
      ),
      navigation: true,
      menuItems: [
        {
          display: "Edit",
          key: "edit",
        },
        // {
        //   display: "Deactivate",
        //   key: "deactivate",
        // },
      ],
    },
  ];

  const [isAddContract, setIsAddContract] = useState(false);
  const [contractListing, setContractListing] = useState();
  const [editContractData, setEditContractData] = useState({});

  const [paginationData, setPaginationData] = useState();
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);

  const handlePageChange = (page) => {
    console.log(page);
    let updatedPagination = { ...pagination };
    updatedPagination.pageNo = page;
    setPagination(updatedPagination);
  };

  const fetchAllContract = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const listData = [
        {
          contractId: "CNRT001",
          ContractName: "Contract1",
          type: "Flat trip based",
          startDate: "2024-10-01",
          sittingCapacity: "12",
        },
      ];
      setContractListing(listData);
      const data = {
        data: data,
        pageNumber: 0,
        totalElements: 1,
        totalPages: 1,
      };
      let localPaginationData = { ...data };
      delete localPaginationData?.data;
      setPaginationData(localPaginationData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContract();
  }, [isAddContract,pagination]);

  const onMenuItemClick = (key, values) => {
    console.log("values>>>", values)
    if (key === "edit") {
      setEditContractData(values);
      setIsAddContract(true);
    }
  };

  return (
    <div className="internalSettingContainer">
      {!isAddContract && (
        <div>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <div className="btnContainer">
              <button
                onClick={() => setIsAddContract(true)}
                className="btn btn-primary"
              >
                Add Contract
              </button>
            </div>
          </div>
          <div className="gridContainer">
            <Grid
              onMenuItemClick={onMenuItemClick}
              headers={headers}
              listing={contractListing}
              pageNoText="pageNumber"
              handlePageChange={handlePageChange}
              pagination={paginationData}
              isLoading={loading}
            />
          </div>
        </div>
      )}
      {isAddContract && (
        <div>
          <AddContract
            EditContractData={editContractData}
            SetIsAddContract={setIsAddContract}
          />
        </div>
      )}
    </div>
  );
};

export default ContractType;
