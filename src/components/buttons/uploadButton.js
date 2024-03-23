import React from 'react'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';

const UploadButton = ({ uploadFunction }) => {
    const validationHandler = (e) =>{
        console.log(e.target.files[0]);
        const fileName = e.target.files[0].name;
        const containSpace = (str) => /\s/.test(str);
        console.log(containSpace(fileName));
        if(containSpace(fileName)){
            alert("Please remove space from file name.")
        }
        else{
            uploadFunction(e.target.files[0])
        }
    }

    return (
        <div className='btnContainer' style={{ width: '200px', marginRight: '10px', padding: '10px 20px', borderColor: "#F6CE47", color: '#000' }}>
            <label htmlFor="upload-photo">
                <input
                    style={{ display: 'none' }}
                    id="upload-photo"
                    name="upload-photo"
                    type="file"
                    onChange={validationHandler}
                />
                <Button variant="outlined" className='btn' style={{color:'#000'}} component="span">
                    <FileUploadOutlinedIcon /> Upload File
                </Button>
            </label>
        </div>
    )
}

export default UploadButton
