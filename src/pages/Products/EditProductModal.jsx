import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, Box, CircularProgress, Grid, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { editProduct, fetchCategories, fetchSubCategories, viewAllCategories } from '../../services/allApi'; 

function EditProductModal({ open, onClose, product, onChange,reqHeader, onSubmit, categories: propCategories, // Pass categories as props to avoid redundant fetching
}) {
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(product.image || null);
  const [weight, setWeight] = useState('');
  const [weightPrice, setWeightPrice] = useState('');
  const [weights, setWeights] = useState(product.weights || []);
  const [weightQuantity, setWeightQuantity] = useState('');
  const [isWeightInStock, setIsWeightInStock] = useState(true); // Default to in stock
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);  // State for loading spinner
  const [error, setError] = useState(null);  // State for error handling
  const [productData, setProductData] = useState(product);
  const [allcategories, setAllcategories] = useState([])
  const [loading, setLoading] = useState(false);
  const access_token = localStorage.getItem('access');
  const [widthOptions, setWidthOptions] = useState([]); // State for available widths

  // Fetch subcategories whenever the category changes


  // Reset form fields when a different product is loaded or modal is closed


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};


  const handleSave = async () => {
    const reqHeader = {
      'Authorization': `Bearer ${access_token}`,
      // Do NOT set 'Content-Type' manually; let FormData handle it.
    };
  
    setIsLoading(true);
    setError(null);
  
    // Convert productData to FormData for multipart submission
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
      formData.append(key, productData[key]);
    });
  
    try {
      const response = await editProduct(productData.id, formData, reqHeader);
      if (response.success) {
        console.log('Product updated successfully');
        onClose();
      } else {
        setError('Failed to update product. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  const viewallCategories = async () => {
    try {
      const response = await viewAllCategories();
      console.log(response);
      if (response.status === 200) {
        setAllcategories(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  
  useEffect(() => {
    viewallCategories();
  }, []);
  
  const handleProductImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onChange('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Add weights logic
  const handleAddWeight = () => {
    let updatedWeights;
    if (isEditing) {
      // Update the existing weight
      updatedWeights = weights.map((w, index) =>
        index === editIndex
          ? {
              weight,
              price: weightPrice,
              quantity: weightQuantity,
              is_in_stock: isWeightInStock === 'yes',
            }
          : w
      );
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Add a new weight
      updatedWeights = [
        ...weights,
        {
          weight,
          price: weightPrice,
          quantity: weightQuantity,
          is_in_stock: isWeightInStock === 'yes',
        },
      ];
    }
  
    // Update the local state
    setWeights(updatedWeights);
  
    // Pass the updated weights to the parent component
    onChange('weights', updatedWeights);
  
    // Clear the form
    setWeight('');
    setWeightPrice('');
    setWeightQuantity('');
    setIsWeightInStock('yes');
  };
  
  const handleRemoveWeight = (index) => {
    const updatedWeights = weights.filter((_, i) => i !== index);
    setWeights(updatedWeights);
    onChange('weights', updatedWeights); // Pass updated weights to parent component
  };
  
  
  const handleEditWeight = (index) => {
    const weightToEdit = weights[index];
    setWeight(weightToEdit.weight);
    setWeightPrice(weightToEdit.price);
    setWeightQuantity(weightToEdit.quantity);
    setIsWeightInStock(weightToEdit.is_in_stock ? 'yes' : 'no');
    setIsEditing(true);
    setEditIndex(index);
  };
  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    const selectedCategory = allcategories.find(item => item.id === selectedCategoryId);

    // Update `category` in `productData` and clear the width value
    setProductData((prevProduct) => ({
        ...prevProduct,
        category: selectedCategoryId,
        width: "" // Clear the width when category changes
    }));

    // Set available width options based on the selected category's sizes
    if (selectedCategory && selectedCategory.sizes) {
        const widths = selectedCategory.sizes.map(size => size.width);
        setWidthOptions(widths); // Populate the width dropdown
    } else {
        setWidthOptions([]); // Reset if no sizes are available
    }
};




  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
    <DialogTitle>Edit Product</DialogTitle>
    <DialogContent>
      <Grid container spacing={2}>
        {/* Product Name */}
        <Grid item xs={6}>
          <TextField
            margin="dense"
            label="Product Name"
            name="name"
            fullWidth
            variant="outlined"
            value={productData?.name || ''}
            onChange={handleInputChange}
            required
          />
        </Grid>
  
        {/* Category */}
        <Grid item xs={6}>
    <TextField
        fullWidth
        label="Select category"
        variant="outlined"
        select
        required
        onChange={handleCategoryChange}
        value={productData.category} // Use productData here
    >
        {allcategories.length > 0 ? (
            allcategories.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                    {item.name}
                </MenuItem>
            ))
        ) : (
            <MenuItem disabled>No categories</MenuItem>
        )}
    </TextField>
</Grid>
  
        {/* Subcategory */}
        {/* <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" margin="dense" required>
            <InputLabel>Subcategory</InputLabel>
            <Select
              name="sub_category"
              value={product.sub_category || ''}
              onChange={handleInputChange}
              label="Subcategory"
            >
              {subcategories.map((subcat) => (
                <MenuItem key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
   */}
        {/* Price */}
        <Grid item xs={6}>
          <TextField
            margin="dense"
            label="Price"
            name="price"
            fullWidth
            variant="outlined"
            type="number"
            value={product.price || ''}
            onChange={handleInputChange}
            required
          />
        </Grid>
  
        {/* Offer Price */}
        <Grid item xs={6}>
          <TextField
            margin="dense"
            label="Offer Price"
            name="offer_price"
            fullWidth
            variant="outlined"
            type="number"
            value={product.offer_price || ''}
            onChange={handleInputChange}
          />
        </Grid>
  
        {/* Discount */}
        <Grid item xs={6}>
          <TextField
            margin="dense"
            label="Discount (%)"
            name="discount"
            fullWidth
            variant="outlined"
            type="number"
            value={product.discount || ''}
            onChange={handleInputChange}
          />
        </Grid>
  
        {/* Length */}
        <Grid item xs={6}>
          <TextField
            margin="dense"
            label="Length"
            name="Length"
            fullWidth
            variant="outlined"
            value={product.Length || ''}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
    <TextField
        fullWidth
        label="Total Width"
        variant="outlined"
        select
        name="width" // Set name to "width"
        value={productData.width} // Use productData here
        onChange={handleInputChange} // Bind to handleInputChange
    >
        {widthOptions.length > 0 ? (
            widthOptions.map((width, index) => (
                <MenuItem key={index} value={width}>
                    {width}
                </MenuItem>
            ))
        ) : (
            <MenuItem disabled>No widths available</MenuItem>
        )}
    </TextField>
</Grid>
        {/* Is Popular Product */}
        <Grid item xs={6}>
          <FormControl component="fieldset" margin="dense">
            <FormLabel component="legend">Is Popular</FormLabel>
            <RadioGroup
              row
              name="is_popular_product"
              value={product.is_popular_product ? 'yes' : 'no'}
              onChange={handleInputChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
  
        {/* Product Description */}
        <Grid item xs={12}>
          <TextField
            margin="dense"
            label="Product Description"
            name="description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={product.description || ''}
            onChange={handleInputChange}
          />
        </Grid>
  
        {/* Product Image Upload */}
        <Grid item xs={12}>
          <Button variant="contained" component="label" fullWidth>
            Upload Product Image
            <input type="file" hidden onChange={handleProductImageUpload} />
          </Button>
        </Grid>
  
        {/* Image Preview */}
        {imagePreview && (
          <Grid item xs={12}>
            <Box mt={2} textAlign="center">
              <img
                src={imagePreview}
                alt="Selected Product"
                style={{ maxHeight: 200, objectFit: 'contain' }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary" variant="outlined">
        Cancel
      </Button>
      <Button
        onClick={handleSave}
        color="primary"
        variant="contained"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Save'}
      </Button>
    </DialogActions>
  </Dialog>
  
  );
}

export default EditProductModal;