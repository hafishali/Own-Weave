import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Box, Typography, Grid, Alert, Radio, RadioGroup, FormLabel, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { editCategories, getAlloffers } from '../services/allApi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditCategoryModel({ openEditDialog, setOpenEditDialog, selectedCategory, setSelectedCategory,handleGetAllcategories }) {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [alloffers, setAlloffers] = useState([]);
  const [categoryDts, setCategoryDts] = useState({
    name: "",
    heading: "",
    description: "",
    offer_id: "",
    image: "",
    status: true,
    size_S_length: "",
    size_M_length: "",
    size_L_length: "",
    size_XL_length: "",
    size_XXL_length: "",
    size_XXXL_length: "",
    size_4XL_length: "",
    sleeve_full_length: "",
    sleeve_half_length: ""
  });

  useEffect(() => {
    if (selectedCategory) {
      setCategoryDts({
        ...selectedCategory,
        offer_id: selectedCategory.offer_id || "",
        image: selectedCategory.image || "",
      });
      setImagePreview(selectedCategory.image || null);
    }
  }, [selectedCategory]);

  const viewAllOffers = async () => {
    try {
      const response = await getAlloffers();
      if (response.status === 200) {
        setAlloffers(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    viewAllOffers();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryDts({ ...categoryDts, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteMainImage = () => {
    setImagePreview(null);
    setCategoryDts({ ...categoryDts, image: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryDts({ ...categoryDts, [name]: value });
  };
  const handleCancel = () => {  
    setOpenEditDialog(false);
    setSelectedCategory(null);
    setError('')
    setSuccess(false);
  };
  const handleEditCategories = async () => {
    const {
      id,
      name,
      heading,
      description,
      offer_id,
      image,
      status,
      size_S_length,
      size_M_length,
      size_L_length,
      size_XL_length,
      size_XXL_length,
      size_XXXL_length,
      size_4XL_length,
      sleeve_full_length,
      sleeve_half_length
    } = categoryDts;
  
    if (!id) {
      console.error("No category ID provided.");
      return;
    }
  
    try {
      const access_token = localStorage.getItem('access');
      const reqHeader = {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'multipart/form-data'
      };
  
      const formData = new FormData();
  
      // Append fields only if they are changed
      if (name !== selectedCategory.name) formData.append("name", name);
      if (heading !== selectedCategory.heading) formData.append("heading", heading);
      if (description !== selectedCategory.description) formData.append("description", description);
      if (offer_id !== selectedCategory.offer_id) formData.append("offer_id", offer_id);
      if (status !== selectedCategory.status) formData.append("status", status);
      if (size_S_length !== selectedCategory.size_S_length) formData.append("size_S_length", size_S_length);
      if (size_M_length !== selectedCategory.size_M_length) formData.append("size_M_length", size_M_length);
      if (size_L_length !== selectedCategory.size_L_length) formData.append("size_L_length", size_L_length);
      if (size_XL_length !== selectedCategory.size_XL_length) formData.append("size_XL_length", size_XL_length);
      if (size_XXL_length !== selectedCategory.size_XXL_length) formData.append("size_XXL_length", size_XXL_length);
      if (size_XXXL_length !== selectedCategory.size_XXXL_length) formData.append("size_XXXL_length", size_XXXL_length);
      if (size_4XL_length !== selectedCategory.size_4XL_length) formData.append("size_4XL_length", size_4XL_length);
      if (sleeve_full_length !== selectedCategory.sleeve_full_length) formData.append("sleeve_full_length", sleeve_full_length);
      if (sleeve_half_length !== selectedCategory.sleeve_half_length) formData.append("sleeve_half_length", sleeve_half_length);
  
      // Only append the image if it has been updated
      if (image && image !== selectedCategory.image) {
        formData.append("image", image);
      }
  
      // Only append the offer_id if it has been changed
      if (offer_id && offer_id !== selectedCategory.offer_id) {
        formData.append("offer_id", offer_id);
      }
  
      const response = await editCategories(id, formData, reqHeader);
      if (response.status === 200) {
        toast.success("Category updated successfully");
        setSuccess(true);
        setCategoryDts({
          name: "",
          heading: "",
          description: "",
          offer_id: "",
          image: "",
          status: true,
          size_S_length: "",
          size_M_length: "",
          size_L_length: "",
          size_XL_length: "",
          size_XXL_length: "",
          size_XXXL_length: "",
          size_4XL_length: "",
          sleeve_full_length: "",
          sleeve_half_length: "",
        });
        setImagePreview(null);
        handleCancel()
        handleGetAllcategories()
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error("Error while updating category:", error);
      toast.error("Something went wrong while updating the category.");
    }
  };
  

  

  return (
    <>
      <Dialog maxWidth="md" open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <Box sx={{ maxWidth: 1600, margin: 'auto', p: 3, border: '1px solid #ccc', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom>Edit Category</Typography>
            {/* {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Category updated successfully</Alert>} */}
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Category Name"
                  variant="outlined"
                  name="name"
                  value={categoryDts.name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Heading"
                  variant="outlined"
                  name="heading"
                  value={categoryDts.heading}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">In Stock</FormLabel>
                  <RadioGroup
                    row
                    name="status"
                    value={categoryDts.status ? "yes" : "no"}
                    onChange={(e) => setCategoryDts({ ...categoryDts, status: e.target.value === "yes" })}
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Select Offer</InputLabel>
                  <Select
                    label="Select offer"
                    name="offer_id"
                    value={categoryDts.offer_id}
                    onChange={handleInputChange}
                  >
                    {alloffers.length > 0 ? (
                      alloffers.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No offers</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                  Upload Category Image
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
              </Grid>
              <Grid item xs={12}>
                {imagePreview && (
                  <Box mt={2} textAlign="center" position="relative">
                    <img src={imagePreview} alt="Selected Category" style={{ maxHeight: 200, objectFit: 'contain' }} />
                    <IconButton onClick={handleDeleteMainImage} size="small" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>
              {["S", "M", "L", "XL", "XXL", "XXXL", "4XL"].map((size) => (
                <Grid item xs={2} key={size}>
                  <InputLabel>Size of {size}</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name={`size_${size}_length`}
                    value={categoryDts[`size_${size}_length`]}
                    onChange={handleInputChange}
                  />
                </Grid>
              ))}
              {["full", "half"].map((sleeveType) => (
                <Grid item xs={3} key={sleeveType}>
                  <InputLabel>Sleeve {sleeveType.charAt(0).toUpperCase() + sleeveType.slice(1)} Length</InputLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name={`sleeve_${sleeveType}_length`}
                    value={categoryDts[`sleeve_${sleeveType}_length`]}
                    onChange={handleInputChange}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="secondary">Cancel</Button>
          <Button onClick={handleEditCategories} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
}

export default EditCategoryModel;
