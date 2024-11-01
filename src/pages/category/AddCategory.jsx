import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Alert,FormControl,MenuItem,Select,InputLabel } from '@mui/material';

function AddCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  


  return (
    <Box 
      sx={{ 
        maxWidth: 1600, 
        margin: 'auto', 
        p: 3, 
        border: '1px solid #ccc', 
        borderRadius: 2, 
        boxShadow: 3 
      }}
    >
      <Typography variant="h4" gutterBottom>
        Add Category
      </Typography>
      {error && <Alert severity='error'>{error}</Alert>}
      {success && <Alert severity='success'>Category added successfully</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Category Name"
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Size"
            variant="outlined"
            
            
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Length"
            variant="outlined"
            
            
          />
        </Grid>
        <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Select Offer</InputLabel>
              <Select
                label="Select offer"
                required
              >
                
                  <MenuItem >
                    hot sails
                  </MenuItem>
                
              </Select>
            </FormControl>
          </Grid>
        
        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
          >
            Upload Category Image
            <input
              type="file"
              hidden
              accept="image/*"
              
            />
          </Button>
        </Grid>
        <Grid item xs={12}>
          {imagePreview && (
            <Box mt={2} textAlign="center">
              <img 
                src={imagePreview} 
                alt="Selected Category" 
                style={{ maxHeight: 200, objectFit: 'contain' }} 
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddCategory;
