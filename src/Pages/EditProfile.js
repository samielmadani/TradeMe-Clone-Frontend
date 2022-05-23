import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from "js-cookie";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import {Input, TextField} from "@mui/material";
import * as PropTypes from "prop-types";
import DriveFileRenameOutlineSharpIcon from "@mui/icons-material/DriveFileRenameOutlineSharp";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";


const isLoggedIn = () => {
    const userId = Cookies.get('UserId')
    return userId !== undefined && userId !== null

}

const getLoggedInUser = async () => {
    if (!isLoggedIn()) return undefined
    const userId = parseInt(Cookies.get('UserId') || "") || undefined

    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    const response = await axios.get(`http://localhost:4941/api/v1/users/${userId}`, config)
    return response
}

const getUserId = () => {
    let userId = Cookies.get('UserId')
    if (userId !== undefined) return parseInt(userId)
    return userId
}



const getProfilePhoto = () => {
    if (!isLoggedIn()) return ""

    const userId = parseInt(Cookies.get('UserId') || "") || undefined
    return `http://localhost:4941/api/v1/users/${userId}/image`

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


const updateUser = async (firstName, lastName, email, password, currentPassword) => {
    if (!isLoggedIn()) return undefined
    const userId = parseInt(Cookies.get('UserId') || "") || undefined

    let body;
    if (password !== undefined && password.length > 0) {
        body = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            currentPassword: currentPassword
        }
    } else {
        body = {
            firstName: firstName,
            lastName: lastName,
            email: email,
        }
    }

    console.log(body)
    const config = {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    return await axios.patch(`http://localhost:4941/api/v1/users/${userId}`, body, config)
        .then((response) => {
            return response.status;
        })
        .catch((error) => {
            console.log(error)
            return error.response.status;
        })
}




const theme = createTheme();

function Form(props) {
    return null;
}

const imageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']


Form.propTypes = {children: PropTypes.node};
export default function UserProfile() {


    const [formErrors, setFormErrors] = useState({email: '', password: '', cur: '', fName: '', lName: '', global: ''})
    const [profilePhoto, setProfilePhoto] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [imageSrc, setImageSrc] = useState(getProfilePhoto)
    const ariaLabel = { 'aria-label': 'description' };

    const [user, setUser] = useState({email: '', password: '', fName: '', lName: '', global: ''})

    const deleteProfilePhoto = async () => {
        if (!isLoggedIn()) return
        const userId = parseInt(Cookies.get('UserId') || "") || undefined

        const config = {
            headers: {
                "X-Authorization": Cookies.get('UserToken') || ""
            }
        }

        return await axios.delete(`http://localhost:4941/api/v1/users/${userId}/image`, config)
            .then((response) => {
                return response.status;
            })
            .catch((error) => {
                return error.response.status;
            })
    }

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
            setUser(fName)
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


    const navigate = useNavigate()

    React.useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
            return
        }

        const logInfo = async () => {
            const log = await getLoggedInUser()
            setUser(log.data)
        }


        logInfo()

    }, [])



    const handleSubmit = async (event) => {
        const fields = new FormData(event.currentTarget);
        const email = fields.get('email') || ""
        const pass = fields.get('password') || ""
        const curPass = fields.get('oldPassword') || ""
        const first = fields.get('firstName') || ""
        const last = fields.get('lastName') || ""

        console.log("im here")

        if (pass.length > 0 && curPass.length < 1) {
            setFormErrors({...formErrors, currentPassword: 'Required'})
            return
        } else {
            setFormErrors({...formErrors, currentPassword: ''})
        }

        console.log("im here")

        if (!(validateFirstName(first) && validateLastName(last) && validatePassword(pass) && validateEmail(email))) return;
        let updateResponse;
        if (pass.length > 0 && curPass.length > 0) {
            updateResponse = await updateUser(first, last, email, pass, curPass)
        } else {
            console.log("Correct")
            updateResponse = await updateUser(first, last, email)
        }

        if (updateResponse === 400) {
            const newValue = {...formErrors, curPass: 'Incorrect password'}
            setFormErrors(newValue)
            return
        }
        if (updateResponse === 500) {
            const newValue = {...formErrors, email: 'Email is already taken'}
            setFormErrors(newValue)
            return
        }
        if (updateResponse !== 200) {
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
        } else {
            const uploadImageResponse = await deleteProfilePhoto()
            if (uploadImageResponse !== 200 && uploadImageResponse !== 201) {
                const newValue = {...formErrors, global: 'Something went wrong'}
                setFormErrors(newValue)
            }
        }

        navigate('/userProfile')
        document.location.reload()
    };






    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '80vh' }}>
                <CssBaseline />
                <Grid xs={2}/>

                <Grid item xs={5.5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Edit Profile
                        </Typography>
                        <Box component="form" onSubmit={async (e) => await handleSubmit(e)} sx={{ maxWidth: '100%', mt: 1 }}>

                            <Stack spacing={5}>

                                <Stack direction="row" spacing={15} paddingTop={5} justifyContent="space-between">
                                    <Typography variant="h6">First Name:</Typography>
                                    <TextField size="small" onChange={(e) => {setUser(e.target.value)
                                    validateFirstName(e.target.value)}}
                                           helperText={formErrors.fName}
                                               error={formErrors.fName !== ''}
                                           value={user.firstName} inputProps={ariaLabel} />
                                </Stack>

                                <Stack direction="row" spacing={15} justifyContent="space-between">
                                    <Typography variant="h6">Last Name:</Typography>
                                    <TextField size="small" onChange={(e) => {setUser(e.target.value)
                                    validateLastName(e.target.value)}}
                                               helperText={formErrors.lName}
                                               error={formErrors.lName !== ''}
                                            value={user.lastName} inputProps={ariaLabel} />
                                </Stack>

                                <Stack direction="row" spacing={15} justifyContent="space-between">
                                    <Typography variant="h6">Email:</Typography>
                                    <TextField size="small"  onChange={(e) => {setUser(e.target.value)
                                    validateEmail(e.target.value)}}
                                               helperText={formErrors.email }
                                               error={formErrors.email !== ''}
                                            value={user.email} inputProps={ariaLabel} />
                                </Stack>

                                <Stack direction="row" alignItems='centre'  justifyContent="end">
                                    <Button
                                        startIcon={<DeleteIcon />}
                                        fullWidth
                                        color="error"
                                        onDoubleClick={() => {deleteProfilePhoto()
                                        setImageSrc("")}}
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2}}
                                    >
                                        Double Click to Delete Image
                                    </Button>
                                </Stack>




                                <Box sx={{borderWidth: '54', borderColor: 'black' }}>

                                    <Typography paddingTop={9} sx={{flexGrow: 1, textAlign: "center"}}>******* Change Password *******</Typography>


                                <Stack direction="row" spacing={15}  justifyContent="space-between">
                                    <Typography variant="h6">New Password:</Typography>
                                    <FormControl  size='small' variant="outlined">
                                        <InputLabel  error={formErrors.password !== ''} htmlFor="password">New Password</InputLabel>
                                        <OutlinedInput
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
                                </Stack>


                                <Stack direction="row" spacing={15} marginTop={4} justifyContent="space-between">
                                    <Typography variant="h6">Current Password:</Typography>
                                    <FormControl  size='small' variant="outlined">
                                        <InputLabel   htmlFor="password">Current Password</InputLabel>
                                        <OutlinedInput
                                            error={formErrors.currentPassword !== ''}
                                            id="curPassword"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            onChange={() => {setFormErrors({...formErrors, currentPassword: ""})}}
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
                                        <FormHelperText error>{formErrors.currentPassword}</FormHelperText>
                                    </FormControl>
                                </Stack>

                                </Box>

                            </Stack>


                            <Button
                                type='form'
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, width: '700px'}}
                            >
                                Save Changes
                            </Button>

                        </Box>
                    </Box>
                </Grid>
                <Grid xs={4} >

                    <Badge
                        style={{
                            flex: 1,
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                        }}
                        overlap="circular"
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}

                        badgeContent={
                            <>

                                <label htmlFor='file-input' style={{cursor: 'pointer', opacity: 0, height: 840, marginLeft: 380, marginTop: 600, width: 700}}>
                                    <DriveFileRenameOutlineSharpIcon color='primary' />
                                </label>
                                <input hidden type="file" accept=".jpg,.jpeg,.png,.gif" id='file-input' onChange={async (e) => await changeProfile(e)}/>
                            </>
                        }>

                        <Avatar xs={2}  src={imageSrc} variant="square" style={{
                            flex: 1,
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            resizeMode: 'contain',
                            backgroundImage: "https://i.stack.imgur.com/aofMr.png"
                        }}/>
                    </Badge>



                </Grid>
            </Grid>
        </ThemeProvider>
    );
}