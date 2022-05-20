import * as React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Cookies from "js-cookie";

const theme = createTheme();

const isLoggedIn = () => {
    const userId = Cookies.get('UserId')
    return userId !== undefined && userId !== null
}

const getProfilePhoto = () => {
    if (!isLoggedIn()) return ""
    const userId = parseInt(Cookies.get('UserId') || "") || undefined

    return `http://localhost:4941/api/v1/users/${userId}/image`
}

const login = async (email, password) => {
    return await axios.post(`http://localhost:4941/api/v1/users/login`, {
        email: email,
        password: password
    })
        .then((response) => {
            Cookies.set('UserId', response.data.userId)
            Cookies.set('UserToken', response.data.token)
            return response.status;
        })
        .catch((error) => {
            console.log(error)
            return error.response.status;
        })
}

export default function LogIn() {
    React.useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    })


    const [formErrors, setFormErrors] = useState({email: '', password: '', global: ''})
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email') || ""
        const password = data.get('password') || ""

        const response = await login(email, password)

        if (response !== 200) {
            const newErrors = {...formErrors, global: "Incorrect email/password"}
            setFormErrors(newErrors)
            return
        }

        navigate('/')
    };


    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Log in
                    </Typography>
                    <Box component="form" onSubmit={async (e) => await handleSubmit(e)} noValidate sx={{ mt: 1 }}>
                        <Typography textAlign='center' color='error' variant="body1">
                            {formErrors.global}
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus

                            error={formErrors.email !== ''}
                            helperText={formErrors.email}
                        />
                        <FormControl fullWidth variant="outlined">
                            <InputLabel required error={formErrors.password !== ''} htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                required
                                id="password"
                                name="password"
                                error={formErrors.password !== ''}
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            onMouseDown={(event) => event.preventDefault()}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            <FormHelperText error id="component-helper-text">{formErrors.password}</FormHelperText>
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Log In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Register"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}