import * as React from 'react';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import {useState} from "react";


const isLoggedIn = () => {
    const userId = Cookies.get('UserId')
    return userId !== undefined && userId !== null

}

const fetchAuction = async (id) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions/${id}`)
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            return error.response;
        })
}






const theme = createTheme();

export default function UserProfile() {


    const [auction, setAuction] = useState("")



    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };

    React.useEffect(() => {

        const array = window.location.pathname.split("/")
        const getAucId = parseInt(array[2]);

        const det =  (id) => {
            const details = fetchAuction(getAucId)
            setAuction(details);

            console.log(auction)



        }



        det(getAucId)

    }, [])


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
                                    <Typography variant="h6">{auction.title}</Typography>
                                    <Typography >Auction</Typography>
                                </Stack>

                                <Stack direction="row" spacing={15} justifyContent="space-between">
                                    <Typography variant="h6">Last Name:</Typography>
                                    <Typography >Auction</Typography>
                                </Stack>

                                <Stack direction="row" spacing={15} justifyContent="space-between">
                                    <Typography variant="h6">Email:</Typography>
                                    <Typography >Auction</Typography>
                                </Stack>

                            </Stack>

                            <Button
                                fullWidth

                                variant="contained"
                                sx={{ mt: 3, mb: 2, marginTop: 40, width: '700px'}}
                            >
                                Edit Profile
                            </Button>

                        </Box>
                    </Box>
                </Grid>
                <Grid xs={4} >

                    <Avatar xs={2}   variant="square" style={{
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