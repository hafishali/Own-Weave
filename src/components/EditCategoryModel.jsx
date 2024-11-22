import React, { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Box, Typography, Grid, Alert, Radio, RadioGroup, FormLabel, IconButton, TableRow, TableCell, TableBody, Table, TableHead } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCategorysizes, editCategories, editCategorysizes, getAlloffers } from '../services/allApi';
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
    size_L_full_length: "",
    size_L_half_length: "",
    size_XL_full_length: "",
    size_XL_half_length: "",
    size_XXL_full_length: "",
    size_XXL_half_length: "",
    size_XXXL_full_length: "",
    size_XXXL_half_length: "",
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
  const handleDeleteSize = async (index) => {
    try {
      // Make an API call to delete the category size
      const sizeId = categoryDts.sizes[index].id;  // Assuming each size has an `id`
      const response = await deleteCategorysizes(sizeId);

      if (response.status==200) {
        // If the API call is successful, remove the size from the state
        const newSizes = [...categoryDts.sizes];
        newSizes.splice(index, 1); // Remove the size at the specified index
        setCategoryDts({ ...categoryDts, sizes: newSizes }); // Update the state with the new sizes
        alert('Category size deleted successfully!');
      } else {
        alert('Failed to delete category size.');
      }
    } catch (error) {
      console.error('Error deleting category size:', error);
      alert('An error occurred while deleting the category size.');
    }
  };
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
      sizes,
    } = categoryDts;
  
    if (!id) {
      console.error("No category ID provided.");
      toast.error("Category ID is missing.");
      return;
    }
  
    try {
      const access_token = localStorage.getItem('access');
      if (!access_token) {
        toast.error("Unauthorized. Please login again.");
        return;
      }
  
      const reqHeader = {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'multipart/form-data',
      };
  
      const formData = new FormData();
  
      // Append category fields to formData only if they differ
      if (name !== selectedCategory.name) formData.append("name", name);
      if (heading !== selectedCategory.heading) formData.append("heading", heading);
      if (description !== selectedCategory.description) formData.append("description", description);
      if (offer_id !== selectedCategory.offer_id) formData.append("offer_id", offer_id);
      if (status !== selectedCategory.status) formData.append("status", status ? "yes" : "no");
      if (image && image !== selectedCategory.image) formData.append("image", image);
  
      // Update category details
      const response = await editCategories(id, formData, reqHeader);
  
      if (response.status === 200) {
        toast.success("Category updated successfully");
  
        // Handle sizes update if any sizes are present
        if (sizes && sizes.length > 0) {
          await updateSizes(id, sizes, reqHeader);
        }
  
        // Optionally reload or refresh the category list
        setOpenEditDialog(false);
      } else {
        toast.error(`Failed to update category: ${response.data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("An error occurred while updating the category.");
    }
  };
  
  // Helper function to update sizes
  const updateSizes = async (categoryId, sizes, headers) => {
    try {
      const sizePayload = sizes.map((size) => ({
        size_L_full_length: size.size_L_full_length || "",
        size_L_half_length: size.size_L_half_length || "",
        size_XL_full_length: size.size_XL_full_length || "",
        size_XL_half_length: size.size_XL_half_length || "",
        size_XXL_full_length: size.size_XXL_full_length || "",
        size_XXL_half_length: size.size_XXL_half_length || "",
        size_XXXL_full_length: size.size_XXXL_full_length || "",
        size_XXXL_half_length: size.size_XXXL_half_length || "",
        sleeve_half_length: size.sleeve_half_length || "",
      }));
  
      const sizeResponse = await editCategorysizes(categoryId, sizePayload, headers);
  
      if (sizeResponse.status === 200) {
        toast.success("Sizes updated successfully");
      } else {
        toast.warn("Failed to update some sizes.");
      }
    } catch (error) {
      console.error("Error updating sizes:", error);
      toast.error("An error occurred while updating sizes.");
    }
  };
  
  
  
  

  
  const handleSizeChange = (e, index, field) => {
    const updatedSizes = [...categoryDts.sizes];
    updatedSizes[index][field] = e.target.value;
    setCategoryDts({ ...categoryDts, sizes: updatedSizes });
  };
  

  return (
    <>
    <Dialog maxWidth="md" open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
  <DialogTitle>Edit Category</DialogTitle>
  <DialogContent>
    <Box sx={{ maxWidth: 1600, margin: 'auto', p: 3, border: '1px solid #ccc', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom>Edit Category</Typography>
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
        <Grid item xs={12}>
  <TextField
    fullWidth
    label="Description"
    variant="outlined"
    name="description"
    value={categoryDts.description}
    onChange={handleInputChange}
    multiline
    minRows={4} // Adjust the value to your desired height
  />
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

        {/* Editable Table for Size and Sleeve Length */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Size and Sleeve Length Details</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b> L full length</b></TableCell>
                <TableCell><b> L half length</b></TableCell>
                <TableCell><b> XL full length</b></TableCell>
                <TableCell><b> XL half length</b></TableCell>
                <TableCell><b> XXL full length</b></TableCell>
                <TableCell><b> XXL half length</b></TableCell>
                <TableCell><b> XXXL full length</b></TableCell>
                <TableCell><b> XXXL half length</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
  {categoryDts.sizes && categoryDts.sizes.length > 0 ? (
    categoryDts.sizes.map((size, index) => (
      <TableRow key={index}>
        <TableCell>
          <TextField
            fullWidth
            variant="outlined"
            name={`size_L_full_length_${index}`}
            value={size.size_L_full_length || ''}
            onChange={(e) => handleSizeChange(e, index, 'size_L_full_length')}
          />
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            variant="outlined"
            name={`size_L_half_length_${index}`}
            value={size.size_L_half_length || ''}
            onChange={(e) => handleSizeChange(e, index, 'size_L_half_length')}
          />
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            variant="outlined"
            name={`size_XL_full_length_${index}`}
            value={size.size_XL_full_length || ''}
            onChange={(e) => handleSizeChange(e, index, 'size_XL_full_length')}
          />
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            variant="outlined"
            name={`size_XL_half_length_${index}`}
            value={size.size_XL_half_length || ''}
            onChange={(e) => handleSizeChange(e, index, 'size_XL_half_length')}
          />
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            variant="outlined"
            name={`size_XXL_full_length_${index}`}
            value={size.size_XXL_full_length || ''}
            onChange={(e) => handleSizeChange(e, index, 'size_XXL_full_length')}
          />
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            variant="outlined"
            name={`size_XXL_half_length_${index}`}
            value={size.size_XXL_half_length || ''}
            onChange={(e) => handleSizeChange(e, index, 'size_XXL_half_length')}
          />
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            variant="outlined"
            name={`size_XXXL_full_length_${index}`}
            value={size.size_XXXL_full_length || ''}
            onChange={(e) => handleSizeChange(e, index, 'size_XXXL_full_length')}
          />
        </TableCell>
        <TableCell>
          <TextField
            fullWidth
            variant="outlined"
            name={`size_XXXL_half_length_${index}`}
            value={size.size_XXXL_half_length || ''}
            onChange={(e) => handleSizeChange(e, index, 'size_XXXL_half_length')}
          />
        </TableCell>
        <TableCell>
                  <IconButton onClick={() => handleDeleteSize(index)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell> {/* Delete icon */}
              </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={10} align="center">No sizes for this Category</TableCell>
    </TableRow>
  )}
</TableBody>

          </Table>
        </Grid>
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
