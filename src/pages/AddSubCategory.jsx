import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, MenuItem, FormControl, InputLabel, Select, Typography,
  CircularProgress, Grid, FormControlLabel, Checkbox
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

const AddSubcategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true); // State for enabled status

 

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSubcategoryImage(file);
    setImagePreview(URL.createObjectURL(file)); // Set image preview
  };



  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add Subcategory
      </Typography>

      <form >
        <Grid container spacing={2}>
          {/* Category Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Select Category"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Subcategory Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Subcategory Name"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              fullWidth
              required
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <Button variant="contained" component="label">
              Upload Subcategory Image
              <input
                type="file"
                hidden
                onChange={handleImageChange}
                accept="image/*"
                required
              />
            </Button>
            {subcategoryImage && <Typography>{subcategoryImage.name}</Typography>}
          </Grid>

          {/* Image Preview */}
          <Grid item xs={12}>
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <Typography>Image Preview:</Typography>
                <img
                  src={imagePreview}
                  alt="Subcategory Preview"
                  style={{ maxWidth: '50%', height: '200px' }}
                />
              </Box>
            )}
          </Grid>

          {/* Enable/Disable Checkbox */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                />
              }
              label="Enable Subcategory"
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Add Subcategory'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <ToastContainer /> {/* Add ToastContainer for toast notifications */}
    </Box>
  );
};

export default AddSubcategory;
