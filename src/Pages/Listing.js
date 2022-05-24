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
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";


const isLoggedIn = () => {
    const userId = Cookies.get('UserId')
    return userId !== undefined && userId !== null

}

const getBids = async (id) => {
    const response =  await axios.get(`http://localhost:4941/api/v1/auctions/${id}/bids`)
    return response;
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


    const [auction, setAuction] = useState([])
    const [bids, setBids] = useState([])
    const [top, setTop] = useState("")

    const [time, setTime] = useState("")
    const [day, setDay] = useState("")



    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
    };

    React.useEffect(() => {

        const array = window.location.pathname.split("/")
        const getAucId = parseInt(array[2]);

        fetchAuction(getAucId)
            .then((res) => {

                const list = res.endDate.split("T")
                setDay(list[0])
                setTime(list[1].split(".")[0])

                setAuction(res);

                getBids(getAucId).then((res) => {
                    setBids(res.data);
                    console.log(res.data[0])
                    setTop(bids[0].firstName)
                }, (error) => {

                })

            console.log(auction)
        }, (error) => {

        })






    }, [])
    console.log(top + 'ddd')

    const bidding = () => bids.map((bid) =>
        <Grid item>
    <Card>
        <Avatar sx={{ width: 60, height: 60 }} alt={bid.firstName} src={"http://localhost:4941/api/v1/users/"+bid.bidderId+"/image"} />
        <p>{bid.firstName} {bid.lastName}</p>
        {/*<p>{getEndDate(bid.timestamp)}</p>*/}
        <p>${bid.amount}</p>
    </Card>
        </Grid>
    )




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
                            {auction.title}
                        </Typography>
                        <Box sx={{ mt: 10 }}>

                            <Stack spacing={5}>

                                <Stack justifyContent="space-between">
                                    <Typography >End Date/Time</Typography>
                                    <Typography variant="h6">Date: {day} / Time: {time}</Typography>
                                    <Divider/>

                                    <Stack alignItems="centre"  direction="row" spacing={4}>
                                    <Typography >Seller:</Typography>
                                    <Avatar src={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}  />
                                    <Typography variant="h6">{auction.sellerFirstName + " " + auction.sellerLastName}</Typography>
                                    </Stack>

                                    <Divider/>


                                    <Typography >Description</Typography>
                                    <Typography variant="h6">{auction.description}</Typography>
                                    <Divider/>

                                    <Typography >Category</Typography>
                                    <Typography variant="h6">Hair Care</Typography>
                                    <Divider/>

                                    <Typography >Reserve</Typography>
                                    <Typography variant="h6">${auction.reserve}</Typography>
                                    <Divider/>

                                    <Typography >Bids</Typography>
                                    <Typography variant="h6">{bids.length}</Typography>
                                    <Divider/>
                                </Stack>

                                <Stack justifyContent="space-between">
                                    <Typography >Bids</Typography>
                                    <Typography variant="h6">i</Typography>
                                    <Divider/>
                                </Stack>

                                <Stack justifyContent="space-between">

                                    {bidding}


                                </Stack>

                            </Stack>

                            <Button
                                fullWidth

                                variant="contained"
                                sx={{ mt: 3, mb: 2, width: '700px'}}
                            >
                                Make Bid
                            </Button>

                        </Box>
                    </Box>
                </Grid>
                <Grid xs={4} >

                    <Avatar xs={2}   variant="square" style={{
                        justifyContent: "end",
                        flex: 1,
                        objectFit: 'cover',
                        width: '100%',
                        height: 'fit-content',
                        resizeMode: 'contain',
                        backgroundImage: "https://i.stack.imgur.com/aofMr.png"
                    }} src={"http://localhost:4941/api/v1/auctions/" + auction.auctionId +"/image"}/>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}