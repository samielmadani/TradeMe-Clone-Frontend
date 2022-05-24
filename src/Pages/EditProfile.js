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
    return `http://localhost:4941/api/v1/users/${userId}/image`;

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


    const [Problems, setProblems] = useState({email: '', password: '', cur: '', fName: '', lName: '', global: ''})
    const [Picture, setPicture] = useState(null)
    const [Showing, setShowing] = useState(false)
    const [PPLink, setPPLink] = useState(getProfilePhoto)
    const ariaLabel = { 'aria-label': 'description' };

    const [user, setUser] = useState({email: '', password: '', newPass:'', fName: '', lName: '', global: ''})
    const [fName, setFname] = useState("")
    const [lName, setLname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [newPass, setNewPass] = useState("")


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
            const newValue = {...Problems, email: 'Required'}
            setProblems(newValue)
        } else if (/.+@.+\.[A-Za-z]+$/.test(email)) {
            const newValue = {...Problems, email: ''}
            setProblems(newValue)
            return true;
        } else {
            const newValue = {...Problems, email: 'Email poorly formatted'}
            setProblems(newValue)
        }

        return false;
    }

    const validatePassword = (password) => {
        if (password === '') {
            const newValue = {...Problems, password: 'Required'}
            setProblems(newValue)
        } else if (password.length >= 6) {
            const newValue = {...Problems, password: ''}
            setProblems(newValue)
            return true;
        } else {
            const newValue = {...Problems, password: 'Password must be at least 6 characters long'}
            setProblems(newValue)
            return false;
        }
    }

    const validateFirstName = (fName) => {
        if (fName !== '') {
            const newValue = {...Problems, fName: ''}
            setProblems(newValue)
            return true;
        } else {
            setUser(fName)
            const newValue = {...Problems, fName: 'Required'}
            setProblems(newValue)
            return false;
        }
    }

    const validateLastName = (lName) => {
        if (lName !== '') {
            const newValue = {...Problems, lName: ''}
            setProblems(newValue)
            return true;
        } else {
            const newValue = {...Problems, lName: 'Required'}
            setProblems(newValue)
            return false;
        }
    }




    const changeProfile = async (e) => {
        const file = e.target.files[0]
        setPicture(file)
        if (file === undefined) {
            setPPLink("")
            return
        }
        if (!imageTypes.includes(file.type)) {
            setPPLink("")
            return
        }

        const src = URL.createObjectURL(file)
        setPPLink(src)
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
            setFname(log.data.firstName)
            setLname(log.data.lastName)
            setEmail(log.data.email)

        }


        logInfo()

    }, [])



    const handleSubmit = async () => {
        console.log(lName)
        console.log(fName)

        const firstName = fName;
        const lastName = lName;
        const newPassword = newPass
        const email = email;
        const password = password;

        console.log(lastName)
        console.log(firstName)



        if (firstName === "" || lastName === "" || email === "" || password === null || newPassword === null) {
            console.log("here")

            return;
        }


        if (!((/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test((email.toString().toLowerCase())))){

            return;
        }
        if (/^\s+$/ .test(firstName.toString())) {

            return;
        }
        if (/^\s+$/ .test(lastName.toString())) {

            return;
        }
        if (/^\s+$/ .test(password.toString())) {

            return;
        }
        if ((password.toString().length < 6  && password.toString().length > 0 )|| (newPassword.toString().length < 6 && newPassword.toString().length > 0)) {

            return;
        }


        if (Picture !== null && Picture !== undefined) {
            uploadProfilePhoto(Picture)
                .then((response) => {
                    navigate('/userProfile')
                })
        }
        let use = false;
        let userInfo = {"firstName":firstName.toString(), "lastName": lastName.toString(), "email": email.toString()};
        let userInfoWithPassword;

        if(password.toString().length > 0 && newPassword.toString().length > 0) {
            userInfoWithPassword = {
                "firstName": firstName.toString(),
                "lastName": lastName.toString(),
                "email": email.toString(),
                "password": newPassword.toString(),
                "currentPassword": password.toString()
            };
            use = true;
        }
        if (use) {
            await updateUser(userInfoWithPassword.firstName, userInfoWithPassword.lastName, userInfoWithPassword.email, userInfoWithPassword.password, userInfoWithPassword.currentPassword)
                .then((response) => {
                    navigate('/userProfile')

                })
        } else {
            alert("Hi")
            await updateUser(userInfoWithPassword.firstName, userInfoWithPassword.lastName, userInfoWithPassword.email)
                .then((response) => {
                    navigate('/userProfile')

                })
        }
        alert('F')
    };






    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '80vh' }}>
                <CssBaseline />
                <Grid item xs={2}/>

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
                                    <TextField size="small"
                                               onChange={(e) => {setFname(e.target.value)
                                                   console.log(fName)
                                    validateFirstName(e.target.value)}}
                                               id="firstName"
                                           helperText={Problems.fName}
                                               error={Problems.fName !== ''}
                                           value={fName} />
                                </Stack>

                                <Stack direction="row" spacing={15} justifyContent="space-between">
                                    <Typography variant="h6">Last Name:</Typography>
                                    <TextField size="small"
                                               onChange={(e) => {setLname(  e.target.value)
                                    validateLastName(e.target.value)}}
                                               id="lastName"
                                               helperText={Problems.lName}
                                               error={Problems.lName !== ''}
                                            value={lName} inputProps={ariaLabel} />
                                </Stack>

                                <Stack direction="row" spacing={15} justifyContent="space-between">
                                    <Typography variant="h6">Email:</Typography>
                                    <TextField size="small"
                                               onChange={(e) => {setEmail(  e.target.value)
                                    validateEmail(e.target.value)}}
                                               id="email"
                                               helperText={Problems.email }
                                               error={Problems.email !== ''}
                                            value={email} inputProps={ariaLabel} />
                                </Stack>

                                <Stack direction="row" alignItems='centre'  justifyContent="end">
                                    <Button
                                        startIcon={<DeleteIcon />}
                                        fullWidth
                                        color="error"
                                        onDoubleClick={() => {deleteProfilePhoto()
                                        setPPLink("")}}
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
                                    <TextField  size='small' variant="outlined"
                                            error={Problems.password !== ''}
                                            id="password"
                                            name="password"
                                            value={user.password}
                                            type={Showing ? 'text' : 'password'}
                                            onChange={(e) => {setNewPass(  e.target.value)
                                                validatePassword(e.target.value)}}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowing(!Showing)}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                        edge="end"
                                                    >
                                                        {Showing ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        >
                                        <FormHelperText error id="component-helper-text">{Problems.password}</FormHelperText>
                                    </TextField>
                                </Stack>


                                <Stack direction="row" spacing={15} marginTop={4} justifyContent="space-between">
                                    <Typography variant="h6">Current Password:</Typography>
                                    <TextField  size='small' variant="outlined"
                                            error={Problems.cur !== ''}
                                            id="curPass"
                                            name="password"
                                            type={Showing ? 'text' : 'password'}
                                            onChange={(e) => {setPassword(  e.target.value)
                                                setProblems({...Problems, cur: ""})}}
                                            value={user.cur}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowing(!Showing)}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                        edge="end"
                                                    >
                                                        {Showing ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        >
                                        <FormHelperText error>{Problems.currentPassword}</FormHelperText>
                                    </TextField>
                                </Stack>

                                </Box>

                            </Stack>


                            <Button
                                type='form'
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, width: '700px'}}
                                onClick={() => handleSubmit()}
                            >
                                Save Changes
                            </Button>

                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={4} >

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

                        <Avatar xs={2}  src={getProfilePhoto} variant="square" style={{
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