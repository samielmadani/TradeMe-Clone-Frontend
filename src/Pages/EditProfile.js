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
import {Input, TextField} from "@mui/material";
import * as PropTypes from "prop-types";
import DriveFileRenameOutlineSharpIcon from "@mui/icons-material/DriveFileRenameOutlineSharp";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import FormHelperText from "@mui/material/FormHelperText";


const loggerCheck = () => {
    return Cookies.get('UserId') !== undefined && Cookies.get('UserId') !== null

}

const whoDis = async () => {
    if (!loggerCheck()) {
        return undefined
    }

    return await axios.get(`http://localhost:4941/api/v1/users/${parseInt(Cookies.get('UserId') || "") || undefined}`, {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    })
}


const profilepiucc = () => {
    if (!loggerCheck()) return ""
    return `http://localhost:4941/api/v1/users/${ parseInt(Cookies.get('UserId') || "") || undefined }/image`

}




const theme = createTheme();

const imageTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']


export default function UserProfile() {


    const [Problems, setProblems] = useState({email: '', password: '', cur: '', fName: '', lName: '', global: ''})
    const [Picture, setPicture] = useState(null)
    const [Showing, setShowing] = useState(false)
    const [PPLink, setPPLink] = useState(profilepiucc)
    const labellll = { 'aria-label': 'description' };

    const [user, setUser] = useState({email: '', password: '', newPass:'', fName: '', lName: '', global: ''})
    const [fName, setFname] = useState("")
    const [lName, setLname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    const deletteeee = async () => {

        return await axios.delete(`http://localhost:4941/api/v1/users/${parseInt(Cookies.get('UserId') || "") || undefined}/image`, {
            headers: {
                "X-Authorization": Cookies.get('UserToken') || ""
            }
        })
            .then((response) => {
                return response.status;
            })
    }

    const validateEmail = (email) => {
        if (email === '') {

        }

        return false;
    }
    const validatePassword = (password) => {
        if (password === '') {
        }
    }
    const validateFirstName = (fName) => {
        if (fName !== '') {
        }
    }
    const validateLastName = (lName) => {
        if (lName !== '') {
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
        if (!loggerCheck()) {
            navigate('/login');
            return
        }

        const logInfo = async () => {
            const log = await whoDis()
            setUser(log.data)
        }


        logInfo()

    }, [])



    const handleSubmit = async () => {
        const firstName = user.fName;
        const lastName = user.lName;
        const newPassword = user.newPass
        const email = user.email;
        const password = user.password;

        console.log(lastName)
        console.log(firstName)



        if (firstName === null || lastName === null || email === null || password === null || newPassword === null) {
            console.log("here")

            return;
        }


        if (true == false){

            return;
        }




        navigate('/userProfile')

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
                                    <TextField size="small"
                                               onChange={(e) => {setFname(  e.target.value)
                                    validateFirstName(e.target.value)}}
                                               id="firstName"
                                           value={user.firstName} inputProps={labellll} />
                                </Stack>

                                <Stack direction="row" spacing={15} justifyContent="space-between">
                                    <Typography variant="h6">Last Name:</Typography>
                                    <TextField size="small"
                                               onChange={(e) => {setLname(  e.target.value)
                                    validateLastName(e.target.value)}}
                                               id="lastName"
                                            value={user.lastName} inputProps={labellll} />
                                </Stack>

                                <Stack direction="row" spacing={15} justifyContent="space-between">
                                    <Typography variant="h6">Email:</Typography>
                                    <TextField size="small"
                                               onChange={(e) => {setEmail(  e.target.value)
                                    validateEmail(e.target.value)}}
                                               id="email"
                                            value={user.email} inputProps={labellll} />
                                </Stack>

                                <Stack direction="row" alignItems='centre'  justifyContent="end">
                                    <Button
                                        startIcon={<DeleteIcon />}
                                        fullWidth
                                        color="error"
                                        onDoubleClick={() => {deletteeee()
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
                                            onChange={(e) => {setPassword(  e.target.value)
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
                                            onChange={(e) => {setUser( {...user, newPass: e.target.value})
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

                        <Avatar xs={2}  src={PPLink} variant="square" style={{
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