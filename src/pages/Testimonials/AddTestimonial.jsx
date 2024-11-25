
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, TextField, Button, Typography, Grid, Alert, FormControl, MenuItem, Select, InputLabel, Radio, FormControlLabel, RadioGroup, FormLabel, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, DialogActions, DialogContent, DialogTitle, Dialog, DialogContentText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { addTestimonials, DeleteTestimonials, EditTestimonials, getTestimonials } from '../../services/allApi';


function AddTestimonial() {
    const [imagePreview, setImagePreview] = useState(null);
    const [allTestimonials, setAllTestimonials] = useState([])
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState("")
    const [addTestimonial, setAddTestimonial] = useState({
        youtube_link: "",
        thumbnail: imagePreview ? imagePreview : ""
    })

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAddTestimonial({ ...addTestimonial, thumbnail: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleDeleteMainImage = () => {
        setImagePreview(null);
        setAddTestimonial({ ...addTestimonial, thumbnail: "" });
    };

    const handleGetTestimonial = async () => {
        try {
            const response = await getTestimonials()
            if (response.status === 200) {
                setAllTestimonials(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleGetTestimonial()
    }, [])

    const handleAddtestimonilas = async () => {
        try {
            const { youtube_link, thumbnail } = addTestimonial;

            if (!youtube_link || !thumbnail) {
                toast.error("All fields are required");
                return;
            }

            // Prepare FormData
            const formData = new FormData();
            formData.append("youtube_link", youtube_link);
            formData.append("thumbnail", thumbnail);

            const response = await addTestimonials(formData);

            if (response.status === 201) {
                toast.success("Testimonial added successfully");
                setAddTestimonial({
                    youtube_link: "",
                    thumbnail: "",
                });
                setImagePreview(null);
                handleGetTestimonial()
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const handleEditChange = (item) => {
        setSelectedTestimonial(item);
        setImagePreview(item.thumbnail); // Set the current image as preview
        setAddTestimonial({
            youtube_link: item.youtube_link,
            thumbnail: item.thumbnail,
        });
        setOpenEditDialog(true);
    };

    const handleCancel = () => {
        setAddTestimonial({
            youtube_link: "",
            thumbnail: "",
        })
        setOpenEditDialog(false)
    }

    const handleEditSave = async () => {
        try {
            const formData = new FormData();
            formData.append("youtube_link", addTestimonial.youtube_link);
            if (addTestimonial.thumbnail instanceof File) {
                formData.append("thumbnail", addTestimonial.thumbnail);
            }
            const response = await EditTestimonials(selectedTestimonial.id, formData);
            if (response.status === 200) {
                toast.success("Testimonial updated successfully");
                setOpenEditDialog(false);
                handleGetTestimonial();
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to update testimonial");
        }
    };

    const handleDelete = (item) => {
        setSelectedTestimonial(item)
        setOpenDeleteDialog(true)
    }
   const  handleCanceldelete=()=>{
        setSelectedTestimonial(null)
        setOpenDeleteDialog(false)
    }

    const handleConfirmDelete = async () => {
        try {
            const response = await DeleteTestimonials(selectedTestimonial.id)
            if (response.status === 204) {
                toast.success("Testimonial deleted successfully")
                getTestimonials()
                handleCanceldelete()
            }
        } catch (error) {
            console.log(error)
            toast.error("something went wrong at deleting")
        }
    }
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Youtube Link"
                        variant="outlined"
                        value={addTestimonial.youtube_link}
                        onChange={(e) => setAddTestimonial({ ...addTestimonial, youtube_link: e.target.value })}
                    />
                </Grid>
                <Grid item xs={6}>
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

                    <Button style={{ marginTop: '3%' }}
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleAddtestimonilas}

                    >
                        Add
                    </Button>

                    <hr />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ backgroundColor: "lightblue" }}>
                                <TableRow>
                                    <TableCell><b>SI Number</b></TableCell>
                                    <TableCell><b>Thumbnail</b></TableCell>
                                    <TableCell><b>Link</b></TableCell>
                                    <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allTestimonials && allTestimonials.length > 0 ? allTestimonials.map((item, index) => (<TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell><img
                                        src={item.thumbnail}
                                        alt='thumbnail'
                                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                                    /></TableCell>
                                    <TableCell><a href={item.youtube_link} target='blank'>{item.youtube_link}</a></TableCell>



                                    <TableCell style={{ textAlign: 'center' }}>
                                        <IconButton color="primary" onClick={() => handleEditChange(item)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={()=>handleDelete(item)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>)) : <TableRow>No Testimonials Yet</TableRow>}


                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            {/* modal for edit */}
            <Dialog maxWidth="sm" open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Youtube Link"
                                variant="outlined"
                                value={addTestimonial.youtube_link}
                                onChange={(e) =>
                                    setAddTestimonial({ ...addTestimonial, youtube_link: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component="label">
                                Upload New Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setAddTestimonial({ ...addTestimonial, thumbnail: file });
                                            setImagePreview(URL.createObjectURL(file));
                                        }
                                    }}
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
                                        onClick={() => {
                                            setImagePreview(null);
                                            setAddTestimonial({ ...addTestimonial, thumbnail: "" });
                                        }}
                                        size="small"
                                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleCancel} color="secondary">Cancel</Button>
                    <Button onClick={handleEditSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>

            {/* modal for delete */}
            <Dialog open={openDeleteDialog} onClose={handleCanceldelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this customer? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCanceldelete} color="primary">
                        Cancel
                    </Button>
                    <Button color="secondary" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>


            <ToastContainer />
        </>
    )
}

export default AddTestimonial
