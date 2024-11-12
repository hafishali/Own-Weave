import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Alert,FormControl,MenuItem,Select,InputLabel,Radio,FormControlLabel,RadioGroup,FormLabel ,IconButton} from '@mui/material';
import {  getAlloffers ,addCategories } from '../../services/allApi';
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
  const [categoryDts,setCategoryDts]=useState({
    name:"",
    heading:"",
    description:"",
    offer_id:"",
    image:imagePreview?imagePreview:"",
    status:true,
    size_S_length:"",
    size_M_length:"",
    size_L_length:"",
    size_XL_length:"",
    size_XXL_length:"",
    size_XXXL_length:"",
    size_4XL_length:"",
    sleeve_full_length:"",          
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

  // add category

  const handleAddCategories = async () => {
    const { 
      name, heading, description, offer_id, image, status, 
      size_S_length, size_M_length, size_L_length, size_XL_length, 
      size_XXL_length, size_XXXL_length, size_4XL_length,sleeve_half_length,sleeve_full_length 
    } = categoryDts;
    if (!name || !heading || !description || !image 
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
      formData.append("name", name);
      formData.append("heading", heading);
      formData.append("description", description);
      formData.append("offer_id", offer_id);
      formData.append("image", image); 
      formData.append("status", status);
      formData.append("size_S_length", size_S_length);
      formData.append("size_M_length", size_M_length);
      formData.append("size_L_length", size_L_length);
      formData.append("size_XL_length", size_XL_length);
      formData.append("size_XXL_length", size_XXL_length);
      formData.append("size_XXXL_length", size_XXXL_length);
      formData.append("size_4XL_length", size_4XL_length);
      formData.append("sleeve_full_length", sleeve_full_length);
      formData.append("sleeve_half_length", sleeve_half_length);
  
      const response = await addCategories(formData,reqHeader);
      console.log('Response:', response);
  
      if (response.status === 201) {
        toast.success("Category added successfully");
        setCategoryDts({
          name: "",
          heading: "",
          description: "",
          offer: "",
          image: imagePreview ? imagePreview : "",
          status: true,
          size_S_length: "",
          size_M_length: "",
          size_L_length: "",
          size_XL_length: "",
          size_XXL_length: "",
          size_XXXL_length: "",
          size_4XL_length: "",
          sleeve_full_length:"",          
          sleeve_half_length:""


        });
        setImagePreview(null);
      }
    } catch (error) {
      console.error("Error while adding category:", error);
      toast.error("Something went wrong while adding the category.");
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
</Grid>
        <Grid item xs={3}>
        <InputLabel>Size of S</InputLabel>
          <TextField
            fullWidth
           
            variant="outlined"
           
            onChange={(e) => setCategoryDts({ ...categoryDts, size_S_length: e.target.value })}
            value={categoryDts.size_S_length}
          />
        </Grid>
        <Grid item xs={3}>
        <InputLabel>Size of M</InputLabel>
          <TextField
            fullWidth
            
            variant="outlined"
           
            onChange={(e) => setCategoryDts({ ...categoryDts, size_M_length: e.target.value })}
            value={categoryDts.size_M_length}
          />
        </Grid>
        <Grid item xs={3}>
        <InputLabel>Size of L</InputLabel>
          <TextField
            fullWidth
            variant="outlined"
            onChange={(e) => setCategoryDts({ ...categoryDts, size_L_length: e.target.value })}
            value={categoryDts.size_L_length}
          />
        </Grid>
        <Grid item xs={3}>
        <InputLabel>Size of XL</InputLabel>
          <TextField
            fullWidth
           
            variant="outlined"
            onChange={(e) => setCategoryDts({ ...categoryDts, size_XL_length: e.target.value })}
            value={categoryDts.size_XL_length}
          />
        </Grid>
        <Grid item xs={2}>
        <InputLabel>Size of XXL</InputLabel>
          <TextField
            fullWidth
           
            variant="outlined"
            onChange={(e) => setCategoryDts({ ...categoryDts, size_XXL_length: e.target.value })}
            value={categoryDts.size_XXL_length}
          />
        </Grid>
        <Grid item xs={2}>
        <InputLabel>Size of XXXL</InputLabel>
          <TextField
            fullWidth
           
            variant="outlined"
            onChange={(e) => setCategoryDts({ ...categoryDts, size_XXXL_length: e.target.value })}
            value={categoryDts.size_XXXL_length}
          />
        </Grid>
        <Grid item xs={2}>
        <InputLabel>Size of 4XL</InputLabel>
          <TextField
            fullWidth
            variant="outlined"
            onChange={(e) => setCategoryDts({ ...categoryDts, size_4XL_length: e.target.value })}
            value={categoryDts.size_4XL_length}
          />
        </Grid>
        <Grid item xs={2}>
        <InputLabel>Size of Full Sleeve</InputLabel>
          <TextField
            fullWidth
            variant="outlined"
            onChange={(e) => setCategoryDts({ ...categoryDts, sleeve_full_length: e.target.value })}
            value={categoryDts.sleeve_full_length}
          />
        </Grid>
        <Grid item xs={2}>
        <InputLabel>Size of Half Sleeve</InputLabel>
          <TextField
            fullWidth
            variant="outlined"
            onChange={(e) => setCategoryDts({ ...categoryDts, sleeve_half_length: e.target.value })}
            value={categoryDts.sleeve_half_length}
          />
        </Grid>
        
        


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
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleAddCategories}
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
