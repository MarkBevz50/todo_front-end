import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Link as MuiLink,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, loading } = useAuth(); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    const result = await login(email, password); 

    if (result.success) {
      navigate('/'); 
    } else {
      setError(result.error || 'Login failed. Please check your credentials or try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%', borderRadius: '8px' }}>
              {error}
            </Alert>
          )}
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
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            disabled={loading} 
          />
          {/* TODO Optional: Add "Forgot password?" link here */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#2563eb',
              borderRadius: '8px',
              textTransform: 'none',
              padding: '10px 0',
              '&:hover': {
                bgcolor: '#1d4ed8',
              },
            }}
            disabled={loading} 
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          <Box textAlign="center">
            <MuiLink component={RouterLink} to="/signup" variant="body2" sx={{ color: '#2563eb', textDecoration: 'none' }}>
              {"Don't have an account? Sign Up"}
            </MuiLink>
          </Box>
        </Box>
      </Paper>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
        {'Copyright © '}
        <MuiLink color="inherit" href="/">
          FocusFlow
        </MuiLink>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </Container>
  );
};

export default Login;
