import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  root: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: '1px solid #ffffff',
    borderRadius: 2,
    boxShadow: 8,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'DM Sans, sans-serif',
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    top: 8,
    color: '#ccc',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    mt: 2,
  },
  button: {
    textTransform: 'capitalize',
    fontSize: '13px',
    fontWeight: 'bold',
    flex: 1,
    margin: '0 8px',
    backgroundColor: '#f6ce47',
    color: 'black',
    '&:hover': {
      backgroundColor: '#FFD700',
    },
  },
  separator: {
    width: '100%',
    height: '0.5px',
    backgroundColor: '#ccc',
    margin: '16px 0',
  },
  text: {
    fontSize: '15px',
    fontWeight: 'bold',
    margin: '3px 0 35px',
    textAlign: 'center',
    fontFamily: 'DM Sans, sans-serif',
  },
};

export default function confirmationModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style.root}>
          <IconButton sx={style.closeButton} onClick={handleClose}>
            <CloseIcon fontSize='small'/>
          </IconButton>
          <img src="/images/confirmationCheck.jpg" width={150} height={150} alt="Confirmation" />
          <Typography id="modal-modal-title" sx={style.text}>
            Hey! <br /> Are you sure you want to delete route?
          </Typography>
          <div style={style.separator}></div>
          <div style={style.buttonContainer}>
            <Button sx={style.button} onClick={handleClose}>
              Yes
            </Button>
            <Button sx={style.button} onClick={handleClose}>
              No
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
