import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, IconButton, InputAdornment } from '@mui/material';
import { Lock as LockIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { adminLogin } from '../services/allApi'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
 const [adminCredentials,setAdminCredentials]=useState({
  mobile_number:"",
  password:""
 })
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({ mobile_number: '', password: '' });
    setLoading(true);
    try {
      const result = await adminLogin(adminCredentials);
      if ( result.status === 200) {
        console.log(result)
        toast.success("Login Successfull")
        localStorage.setItem('refresh', result.data.token.refresh); 
        localStorage.setItem('access', result.data.token.access);
        navigate('/home')
       
      } else {
        setErrors({ email: 'Invalid credentials', password: 'Invalid credentials' });
       
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("something went wrong")
      setErrors({ email: 'Invalid Username or Password', password: 'Invalid Password or Username' });
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Container component="main" maxWidth="xs">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, p: 3 }}>
          <LockIcon sx={{ m: 1, fontSize: 60 }} />
          <Typography component="h1" variant="h5">Admin Login</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="mobile"
              label="mobile"
              name="mobile"
              autoComplete="mobile"
              autoFocus
              value={adminCredentials.mobile_number}
              onChange={(e) => setAdminCredentials({...adminCredentials,mobile_number:e.target.value})}
              helperText={errors.mobile_number}
              error={!!errors.mobile_number}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={adminCredentials.password}
              onChange={(e) => setAdminCredentials({...adminCredentials,password:e.target.value})}
              helperText={errors.password}
              error={!!errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Sign In'}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
