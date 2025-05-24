import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Container, Paper, Alert, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you'll use React Router for navigation
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5134/api';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // General error for API responses or password mismatch
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('Email is required.');
      return false;
    }
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required.');
      return false;
    }
    if (password.length <= 6) {
      setPasswordError('Password must be longer than 6 characters.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear general error
    setSuccessMessage('');

    // Perform client-side validation
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (password !== confirmPassword) {
      setError('Passwords do not match'); // Keep this for confirm password
      // It might be better to have a separate confirmPasswordError state if more granular control is needed
      return;
    }

    if (!isEmailValid || !isPasswordValid) {
      return; // Stop submission if client-side validation fails
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, {
        email,
        password,
        confirmPassword, // Added confirmPassword
      });
      setSuccessMessage('Sign up successful! Redirecting to login...');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        // Handle API errors (e.g., validation errors from backend)
        if (err.response.data && typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data && err.response.data.errors) {
          // Example: ASP.NET Core Identity error format
          const messages = Object.values(err.response.data.errors).flat();
          setError(messages.join('\n'));
        } else {
          setError('Sign up failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
        <Typography component="h1" variant="h5" color="primary" fontWeight="bold">
          Sign Up
        </Typography>
        {successMessage && (
          <Alert severity="success" sx={{ width: '100%', mt: 2 }}>
            {successMessage}
          </Alert>
        )}
        {error && !successMessage && ( // Show general error if no success message
          <Alert severity="error" sx={{ width: '100%', mt: 2, whiteSpace: 'pre-line' }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) validateEmail(e.target.value); // Re-validate on change if there was an error
            }}
            onBlur={() => validateEmail(email)} // Validate on blur
            error={!!emailError}
            helperText={emailError}
            variant="outlined"
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) validatePassword(e.target.value); // Re-validate on change if there was an error
            }}
            onBlur={() => validatePassword(password)} // Validate on blur
            error={!!passwordError}
            helperText={passwordError}
            variant="outlined"
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            disabled={loading}
          />
          {/* This specific error display for password mismatch can be removed if general Alert handles it well enough */}
          {/* {error && !successMessage && ( // Only show this if it's not a success message context
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )} */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#2563eb' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
          <Box textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              {/* <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none' }}>
                Sign In
              </Link> */}
              {/* Replace with your actual sign-in route */}
               <Button component={Link} to="/login" sx={{ color: '#2563eb', textTransform: 'none', padding: 0 }}>Sign In</Button>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
