import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from "js-cookie";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";


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


const theme = createTheme();

export default function UserProfile() {

    const [user, setUser] = useState({email: '', password: '', fName: '', lName: '', global: ''})

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

    const edit = () => {
        navigate('/editprofile')
        return
    }



    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
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
                            My Account
                        </Typography>
                        <Box noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>

                            <Stack spacing={5}>

                                    <Stack direction="row" spacing={15} paddingTop={5} justifyContent="space-between">
                                        <Typography variant="h6">First Name:</Typography>
                                        <Typography >{user.firstName}</Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={15} justifyContent="space-between">
                                        <Typography variant="h6">Last Name:</Typography>
                                        <Typography >{user.lastName}</Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={15} justifyContent="space-between">
                                        <Typography variant="h6">Email:</Typography>
                                        <Typography >{user.email}</Typography>
                                    </Stack>

                            </Stack>

                            <Button
                                fullWidth
                                onClick={edit}
                                variant="contained"
                                sx={{ mt: 3, mb: 2, marginTop: 40, width: '700px'}}
                            >
                                Edit Profile
                            </Button>

                        </Box>
                    </Box>
                </Grid>
                <Grid xs={4} >

                    <Avatar xs={2}  src={`${getProfilePhoto()}?fit=crop&auto=format`} variant="square" style={{
                        flex: 1,
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                        backgroundImage: "https://i.stack.imgur.com/aofMr.png"
                    }}/>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}