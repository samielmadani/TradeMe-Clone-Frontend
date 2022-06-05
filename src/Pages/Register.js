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

const loggerCheck = () => {
    return Cookies.get('UserId') !== undefined && Cookies.get('UserId') !== null

}

const putimage = async (image) => {
    if (!loggerCheck()) {
        return
    }

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
            return error.response.status;
        })
}


export default function Register({userId, setUserId}) {

    React.useEffect(() => {
        if (loggerCheck()) {
            navvv('/');
        }
    })



    const [issues, setIssues] = useState({email: '', password: '', fName: '', lName: '', global: ''})
    const [showPassword, setShowPassword] = useState(false)
    const [image, setImage] = useState(null)
    const [linkk, setLinkk] = useState('')
    const navvv = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email') || ""
        const password = data.get('password') || ""
        const firstName = data.get('firstName') || ""
        const lastName = data.get('lastName') || ""

        const emailValid = checkEmail(email)
        const passwordValid = checkPass(password)
        const fNameValid = checkNameF(firstName)
        const lNameValid = checkNameL(lastName)
        const checkk = fNameValid && lNameValid && passwordValid && emailValid;

        if (!checkk) return;

        if (await register(firstName, lastName, email, password) === 500) {
            return setIssues({...issues, email: 'Email used'})
        }

        if (await login(email, password) !== 200) {
            return setIssues({...issues, global: 'Issue found'})
        }

        if (image !== null && image !== undefined) {
            const res = await putimage(image)
            if (res !== 200 && res !== 201) {
                setIssues({...issues, global: 'Issue found'})
            }
        }

        navvv('/')
    };


    const loginPage = () => {
        return navvv('/login')

    };

    const checkPass = (password) => {
        if (password === '') {
            setIssues({...issues, password: 'Required'})
        } else if (password.length >= 6) {
            setIssues({...issues, password: ''})
            return true;
        } else {
            setIssues({...issues, password: 'Password must be at least 6 characters long'})
            return false;
        }
    }

    const checkNameF = (fName) => {
        if (fName !== '') {
            setIssues({...issues, fName: ''})
            return true;
        } else {
            setIssues({...issues, fName: 'Required'})
            return false;
        }
    }

    const checkNameL = (lName) => {
        if (lName !== '') {
            setIssues({...issues, lName: ''})
            return true;
        } else {
            setIssues({...issues, lName: 'Required'})
            return false;
        }
    }

    const checkEmail = (email) => {
        if (email === '') {
            setIssues({...issues, email: 'Required'})
            return false;
        } else if (/.+@.+\.[A-Za-z]+$/.test(email)) {
            setIssues({...issues, email: ''})
            return true;
        } else {
            setIssues( {...issues, email: 'Email incorrect style'})
            return false;
        }
    }



    const changeProfile = async (e) => {
        const file = e.target.files[0]
        setImage(file)
        if (file === undefined) {
            setLinkk("")
            return
        }
        if (!imageTypes.includes(file.type)) {
            setLinkk("")
            return
        }
        setLinkk(URL.createObjectURL(file))
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
                            <Grid sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} item xs={12}>
                                <IconButton>
                                <Badge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}

                                    badgeContent={
                                        <>
                                            <label htmlFor='file-input' style={{cursor: "pointer", opacity: 0.0, height: 200, marginLeft: 145, marginTop: 145, width: 200}}>
                                                <DriveFileRenameOutlineSharpIcon color='primary' />
                                            </label>
                                            <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input' onChange={async (e) => await changeProfile(e)}/>
                                        </>
                                    }>
                                    <Avatar sx={{height: 200, width: 200}} alt="User" src={linkk} />
                                </Badge>
                                </IconButton>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography color='red' variant="body1">
                                    {issues.global}
                                </Typography>
                            </Grid>



                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    error={issues.fName}
                                    helperText={issues.fName}
                                    onChange={(e) => checkNameF(e.target.value)}
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
                                    error={issues.lName}
                                    helperText={issues.lName}
                                    onChange={(e) => checkNameL(e.target.value)}

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
                                    error={issues.email}
                                    helperText={issues.email}
                                    onChange={(e) => checkEmail(e.target.value)}

                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel required error={issues.password !== ''} htmlFor="password">Password</InputLabel>
                                    <OutlinedInput
                                        required
                                        error={issues.password !== ''}
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        onChange={(e) => {checkPass(e.target.value)}}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    onMouseDown={(event) => event.preventDefault()}>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                    <FormHelperText error id="component-helper-text">{issues.password}</FormHelperText>
                                </FormControl>
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