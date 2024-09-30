import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import OfficeService from '@/services/office.service';

const OfficesListing = ({
    onSuccess,
    officeListing,
    isLoading
}) => {

    const headers = [{
        key: "officeId",
        display: "Office ID"
    },
    {
        key: "contactPerson",
        display: "Contact Person"
    },
    {
        key: "contactEmail",
        display: "Contact Email"
    },
    {
        key: "contact",
        display: "Contact Mobile No"
    },
    {
        key: "address",
        display: "Address"
    },
    {
        key: "address",
        display: "Address"
    }];

    return (
        <div className='internalSettingContainer'>
            <div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={officeListing} isLoading={isLoading}/>
                </div>
            </div>
        </div>
    );
}

export default OfficesListing;