import * as React from 'react';
import {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import axios from "axios";
import {CardActionArea} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

const catss = [
    "h",
    "Smartphones",
    "Computers & Laptops",
    "Books",
    "CDs",
    "DVDs",
    "Motorbikes",
    "Bicycles",
    "Farm Equipment",
    "Jewellery",
    "Homeware",
    "Furniture",
    "Watches",
    "Instruments",
    "Electronics",
    "Office Equipment",
    "Tablets",
    "Paintings & Sculptures",
    "Bulk Items",
    "Gaming Consoles",
    "Hair Care",
    "Perfume",
    "Clothing",
    "Lego",
    "Figurines",
    "Cars"
];

const money = (number) => {
    return number.toString();
}

const timmeeee = (date) => {

    const end = new Date(Date.parse(date))
    const cur = new Date()
    const day = Math.floor((end.getTime() - cur.getTime()) / 86400000);
    const hour = Math.floor((end.getTime() - cur.getTime()) / 3600000);
    const min = Math.floor((end.getTime() - cur.getTime()) / 600000);

    if (day > 1) return `closes in ${day} days`
    if (day > 0) return `closes tomorrow`
    if (hour > 0) return `closes in ${hour} hours`
    if (min > 0) return `closes in ${min} minutes`
    if (min < 0) return `Auction closed`

    return "closing soon"
}

const getAuccss = async (ccc) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions`, { params: ccc})
}

const loggercheck = () => {
    return Cookies.get('UserId') !== undefined && Cookies.get('UserId') !== null
}

const getimageeee = async (idd) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions/${idd}/image`)
        .then((response) => {
            return `http://localhost:4941/api/v1/auctions/${idd}/image`
        })
}

const theme = createTheme();


const idd = () => {
    let userId = Cookies.get('UserId')
    if (userId !== undefined) return parseInt(userId)
    return userId
}



export default function MyAuctions() {
    const [auctions, setAuctions] = useState([])
    const [image, setImage] = useState(undefined)

    const navigate = useNavigate()

    const getAuctions = async () => {

        const userId = idd()

        const ccc = {
            count: 40,
            bidderId: userId,
        }

        const res = await getAuccss(ccc)
        if (res.status !== 200) return

        const ccc2 = {
            count: 40,
            sellerId: userId,
        }

        const sellerResponse = await getAuccss(ccc2)
        if (sellerResponse.status !== 200) return


        setAuctions(res.data.auctions.concat(sellerResponse.data.auctions))

    }

    React.useEffect(() => {

        const itemm = async () => {
            if (!loggercheck()) navigate('/login')
            getAuctions().then((res) => {
                setAuctions(res.data.auctions)
                setImage(getimageeee(res.data.auctionId));
            })
        }

        itemm()
    }, [setAuctions])




    const items = () => auctions.map((auction,) =>
        <Grid item  xs={12} sm={6} md={4}>
            <Card sx={{boxShadow: 8, width: '100%', height: '100%', backgroundColor: "#1976d2", border: 6, borderColor: "#1976d2", maxWidth: 375, minWidth: 200}} onClick={() => navigate("/listing/" + auction.auctionId)}>
                <CardActionArea >

                    <CardContent style={{paddingBottom: 0}}>
                        <Grid item xs={12}>
                            <div style={{display: 'flex',  justifyContent: 'space-between'}}>
                                <p>{catss[auction.categoryId]}</p>
                                <p>{timmeeee(auction.endDate)}</p>
                            </div>
                        </Grid>

                        <Typography  variant="h5" >
                            {auction.title}
                        </Typography>

                        <div>
                            <Typography >
                                {auction.description}
                            </Typography>
                            <div>
                                <Avatar src={`http://localhost:4941/api/v1/users/${auction.sellerId}/image`}  />
                                <Typography>Seller: {auction.sellerFirstName + " " + auction.sellerLastName}</Typography>
                            </div>
                        </div>
                    </CardContent>

                    <CardActions>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            <div>
                                <p >
                                    {auction.highestBid == null? "Starting Bid" : "Current Bid"}:
                                    ${auction.highestBid == null? "0" : money(auction.highestBid)}
                                </p>
                                <p >
                                    {auction.highestBid >= auction.reserve ? "Reserve (met)" : "Reserve (not met)"}:
                                    ${auction.reserve == undefined || auction.reserve == null? "0" : money(auction.reserve)}
                                </p>

                            </div>

                            <div >
                                {(auction.sellerId != idd() && timmeeee(auction.endDate) != 'Auction closed') ?
                                    <Button sx={{border: 2, borderColor: "white", backgroundColor: "blue", color: "white"}} >Bid</Button> : null}
                            </div>


                            <div >
                                {auction.sellerId == idd() ?
                                    <Button sx={{border: 2, borderColor: "white", backgroundColor: "green", color: "white"}} >Edit</Button> : null}
                            </div>

                            <div >
                                {auction.sellerId == idd() ?
                                    <Button sx={{border: 2, borderColor: "white", backgroundColor: "red", color: "white"}} >Delete</Button> : null}
                            </div>


                        </div>
                    </CardActions>
                    <Avatar
                        variant="square" style={{
                        flex: 1,
                        objectFit: 'cover',
                        width: '100%',
                        height: '280px',
                        resizeMode: 'contain', }}

                        src={"http://localhost:4941/api/v1/auctions/" + auction.auctionId +"/image"}
                    />

                </CardActionArea>
            </Card>
        </Grid>
    )






    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                <Box>


                    <Container maxWidth="sm">
                        <div >
                            <Button sx={{marginLeft: 15, fontSize: 24, border: 2, borderColor: "green", backgroundColor: "green", color: "black"}} >Create New Auction</Button>
                        </div>
                        <Typography
                            paddingTop={4}
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            My Auctions
                        </Typography>



                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="lg">
                    <Grid container spacing={4}>


                        {items()}

                    </Grid>
                </Container>

            </main>
            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">

            </Box>
            {/* End footer */}
        </ThemeProvider>
    );
}