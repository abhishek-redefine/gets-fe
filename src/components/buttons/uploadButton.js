import React from 'react'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';

const UploadButton = ({ uploadFunction }) => {
    console.log('UploadButton', uploadFunction)
    return (
        <div className='btnContainer' style={{ width: '200px', marginRight: '10px', padding: '10px 20px', borderColor: "#F6CE47", color: '#000' }}>
            <label htmlFor="upload-photo">
                <input
                    style={{ display: 'none' }}
                    id="upload-photo"
                    name="upload-photo"
                    type="file"
                    onChange={(e) => { uploadFunction(e.target.files[0]) }}
                />
                <Button variant="outlined" className='btn' style={{color:'#000'}} component="span">
                    <FileUploadOutlinedIcon /> Upload File
                </Button>
            </label>
        </div>
    )
}

export default UploadButton
