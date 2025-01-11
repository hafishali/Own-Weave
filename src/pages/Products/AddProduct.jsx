import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Grid, CircularProgress, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, Switch, Autocomplete, InputLabel, Select } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import { addProduct, getAlloffers, viewAllCategories, viewallLatestproducts } from '../../services/allApi';

function AddProduct() {

  const [loading, setLoading] = useState(false);
  const [isPopularProduct, setIsPopularProduct] = useState('no');  // default to "no"
  const [isOfferProduct, setIsOfferProduct] = useState('no');      // default to "no"
  const [isInStock, setIsInStock] = useState(true);
  const [productImages, setProductImages] = useState([]); // For multiple images
  const [multipleImagesPreview, setMultipleImagesPreview] = useState([]); // Preview for multiple images
  const [allProducts, setAllProducts] = useState([]);  // Store all products
  const [productSuggestions, setProductSuggestions] = useState([]);  // Store filtered suggestions
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [allcategories, setAllcategories] = useState([])
  const [widthOptions, setWidthOptions] = useState([]); // State for available widths
  const [alloffers, setAlloffers] = useState([])
  const [latestProducts, setLatestProducts] = useState([])


  const [product, setProduct] = useState({
    name: "",
    product_code: "",
    category: "",
    offer_id: "",
    uploaded_images: [],
    sub_category: "",
    width: "",
    wholesale_price_per_meter: "",
    price_per_meter: "",
    offer_price_per_meter: "",
    stock_length: "",
    gsm: "",
    is_popular: "",
    is_offer_product: true,
    description: "",
    fabric: "",
    pattern: "",
    fabric_composition: "",
    fit: "",
    style: "",
    color: ""
  })

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
  const handleMultipleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const selectedImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setProduct((prevState) => ({
      ...prevState,
      uploaded_images: [...prevState.uploaded_images, ...selectedImages.map(img => img.file)]
    }));

    setMultipleImagesPreview((prevPreview) => [
      ...prevPreview,
      ...selectedImages.map(img => img.preview)
    ]);
  };

  const handleDeleteMultipleImage = (index) => {
    setMultipleImagesPreview((prevPreview) =>
      prevPreview.filter((_, i) => i !== index)
    );

    setProduct((prevState) => ({
      ...prevState,
      uploaded_images: prevState.uploaded_images.filter((_, i) => i !== index)
    }));
  };
