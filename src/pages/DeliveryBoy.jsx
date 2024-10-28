import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Modal, TextField, MenuItem, Grid, IconButton
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


function DeliveryBoyManagement() {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    mobile_number: "",
    name: "",
    vehicle_type: "",
    vehicle_number: "",
    gender: "",
    dob: "",
    identity_proof: null,
  });
  const [identityProofPreview, setIdentityProofPreview] = useState(null);

  

 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({ ...prev, identity_proof: file }));
    setIdentityProofPreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, identity_proof: null }));
    setIdentityProofPreview(null);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Manage Delivery Boys</Typography>
        <Button variant="contained" onClick={handleOpenModal}>Add Delivery Boy</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "lightgray" }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Mobile Number</b></TableCell>
              <TableCell><b>Vehicle Type</b></TableCell>
              <TableCell><b>Vehicle Number</b></TableCell>
              <TableCell><b>Gender</b></TableCell>
              <TableCell><b>Date of Birth</b></TableCell>
              <TableCell><b>Identity Proof</b></TableCell>
              <TableCell><b>Working</b></TableCell>
              <TableCell><b>Created AT</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  
    <TableRow >
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell></TableCell>
      <TableCell>
        <a href='' target="_blank" rel="noopener noreferrer"></a>
      </TableCell>
      <TableCell> </TableCell>
      <TableCell></TableCell>
      <TableCell>
        <IconButton color="primary" aria-label="edit" onClick={handleOpenModal}>
          <EditIcon />
        </IconButton>
        <IconButton color="secondary" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
 
</TableBody>

        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          maxWidth: 600, p: 3, m: 'auto', mt: '10vh',
          bgcolor: 'white', boxShadow: 24, borderRadius: 2,
          maxHeight: '80vh', overflow: 'auto'
        }}>
          <Typography variant="h6" gutterBottom>Add Delivery Boy</Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" name="name"  fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email"  fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Mobile Number" name="mobile_number"  fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Vehicle Type" name="vehicle_type"  fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Vehicle Number" name="vehicle_number"  fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Gender" name="gender"  select fullWidth>
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="O">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Date of Birth" name="dob" type="date"  fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" component="label" fullWidth>Upload Identity Proof<input type="file" hidden onChange={handleFileChange} /></Button>
              
                <Box display="flex" alignItems="center" mt={1}>
                  <img src='' alt="Identity Proof" width="100" height="100" style={{ marginRight: 10 }} />
                  <IconButton onClick={handleRemoveFile}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              
            </Grid>
          </Grid>

          <Button variant="contained" fullWidth sx={{ mt: 3 }} >Add</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default DeliveryBoyManagement;
