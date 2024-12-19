import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Alert,FormControl,MenuItem,Select,InputLabel,Radio,FormControlLabel,RadioGroup,FormLabel ,IconButton} from '@mui/material';
import {  getAlloffers ,addCategories,addCategorysizes,viewAllCategories} from '../../services/allApi';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function AddCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [alloffers, setAlloffers] = useState([])
  const [allcategories, setAllcategories] = useState([])

  const [categoryDts,setCategoryDts]=useState({
    name:"",
    heading:"",
    description:"",
    offer_id:"",
    image:imagePreview?imagePreview:"",
    status:true,
  
  })
  const [categorysizes,setCategorysizes]=useState({
    category:"",
    width:"",
    size_L_full_length:"",
    size_L_half_length:"",
    size_XL_full_length:"",
    size_XL_half_length:"",
    size_XXL_full_length:"",
    size_XXL_half_length:"",
    size_XXXL_full_length:"",
    size_XXXL_half_length:"",          
    sleeve_half_length:""
  })
  const handleImageChange = (e) => {
    const file = e.target.files[0];
   
    if (file) {
      setCategoryDts({ ...categoryDts, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteMainImage=()=>{
    setImagePreview(null)
    setCategoryDts({ ...categoryDts, image: "" });
  }

  // get offers
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

  const viewallCategories = async () => {
    try {
      const response = await viewAllCategories()
      console.log(response)
      if (response.status === 200) {
        setAllcategories(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    viewallCategories()
  }, [])

  // add category

  const handleAddCategories = async () => {
    const { name, heading, description, offer_id, image, status } = categoryDts;
  
    // Validate input fields
    if (!name || !heading || !description || !image) {
      toast.error("All fields are mandatory. Please fill out the form completely.");
      return;
    }
  
    const acces_token = localStorage.getItem('access');
    const reqHeader = {
      'Authorization': `Bearer ${acces_token}`,
      'Content-Type': 'multipart/form-data'
    };
  
    try {
      console.log("Validation passed. Preparing to send data...");
  
      // Prepare form data
      const formData = new FormData();
      formData.append("name", name);
      formData.append("heading", heading);
      formData.append("description", description);
      if (offer_id) {
        formData.append("offer_id", offer_id);
      }
      formData.append("image", image); 
      formData.append("status", status);
  
      // Send API request to add category
      const response = await addCategories(formData, reqHeader);
      console.log('Response:', response);
  
      if (response.status === 201) {
        toast.success("Category added successfully");
  
        // Assuming the API response contains the newly added category's details
        const newCategory = response.data;
  
        // Update allcategories to include the newly added category
        setAllcategories((prevCategories) => [...prevCategories, newCategory]);
  
        // Reset the form fields
        setCategoryDts({
          name: "",
          heading: "",
          description: "",
          offer: "",
          image: imagePreview ? imagePreview : "",
          status: true,
        });
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error while adding category:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Display backend error message
      } else {
        // Fallback error message for unexpected cases
        toast.error("Something went wrong while adding the category.");
      }
    }
  };
  
  const handleAddCategorysizes = async () => {
    const { 
      category,width,
      size_L_full_length, size_L_half_length, size_XL_full_length, size_XL_half_length, 
      size_XXL_full_length, size_XXL_half_length, size_XXXL_full_length,sleeve_half_length,size_XXXL_half_length 
    } = categorysizes;
    if (!category || !width
        ) {
      toast.error("All fields are mandatory. Please fill out the form completely.");
      return;
    }
    const acces_token=localStorage.getItem('access')
    const reqHeader={
      'Authorization': `Bearer ${acces_token}`,
      'Content-Type':'multipart/form-data'
    }
  
    try {
      console.log("Validation passed. Preparing to send data...");
  
      const formData = new FormData();
      formData.append("category", category);
      formData.append("width", width);
      formData.append("size_L_full_length", size_L_full_length);
      formData.append("size_L_half_length", size_L_half_length);
      formData.append("size_XL_full_length", size_XL_full_length);
      formData.append("size_XL_half_length", size_XL_half_length);
      formData.append("size_XXL_full_length", size_XXL_full_length);
      formData.append("size_XXL_half_length", size_XXL_half_length);
      formData.append("size_XXXL_full_length", size_XXXL_full_length);
      formData.append("size_XXXL_half_length", size_XXXL_half_length);
      formData.append("sleeve_half_length", sleeve_half_length);
  
      const response = await addCategorysizes(formData,reqHeader);
      console.log('Response:', response);
  
      if (response.status === 201) {
        toast.success("Category size added successfully");
        setCategorysizes({
          width:"",
          category:"",
          size_L_full_length: "",
          size_L_half_length: "",
          size_XL_full_length: "",
          size_XL_half_length: "",
          size_XXL_full_length: "",
          size_XXL_half_length: "",
          size_XXXL_full_length: "",
          size_XXXL_half_length:"",          
          sleeve_half_length:""


        });
      }
    } catch (error) {
      console.error("Error while adding category:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Display backend error message
      } else {
        // Fallback error message for unexpected cases
        toast.error("Something went wrong while adding the category.");
      }
    }
  };
  

console.log(categoryDts)
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
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Category Name"
            variant="outlined"
            value={categoryDts.name}
            onChange={(e) => setCategoryDts({ ...categoryDts, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label="Heading"
            variant="outlined"
            onChange={(e) => setCategoryDts({ ...categoryDts, heading: e.target.value })}
            value={categoryDts.heading}
          />
        </Grid>
        {/* <Grid item xs={2}>
        <FormControl component="fieldset">
            <FormLabel component="legend">In Stock</FormLabel>
            <RadioGroup
              row

            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid> */}
       <Grid item xs={4}>
  <FormControl fullWidth>
    <InputLabel>Select Offer</InputLabel>
    <Select
      label="Select offer"
      required
      onChange={(e) => setCategoryDts({ ...categoryDts, offer_id: e.target.value })}
      value={categoryDts.offer_id}
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
              onChange={handleImageChange}
           
            />
          </Button>
        </Grid>
        <Grid item xs={12}>
  {imagePreview && (
    <Box mt={2} textAlign="center" position="relative">
      <img 
        src={imagePreview} 
        alt="Selected Category" 
        style={{ maxHeight: 200, objectFit: 'contain' }} 
      />
      <IconButton
        onClick={handleDeleteMainImage}
        size="small"
        sx={{
          position: 'relative',
          top: 0, 
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  )}
   <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Description"
            multiline
            rows={4}
            variant="outlined"
            onChange={(e) => setCategoryDts({ ...categoryDts, description: e.target.value })}
            value={categoryDts.description}
          />
        </Grid>
  <Button  style={{marginTop:'3%'}}
  fullWidth
  variant="contained"
  color="primary"
  onClick={handleAddCategories}
>
  Add
</Button>
</Grid>
<Grid item xs={3}>
  <InputLabel>Select Category</InputLabel>
  <TextField
    fullWidth
    variant="outlined"
    select
    required
    onChange={(e) => setCategorysizes({ ...categorysizes, category: e.target.value })}
    value={categorysizes.category}
  >
    {allcategories && allcategories.length > 0 ? (
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

<Grid item xs={3}>
        <InputLabel>Width</InputLabel>
          <TextField
            fullWidth
           
            variant="outlined"
           
            onChange={(e) => setCategorysizes({ ...categorysizes, width: e.target.value })}
            value={categorysizes.width}
          />
        </Grid>



{/* Sizes for XL, XXL, XXXL, 4XL, etc. (separate full and half lengths) */}
{[  'XL', 'XXL', 'XXXL'].map((size) => (
  <React.Fragment key={size}>
    <Grid item xs={2}>
      <InputLabel>{`Size of ${size} (Full Length)`}</InputLabel>
      <TextField
        fullWidth
        variant="outlined"
        onChange={(e) =>
          setCategorysizes({
            ...categorysizes,
            [`size_${size.replace(' ', '_').toUpperCase()}_full_length`]: e.target.value,
          })
        }
        value={categorysizes[`size_${size.replace(' ', '_').toUpperCase()}_full_length`] || ''}
        placeholder={`Enter full length for ${size}`}
      />
    </Grid>
    <Grid item xs={2}>
      <InputLabel>{`Size of ${size} (Half Length)`}</InputLabel>
      <TextField
        fullWidth
        variant="outlined"
        onChange={(e) =>
          setCategorysizes({
            ...categorysizes,
            [`size_${size.replace(' ', '_').toUpperCase()}_half_length`]: e.target.value,
          })
        }
        value={categorysizes[`size_${size.replace(' ', '_').toUpperCase()}_half_length`] || ''}
        placeholder={`Enter half length for ${size}`}
      />
    </Grid>
  </React.Fragment>
))}

       
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleAddCategorysizes}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <ToastContainer/>
    </Box>
  );
}

export default AddCategory;