console.log(product)
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
  const getLatestProducts = async () => {
    try {
      const response = await viewallLatestproducts();
      console.log(response);
      if (response.status === 200) {
        setLatestProducts(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    viewallCategories()
    getLatestProducts()
  }, []);

  const handleCategoryChange = (event) => {
    const selectedCategoryId = event.target.value;
    const selectedCategory = allcategories.find(item => item.id === selectedCategoryId);

    // Update product category and reset width if a new category is selected
    setProduct(prevProduct => ({
      ...prevProduct,
      category: selectedCategoryId,
      width: "" // Reset width when category changes
    }));

    // Set available width options based on the selected category's sizes
    if (selectedCategory && selectedCategory.sizes) {
      const widths = selectedCategory.sizes.map(size => size.width);
      setWidthOptions(widths); // Populate the width dropdown
    } else {
      setWidthOptions([]); // Reset if no sizes are available
    }
  };
  const handleAddProduct = async () => {
    const {
      name, product_code, offer_id, category, uploaded_images, sub_category, width, wholesale_price_per_meter,
      price_per_meter, offer_price_per_meter, stock_length, gsm, is_popular,
      is_offer_product, description, fabric, pattern, fabric_composition, fit,
      style, color
    } = product;

    // Validate required fields
    if (!name || !product_code || !category) {
      toast.error("All fields are mandatory. Please fill out the form completely.");
      return;
    }

    const access_token = localStorage.getItem('access');
    const reqHeader = {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data'
    };

    try {
      console.log("Validation passed. Preparing to send data...");

      // Prepare form data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("product_code", product_code);
      formData.append("category", category);
      if (offer_id) {
        formData.append("offer_id", offer_id);
      }


      uploaded_images.forEach((file, index) => {
        formData.append(`uploaded_images[${index}]`, file);
      });

      formData.append("sub_category", sub_category);
      formData.append("width", width);
      formData.append("wholesale_price_per_meter", wholesale_price_per_meter);

      formData.append("price_per_meter", price_per_meter);
      formData.append("offer_price_per_meter", offer_price_per_meter);
      formData.append("stock_length", stock_length);
      formData.append("gsm", gsm);
      formData.append("is_popular", is_popular);
      formData.append("is_offer_product", is_offer_product);
      // formData.append("description", description);
      formData.append("fabric", fabric);
      formData.append("pattern", pattern);
      formData.append("fabric_composition", fabric_composition);
      formData.append("fit", fit);
      formData.append("style", style);
      // formData.append("color", color);

      const response = await addProduct(formData, reqHeader);
      console.log('Response:', response);

      if (response.status === 201) {
        toast.success("Product added successfully");
        const newProduct = response.data;
        setAllProducts((prevProducts) => [...prevProducts, newProduct]);

        // Reset the form
        setProduct({
          name: "", product_code: "", category: "", sub_category: "",
          uploaded_images: [], width: "", offer: "", price_per_meter: "", wholesale_price_per_meter: "",
          offer_price_per_meter: "", stock_length: "", gsm: "",
          is_popular: "", is_offer_product: true, description: "",
          fabric: "", pattern: "", fabric_composition: "", fit: "",
          style: "", color: ""
        });
        setMultipleImagesPreview([]);
      }
    } catch (error) {
      console.error("Error while adding product:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Display backend error message
      } else {
        // Fallback error message for unexpected cases
        toast.error("Something went wrong while adding the category.");
      }
    }
  };


  const handleRadioChange = (event, fieldName) => {
    const value = event.target.value === 'yes';
    setProduct(prevProduct => ({
      ...prevProduct,
      [fieldName === 'isPopular' ? 'is_popular' : 'is_offer_product']: value
    }));
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
        {/* <Button variant="contained" component="label">
          import excel file
          <input type="file" hidden />
        </Button> */}
      </Box>


      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Autocomplete
            fullWidth
            options={latestProducts.map((product) => product.name)} // Extract names from the objects
            value={product.name}
            onChange={(event, newValue) => {
              setProduct({ ...product, name: newValue || '' });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Product Name"
                variant="outlined"
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value }) // For free typing
                }
              />
            )}
            freeSolo // Allows user to type custom input
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Product Code"
            variant="outlined"
            value={product.product_code}
            onChange={(e) => setProduct({ ...product, product_code: e.target.value })}
          />
        </Grid>

        {/* <Grid item xs={3}>
        <TextField
            fullWidth
            label="Product Color"
            variant="outlined"
           value={product.color}
           onChange={(e) => setProduct({ ...product, color: e.target.value })}
           />
        </Grid> */}
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Select category"
            variant="outlined"
            select
            required
            onChange={handleCategoryChange}
            value={product.category}
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


        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel>Select Offer</InputLabel>
            <Select
              label="Select offer"
              required
              onChange={(e) => setProduct({ ...product, offer_id: e.target.value })}
              value={product.offer_id || ''} // Set default to empty string if offer is null
            >
              {alloffers && alloffers.length > 0 ? (
                alloffers.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No offers</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>


        <Grid container spacing={2}>
          <Grid item xs={12} style={{ marginLeft: '2%', marginTop: '2%' }}>
            <Button variant="contained" component="label">
              Upload Multiple Images
              <input type="file" hidden multiple onChange={handleMultipleImageUpload} />
            </Button>
          </Grid>

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
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            fullWidth
            options={latestProducts.map((product) => product.wholesale_price_per_meter)} // Extract names from the objects
            value={product.wholesale_price_per_meter}
            onChange={(event, newValue) => {
              setProduct({ ...product, wholesale_price_per_meter: newValue || '' });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Wholesale Rate"
                variant="outlined"
                type="number"
                value={product.wholesale_price_per_meter}
                onChange={(e) => setProduct({ ...product, wholesale_price_per_meter: e.target.value })}
              />
            )}
            freeSolo
          />
        </Grid>

        <Grid item xs={3}>
          <Autocomplete
            fullWidth
            options={latestProducts.map((product) => product.price_per_meter)} // Extract names from the objects
            value={product.price_per_meter}
            onChange={(event, newValue) => {
              setProduct({ ...product, price_per_meter: newValue || '' });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Actual price per meterr"
                variant="outlined"
                type="number"
                value={product.price_per_meter}
                onChange={(e) => setProduct({ ...product, price_per_meter: e.target.value })}
              />
            )}
            freeSolo
          />
        </Grid>
        <Grid item xs={3}>
          <Autocomplete
            fullWidth
            options={latestProducts.map((product) => product.offer_price_per_meter)} // Extract names from the objects
            value={product.offer_price_per_meter}
            onChange={(event, newValue) => {
              setProduct({ ...product, offer_price_per_meter: newValue || '' });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Offer Price per meter"
                variant="outlined"
                value={product.offer_price_per_meter}
                onChange={(e) => setProduct({ ...product, offer_price_per_meter: e.target.value })}
              />
            )}
            freeSolo
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            label="stock length"
            variant="outlined"
            type="number"
            value={product.stock_length}
            onChange={(e) => setProduct({ ...product, stock_length: e.target.value })}
          />
        </Grid>
        {/* <Grid item xs={3}>
          <TextField
            fullWidth
            label="Discounted Price (user)"
            variant="outlined"
            type="number"
            value={product.discount_price}
            onChange={(e) => setProduct({ ...product, discount_price: e.target.value })} 
          />
        </Grid> */}
        {/* <Grid item xs={4}>
          <TextField
            fullWidth
            label="Total Length"
            variant="outlined"
            type="number"
            value={product.stock_length}
            onChange={(e) => setProduct({ ...product, stock_length: e.target.value })} 
          />
        </Grid> */}
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Total Width"
            variant="outlined"
            select // Change to select to show dropdown options
            value={product.width}
            onChange={(e) => setProduct({ ...product, width: e.target.value })}
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

        <Grid item xs={4}>
          <Autocomplete
            fullWidth
            options={latestProducts.map((product) => product.gsm)} // Extract names from the objects
            value={product.gsm}
            onChange={(event, newValue) => {
              setProduct({ ...product, gsm: newValue || '' });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="GSM"
                variant="outlined"
                type="number"
                value={product.gsm}
                onChange={(e) => setProduct({ ...product,gsm: e.target.value })}
              />
            )}
            freeSolo
          />
        </Grid>

        <Grid item xs={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Is Popular</FormLabel>
            <RadioGroup
              row
              value={product.is_popular ? 'yes' : 'no'}
              onChange={(e) => handleRadioChange(e, 'isPopular')}
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
              value={product.is_offer_product ? 'yes' : 'no'}
              onChange={(e) => handleRadioChange(e, 'isOfferProduct')}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Description"
            multiline
            rows={4}
            variant="outlined"
            value={product.description}
           
            onChange={(e) => setProduct({ ...product, description: e.target.value })}          />
        </Grid> */}
        {/* <Grid item xs={12}>
          <Typography variant="body1">In Stock</Typography>
          <Switch
            checked={isInStock}
            onChange={(e) => setIsInStock(e.target.checked)}
            color="primary"
          />
        </Grid> */}


        <Grid item xs={12}>
          <Box mt={2}>
            <Typography variant="h6">Product Features:</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Autocomplete
                  fullWidth
                  options={latestProducts.map((product) => product.fabric)} // Extract names from the objects
                  value={product.fabric}
                  onChange={(event, newValue) => {
                    setProduct({ ...product, fabric: newValue || '' });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Fabric"
                      variant="outlined"
                      value={product.fabric}
                      onChange={(e) => setProduct({ ...product, fabric: e.target.value })}
                    />
                  )}
                  freeSolo
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  fullWidth
                  options={latestProducts.map((product) => product.pattern)} // Extract names from the objects
                  value={product.pattern}
                  onChange={(event, newValue) => {
                    setProduct({ ...product, pattern: newValue || '' });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Pattern"
                      variant="outlined"
                      type="text"
                      value={product.pattern}
                      onChange={(e) => setProduct({ ...product, pattern: e.target.value })}

                    />
                  )}
                  freeSolo
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  fullWidth
                  options={latestProducts.map((product) => product.fabric_composition)} // Extract names from the objects
                  value={product.fabric_composition}
                  onChange={(event, newValue) => {
                    setProduct({ ...product, fabric_composition: newValue || '' });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Fabric Composition"
                      variant="outlined"
                      type="text"
                      value={product.fabric_composition}
                      onChange={(e) => setProduct({ ...product, fabric_composition: e.target.value })}
                    />
                  )}
                  freeSolo
                />
              </Grid>

              <Grid item xs={4}>
                <Autocomplete
                  fullWidth
                  options={latestProducts.map((product) => product.fit)} // Extract names from the objects
                  value={product.fit}
                  onChange={(event, newValue) => {
                    setProduct({ ...product, fit: newValue || '' });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Fit"
                      variant="outlined"
                      type="text"
                      value={product.fit}
                      onChange={(e) => setProduct({ ...product, fit: e.target.value })}
                    />
                  )}
                  freeSolo
                />
              </Grid>
              <Grid item xs={4}>
                <Autocomplete
                  fullWidth
                  options={latestProducts.map((product) => product.style)} // Extract names from the objects
                  value={product.style}
                  onChange={(event, newValue) => {
                    setProduct({ ...product, style: newValue || '' });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Style"
                      variant="outlined"
                      type="text"
                      value={product.style}
                      onChange={(e) => setProduct({ ...product, style: e.target.value })}
                    />
                  )}
                  freeSolo
                />

              </Grid>
              {/* <Grid item xs={4}>
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
                
              </Grid> */}
              {/* <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"

                >
                  Add
                </Button>
              </Grid> */}
            </Grid>
          </Box>
        </Grid>

        {/* Display Weights */}
        {/* <Grid item xs={12}>
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
        </Grid> */}
        <Grid item xs={12} mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddProduct}
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
