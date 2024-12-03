import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, Box, CircularProgress, Grid, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { editProduct, fetchCategories, fetchSubCategories, getAlloffers, viewAllCategories } from '../../services/allApi'; 

function EditProductModal({ open, onClose, product, onChange,reqHeader, onSubmit, categories: propCategories, 
}) {
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(product.image || null);
 
  const [isLoading, setIsLoading] = useState(false);  // State for loading spinner
  const [error, setError] = useState(null);  // State for error handling
  const [allcategories, setAllcategories] = useState([])
  const [loading, setLoading] = useState(false);
  const access_token = localStorage.getItem('access');
  const [widthOptions, setWidthOptions] = useState([]); // State for available widths
  const [alloffers, setAlloffers] = useState([])

  // Fetch subcategories whenever the category changes


  // Reset form fields when a different product is loaded or modal is closed

  const [productData, setProductData] = useState({
    ...product,  // Spread the product object
    discount: product.offer?.name || '',  // Initialize discount field
    offer_product: product.offer_product ? 'yes' : 'no',  // Initialize radio button based on offer_product boolean
  });
const viewallOffers = async () => {
  try {
    const response = await getAlloffers()
    console.log(response)
    if (response.status === 200) {
      setAlloffers(response.data)
    }
  } catch (error) {
    console.log(error)
  }
}
useEffect(() => {
  viewallOffers()
}, [])

const handleInputChange = (e) => {
  const { name, value } = e.target;

  setProductData((prevState) => ({
    ...prevState,
    [name]: name === "offer_id" ? Number(value) : value === "yes" ? true : value === "no" ? false : value,
  }));
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
  

  
  

  const handleEditImage = (index) => {
    setProductData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index].isEditing = true; // Mark image as being edited
      return { ...prev, images: updatedImages };
    });
  };
  
  const handleReplaceImage = (index, newFile) => {
    setProductData((prev) => {
      const updatedImages = [...prev.images];
      const imageId = updatedImages[index]?.id; // Get the ID of the image being replaced
  
      const updatedDeleteIds = imageId
        ? [...(prev.delete_image_ids || []), imageId] // Add the old image ID to delete list
        : prev.delete_image_ids || []; // If no ID, keep the existing list
  
      updatedImages[index] = {
        image: URL.createObjectURL(newFile), // Temporary preview for UI
        file: newFile, // New file to upload
      };
  
      return {
        ...prev,
        images: updatedImages,
        delete_image_ids: updatedDeleteIds, // Update delete IDs
      };
    });
  };
  
  
  
  
  
  const handleDeleteImage = (index) => {
    setProductData((prev) => {
      const imageId = prev.images[index]?.id; // Get the ID of the image being deleted
  
      const updatedImages = prev.images.filter((_, imgIndex) => imgIndex !== index); // Remove image
  
      const updatedDeleteIds = imageId
        ? [...(prev.delete_image_ids || []), imageId] // Add ID to delete list if it exists
        : prev.delete_image_ids || []; // Keep the existing list if no ID
  
      return {
        ...prev,
        images: updatedImages,
        delete_image_ids: updatedDeleteIds, // Update delete IDs
      };
    });
  };
  
  
  
  
  
  const fileInputRef = React.useRef();

