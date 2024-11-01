import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Grid, CircularProgress, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, Switch, Autocomplete,InputLabel,Select } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';

function AddProduct() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState(''); // State for subcategory
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // State for subcategories
  const [actualPrice, setActualPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [weightMeasurement, setWeightMeasurement] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPopularProduct, setIsPopularProduct] = useState('no');  // default to "no"
  const [isOfferProduct, setIsOfferProduct] = useState('no');      // default to "no"
  const [isInStock, setIsInStock] = useState(true);
  const [productImages, setProductImages] = useState([]); // For multiple images
  const [multipleImagesPreview, setMultipleImagesPreview] = useState([]); // Preview for multiple images
  const [allProducts, setAllProducts] = useState([]);  // Store all products
  const [productSuggestions, setProductSuggestions] = useState([]);  // Store filtered suggestions
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [weightQuantity, setWeightQuantity] = useState('');
  const [isWeightInStock, setIsWeightInStock] = useState(true); // Default to in stock








  // New state for weights
  const [weight, setWeight] = useState('');
  const [weightPrice, setWeightPrice] = useState('');
  const [weights, setWeights] = useState([]);






  const handleProductImageUpload = (event) => {
    const file = event.target.files[0];
    setProductImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleMultipleImageUpload = (event) => {
    const files = event.target.files;
    const selectedImages = Array.from(files);
    setProductImages(selectedImages);

    const previews = selectedImages.map((file) => URL.createObjectURL(file));
    setMultipleImagesPreview(previews);
  };









  const handleDeleteMainImage = () => {
    setImagePreview(null); // Clears the main product image preview
  };

  const handleDeleteMultipleImage = (index) => {
    setMultipleImagesPreview((prev) => prev.filter((_, i) => i !== index)); // Removes the selected image by index
  };



  return (
    <Box
      sx={{
        maxWidth: 1600,
        margin: 'auto',
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }} >
        <Typography variant="h4" gutterBottom>
          <b>Add Product</b>
        </Typography>
        <Button variant="contained" component="label">
          import excel file
          <input type="file" hidden />
        </Button>
      </Box>


      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Autocomplete
            freeSolo
            options={['product']} // Add your options here
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Product Name"
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            label="Category"
            variant="outlined"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >

            <MenuItem >

            </MenuItem>

          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            label="Subcategory"
            variant="outlined"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          >

            <MenuItem >

            </MenuItem>


            <MenuItem value="" disabled>
              No subcategories available
            </MenuItem>

          </TextField>
        </Grid>


        <Grid item xs={6}>
          <Button variant="contained" component="label">
            Upload Main Product Image
            <input type="file" hidden onChange={handleProductImageUpload} />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" component="label">
            Upload Multiple Images
            <input type="file" hidden multiple onChange={handleMultipleImageUpload} />
          </Button>
        </Grid>
        {imagePreview && (
          <Grid item xs={12}>
            <Box mt={2} textAlign="center" position="relative" display="inline-block">
              <img
                src={imagePreview}
                alt="Selected Product"
                style={{ maxHeight: 200, objectFit: 'contain' }}
              />
              <IconButton
                onClick={handleDeleteMainImage}
                size="small"
                sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        )}

        {multipleImagesPreview.length > 0 && (
          <Grid item xs={12}>
            <Box mt={2} textAlign="center">
              {multipleImagesPreview.map((imageSrc, index) => (
                <Box key={index} position="relative" display="inline-block" mx={1}>
                  <img
                    src={imageSrc}
                    alt={`Selected Product ${index}`}
                    style={{ maxHeight: 100, margin: 5, objectFit: 'contain' }}
                  />
                  <IconButton
                    onClick={() => handleDeleteMultipleImage(index)}
                    size="small"
                    sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
        )}

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Actual Price per meter"
            variant="outlined"
            type="number"
            value={actualPrice}
            onChange={(e) => setActualPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Length"
            variant="outlined"

          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Discount Percentage"
            variant="outlined"
            type="number"

          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Offer Price"
            variant="outlined"
            type="number"

          />
        </Grid>

        <Grid item xs={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Is Popular</FormLabel>
            <RadioGroup
              row

            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Is Offer Product</FormLabel>
            <RadioGroup
              row

            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Description"
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">In Stock</Typography>
          <Switch
            checked={isInStock}
            onChange={(e) => setIsInStock(e.target.checked)}
            color="primary"
          />
        </Grid>


        <Grid item xs={12}>
          <Box mt={2}>
            <Typography variant="h6">Product Features:</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Fabric"
                  variant="outlined"

                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Pattern"
                  variant="outlined"
                  type="text"


                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Fabric Composition"
                  variant="outlined"
                  type="text"
                />
              </Grid>
             
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Fit"
                    variant="outlined"
                    type="text"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Style"
                    variant="outlined"
                    type="text"
                  />
                
              </Grid>
              <Grid item xs={4}>
              <FormControl fullWidth>
              <InputLabel>Select Sleeve Type</InputLabel>
              <Select
                label="Select offer"
                required
              >
                
                  <MenuItem >
                    Full Sleeve
                  </MenuItem>
                  <MenuItem >
                    Half Sleeve
                  </MenuItem>
                
              </Select>
            </FormControl>
                
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"

                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Display Weights */}
        <Grid item xs={12}>
          {weights.map((w, index) => ( // Use weights directly
            <Box
              key={index} // Use index as the key (if weights don't have a unique ID)
              mt={2}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid #ccc',
                p: 2,
                borderRadius: 1,
              }}
            >
              <Typography>
                Weight: {w.weight} - Price: {w.price} - Quantity: {w.quantity} - In Stock: {w.is_in_stock ? "Yes" : "No"}
              </Typography>
              <IconButton
                aria-label="delete"
              // Pass the index directly
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Grid>
        <Grid item xs={12} mt={2}>
          <Button
            variant="contained"
            color="primary"

            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Product'}
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
}

export default AddProduct;
