import * as React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import DriveFileRenameOutlineSharpIcon from '@mui/icons-material/DriveFileRenameOutlineSharp';

const theme = createTheme();
const imageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']

const isLoggedIn = () => {
    const userId = Cookies.get('UserId')
    return userId !== undefined && userId !== null
}

const uploadProfilePhoto = async (image) => {
    if (!isLoggedIn()) return

    const userId = parseInt(Cookies.get('UserId') || "") || undefined
    let imageType = image.type
    if (imageType === 'image/jpg') imageType = 'image/jpeg'

    const config = {
        headers: {
            "content-type": imageType,
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    return await axios.put(`http://localhost:4941/api/v1/users/${userId}/image`, image, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            return error.response.status;
        })
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

const register = async (firstName, lastName, email, password) => {
    return await axios.post(`http://localhost:4941/api/v1/users/register`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    })
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            console.log(error)
            return error.response.status;
        })
}


export default function Register({userId, setUserId}) {

    React.useEffect(() => {
        if (isLoggedIn()) {
            navigate('/');
        }
    })



    const [formErrors, setFormErrors] = useState({email: '', password: '', fName: '', lName: '', global: ''})
    const [showPassword, setShowPassword] = useState(false)
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [imageSrc, setImageSrc] = useState('')
    const navigate = useNavigate()

    // Submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Get data
        const data = new FormData(event.currentTarget);
        const email = data.get('email') || ""
        const password = data.get('password') || ""
        const firstName = data.get('firstName') || ""
        const lastName = data.get('lastName') || ""

        // Validate forms
        const emailValid = validateEmail(email)
        const passwordValid = validatePassword(password)
        const fNameValid = validateFirstName(firstName)
        const lNameValid = validateLastName(lastName)
        const formValid = fNameValid && lNameValid && passwordValid && emailValid;

        if (!formValid) return;

        const registerResponse = await register(firstName, lastName, email, password)

        if (registerResponse === 500) {
            const newValue = {...formErrors, email: 'Email is already taken'}
            setFormErrors(newValue)
            return
        }

        const loginResponse = await login(email, password)

        if (loginResponse !== 200) {
            const newValue = {...formErrors, global: 'Something went wrong'}
            setFormErrors(newValue)
            return
        }

        if (profilePhoto !== null && profilePhoto !== undefined) {
            const uploadImageResponse = await uploadProfilePhoto(profilePhoto)
            if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                const newValue = {...formErrors, global: 'Something went wrong'}
                setFormErrors(newValue)
            }
        }

        navigate('/')
    };


    const loginPage = () => {
        navigate('/login')
        return
    };


    // Validate functions
    const validateEmail = (email) => {
        if (email === '') {
            const newValue = {...formErrors, email: 'Required'}
            setFormErrors(newValue)
        } else if (/.+@.+\.[A-Za-z]+$/.test(email)) {
            const newValue = {...formErrors, email: ''}
            setFormErrors(newValue)
            return true;
        } else {
            const newValue = {...formErrors, email: 'Email poorly formatted'}
            setFormErrors(newValue)
        }

        return false;
    }

    const validatePassword = (password) => {
        if (password === '') {
            const newValue = {...formErrors, password: 'Required'}
            setFormErrors(newValue)
        } else if (password.length >= 6) {
            const newValue = {...formErrors, password: ''}
            setFormErrors(newValue)
            return true;
        } else {
            const newValue = {...formErrors, password: 'Password must be at least 6 characters long'}
            setFormErrors(newValue)
            return false;
        }
    }

    const validateFirstName = (fName) => {
        if (fName !== '') {
            const newValue = {...formErrors, fName: ''}
            setFormErrors(newValue)
            return true;
        } else {
            const newValue = {...formErrors, fName: 'Required'}
            setFormErrors(newValue)
            return false;
        }
    }

    const validateLastName = (lName) => {
        if (lName !== '') {
            const newValue = {...formErrors, lName: ''}
            setFormErrors(newValue)
            return true;
        } else {
            const newValue = {...formErrors, lName: 'Required'}
            setFormErrors(newValue)
            return false;
        }
    }

    const changeProfile = async (e) => {
        const file = e.target.files[0]
        setProfilePhoto(file)
        console.log(file)
        if (file === undefined) {
            setImageSrc("")
            return
        }
        if (!imageTypes.includes(file.type)) {
            setImageSrc("")
            return
        }

        const src = URL.createObjectURL(file)
        setImageSrc(src)
    }

    return (
        <ThemeProvider theme={theme} >
            <Container component="main" maxWidth="xs" style={{backgroundColor: 'lightblue', borderRadius: 50, paddingBottom: '40px'}}>
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
                        Register
                    </Typography>
                    <Box component="form" noValidate onSubmit={async (e) => await handleSubmit(e)} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>


{/*/////////////////////////////*/}

                            <Grid sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} item xs={12}>
                                <IconButton>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}

                                    badgeContent={
                                        <>
                                            <label htmlFor='file-input' style={{opacity: 0.0, height: 200, marginLeft: 176, marginTop: 176, width: 200}}>
                                                <DriveFileRenameOutlineSharpIcon color='primary' />
                                            </label>
                                            <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input' onChange={async (e) => await changeProfile(e)}/>
                                        </>
                                    }>
                                    <Avatar sx={{height: 200, width: 200}} alt="User" src={imageSrc} />
                                </Badge>
                                </IconButton>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography color='red' variant="body1">
                                    {formErrors.global}
                                </Typography>
                            </Grid>


                            {/*/////////////////////////////*/}


                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus



                                    error={formErrors.fName !== ''}
                                    helperText={formErrors.fName}
                                    onChange={(e) => validateEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"


                                    error={formErrors.lName !== ''}
                                    helperText={formErrors.lName}
                                    onChange={(e) => validateEmail(e.target.value)}


                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"


                                    error={formErrors.email !== ''}
                                    helperText={formErrors.email}
                                    onChange={(e) => validateEmail(e.target.value)}

                                />
                            </Grid>
                            <Grid item xs={12}>


                                {/*/////////////////////////////*/}



                                <FormControl fullWidth variant="outlined">
                                    <InputLabel required error={formErrors.password !== ''} htmlFor="password">Password</InputLabel>
                                    <OutlinedInput
                                        required
                                        error={formErrors.password !== ''}
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(e) => {validatePassword(e.target.value)}}
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



                                {/*/////////////////////////////*/}


                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link style={{cursor: "pointer"}} onClick={async () => await loginPage()} variant="body2">
                                    Already have an account? Log in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}