const handleAddImage = (newFile) => {
  setProductData((prev) => ({
    ...prev,
    images: [
      ...prev.images,
      { image: URL.createObjectURL(newFile), file: newFile },
    ],
  }));
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

const handleSave = async () => {
  const formData = new FormData();

  // Add product data (excluding images and delete IDs)
  Object.keys(productData).forEach((key) => {
    if (key !== 'images' && key !== 'delete_image_ids') {
      formData.append(key, productData[key]);
    }
  });

  // Add new images
  productData.images.forEach((img) => {
    if (img.file instanceof File) {
      formData.append('uploaded_images', img.file);
    }
  });

  // Add existing image URLs directly
  productData.images
    .filter((img) => !(img.file instanceof File))
    .forEach((img) => {
      formData.append('existing_images', img.image);
    });

  // Add delete image IDs as a JSON array
  if (productData.delete_image_ids?.length > 0) {
    productData.delete_image_ids.forEach((id) => {
      formData.append('delete_image_ids', id); // Add each ID as a separate entry
    });
  }
  

  console.log('FormData contents:');
  formData.forEach((value, key) => {
    console.log(key, value);
  });

  try {
    const response = await editProduct(productData.id, formData, {
      Authorization: `Bearer ${access_token}`,
    });

    if (response.status === 200) {
      console.log('Product updated successfully');
      setProductData((prev) => ({
        ...prev,
        ...response.data,
      }));
      onClose();
    } else {
      throw new Error('Failed to update product.');
    }
  } catch (error) {
    console.error('Error:', error);
    setError('An error occurred while updating the product.');
  } finally {
    setIsLoading(false);
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
            name="price_per_meter"
            fullWidth
            variant="outlined"
            type="number"
            value={productData?.price_per_meter || ''}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="dense"
            label="Offer price"
            name="offer_price_per_meter"
            fullWidth
            variant="outlined"
            type="number"
            value={productData?.offer_price_per_meter || ''}
            onChange={handleInputChange}
            required
          />
        </Grid>
        {/* Offer Price */}
        <Grid item xs={6}>
          <TextField
            margin="dense"
            label="Offer Price"
            name="offer_price_per_meter"
            fullWidth
            variant="outlined"
            type="number"
            value={productData?.offer_price_per_meter || ''}
            onChange={handleInputChange}
          />
        </Grid>
  
        <Grid item xs={6}>
  <TextField
    margin="dense"
    label="Select Offer"
    name="offer_id" // Ensure this matches the key in productData
    fullWidth
    select
    variant="outlined"
    value={product.offer_id} // Ensure this reflects the selected offer
    onChange={handleInputChange}
  >
    {alloffers && alloffers.length > 0 ? (
      alloffers.map((item) => (
        <MenuItem key={item.id} value={item.id}>
          {item.name}
        </MenuItem>
      ))
    ) : (
      <MenuItem disabled>No offers available</MenuItem>
    )}
  </TextField>
</Grid>





  
        {/* Length */}
        <Grid item xs={6}>
          <TextField
            margin="dense"
            label="Stock Length"
            name="stock_length"
            fullWidth
            variant="outlined"
            value={productData?.stock_length || ''}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            margin="dense"
            label="GSM"
            name="gsm"
            fullWidth
            variant="outlined"
            value={productData?.gsm || ''}
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
        name="is_popular"
        value={productData.is_popular ? 'yes' : 'no'}
        onChange={handleInputChange}
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  </Grid>

  {/* Is Offer */}
  <Grid item xs={6}>
    <FormControl component="fieldset" margin="dense">
      <FormLabel component="legend">Is Offer</FormLabel>
      <RadioGroup
        row
        name="is_offer_product"
        value={productData.is_offer_product ? 'yes' : 'no'}
        onChange={handleInputChange}
      >
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
    </FormControl>
  </Grid>

  <Grid item xs={12}>
  <Typography variant="h6">Images</Typography>
  <Grid container spacing={2}>
    {productData.images?.map((image, index) => (
      <Grid item xs={3} key={index}>
        <Box position="relative">
          <img
            src={image?.image || 'placeholder-image.jpg'}
            alt={`Product Image ${index + 1}`}
            style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }}
          />
          <Box position="absolute" top={8} right={8}>
            {/* Delete Icon */}
            <IconButton
              onClick={() => handleDeleteImage(index)}
              color="secondary"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Grid>
    ))}
    {/* Add New Image */}
    <Grid item xs={3}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height={100}
        border="1px dashed #ccc"
        borderRadius={8}
        sx={{ cursor: 'pointer' }}
        onClick={() => fileInputRef.current.click()}
      >
        <Button color="primary" >add</Button>
      </Box>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => handleAddImage(e.target.files[0])}
      />
    </Grid>
  </Grid>
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
            value={productData?.description || ''}
            onChange={handleInputChange}
          />
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