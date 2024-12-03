import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, FormGroup, Typography, Box, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createSubadmin } from '../../services/allApi';


function AddSubAdmin() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile_number:'',
    email: '',
    password: '',
    
  });
  const [errors, setErrors] = useState({
    name: '',
    mobile_number:'',
    email: '',
    password: '',
  });

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    if (!/^\d{10}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = 'Mobile number must be exactly 10 digits';
      valid = false;
    }
  

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await createSubadmin(formData);
        if (response.status === 201) {
          toast.success('Sub-admin added successfully!');
          setFormData({
            name: '',
            mobile_number: '',
            email: '',
            password: '',
          });
          setErrors({});
        }
      } catch (error) {
        console.log(error)
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message); // Display backend error message
        } else {
          // Fallback error message for unexpected cases
          toast.error("Something went wrong while adding the category.");
        }
      }
    }
  };

 
  console.log(formData)

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          <b>Add Sub Admin</b>
        </Typography>
        {/* <Button variant="contained" color="secondary" onClick={() => setModalOpen(true)}>
          Add Main Admin
        </Button> */}
      </Grid>

      {/* Modal for adding Main Admin */}
      {/* <Dialog open={isModalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Add Main Admin</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={mainAdminData.name}
            
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={mainAdminData.email}
           
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={mainAdminData.password}
           
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button  color="primary">
            Add Main Admin
          </Button>
        </DialogActions>
      </Dialog> */}

      <form onSubmit={handleAdd} >
        <Grid container spacing={2} sx={{mt:1}}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
  <TextField
    fullWidth
    label="Mobile Number"
    name="mobile_number"
    value={formData.mobile_number}
    type="number"
    onChange={handleInputChange}
    error={!!errors.mobile_number}
    helperText={errors.mobile_number}
    variant="outlined"
  />
</Grid>


          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
            />
          </Grid>

          {/* <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              <b>Permissions</b>
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.products}
                    
                    name="products"
                  />
                }
                label="Products"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.users}
                    
                    name="users"
                  />
                }
                label="Users"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.orders}
                    
                    name="orders"
                  />
                }
                label="Orders"
              />
            </FormGroup>
          </Grid> */}

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Sub Admin
            </Button>
          </Grid>
        </Grid>
      </form>

      <ToastContainer />
    </Box>
  );
}

export default AddSubAdmin;