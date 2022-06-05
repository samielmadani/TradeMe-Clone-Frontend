import * as React from 'react';
import {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import axios from "axios";
import {CardActionArea, Pagination, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import * as PropTypes from "prop-types";
import Cookies from "js-cookie";
import Avatar from "@mui/material/Avatar";
import {logDOM} from "@testing-library/react";
import Button from "@mui/material/Button";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];


const money = (number) => {
    return number.toString();
}

const getTimeRemaining = (date) => {

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

const fetchAuctions = async (config) => {
    const response =  await axios.get(`http://localhost:4941/api/v1/auctions`, { params: config})
    return response;
}

const displayAmount = 40

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const sortOptions = [
    'Closing soon',
    'Closing late',
    'Highest bid',
    'Lowest bid',
    'Highest reserve',
    'Lowest reserve',
    'Title ascending',
    'Title descending',
];

const isLoggedIn = () => {
    const userId = Cookies.get('UserId')
    return userId !== undefined && userId !== null

}

const fetchCategories = async () => {
    return await axios.get(`http://localhost:4941/api/v1/auctions/categories`)
        .then((response) => {
            return `http://localhost:4941/api/v1/auctions/categories`
        })
        .catch((error) => {
            return []
        })
}

const fetchImage = async (auctionId) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions/${auctionId}/image`)
        .then((response) => {
            return `http://localhost:4941/api/v1/auctions/${auctionId}/image`
        })
        .catch((error) => {
            return
        })
}

const theme = createTheme();

function AvatarChip(props) {
    return null;
}

const getUserId = () => {
    let userId = Cookies.get('UserId')
    if (userId !== undefined) return parseInt(userId)
    return userId
}



AvatarChip.propTypes = {
    id: PropTypes.any,
    name: PropTypes.string
};
export default function MyAuctions() {
    const [auctions, setAuctions] = useState([])
    const [image, setImage] = useState(undefined)
    const [categories, setCategories] = useState([])
    const [cats, setCats] = useState([])
    const [pages, setPages] = useState(3)
    const [page, setPage] = useState(1)
    const [sortBy, setSortBy] = useState(sortOptions[0]);
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState([])
    const [status, setStatus] = useState("ANY");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate()


    const handleFilterMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterMenuClose = (event, category) => {
        setAnchorEl(null)
        if (!category) return

        const newFiltersRemoved = filters.filter((categoryTemp) => (
            categoryTemp.categoryId !== category.categoryId
        ))
        const newFiltersAdded = [...newFiltersRemoved, category]
        setFilters(newFiltersAdded)
        update(page, sortBy, searchTerm, newFiltersAdded)
    };

    const handleStatusChange = (event, value) => {
        setStatus(value)
        update(page, sortBy, searchTerm, filters, value)
    };

    const handleSortChanged = (event) => {
        const {
            target: { value },
        } = event;

        update(page, value)
        setSortBy(value)
    };

    const handleSearchChange = (event) => {
        const parameter = event.target.value
        update(page, sortBy, parameter)
        setSearchTerm(parameter)
    }

    const handleChange = (event, value) => {
        update(value)
        setPage(value)
    };

    const convertToBackEndSort = (sortByString) => {
        switch(sortByString) {
            case 'Closing soon':
                return 'CLOSING_SOON'
            case 'Closing late':
                return "CLOSING_LAST"
            case 'Highest bid':
                return "BIDS_DESC"
            case 'Lowest bid':
                return "BIDS_ASC"
            case 'Highest reserve':
                return "RESERVE_DESC"
            case 'Lowest reserve':
                return "RESERVE_ASC"
            case 'Title ascending':
                return "ALPHABETICAL_ASC"
            case 'Title descending':
                return "ALPHABETICAL_DESC"
            default:
                return 'CLOSING_SOON'
        }
    }

    const getAuctions = async (pageNumber, sortByString,  filtersArray, statusString) => {
        if (pageNumber == undefined) pageNumber = page
        if (filtersArray == undefined) filtersArray = filters

        const userId = getUserId()


        let categoryIdsList = []
        for (let i=0; i < filtersArray.length; i++) {
            categoryIdsList.push(filtersArray[i].categoryId)
        }

        const config = {
            startIndex: (pageNumber - 1) * displayAmount,
            count: displayAmount,
            bidderId: userId,
        }

        const bidderResponse = await fetchAuctions(config)
        if (bidderResponse.status !== 200) return

        const config2 = {
            startIndex: (pageNumber - 1) * displayAmount,
            count: displayAmount,
            sellerId: userId,
        }

        const sellerResponse = await fetchAuctions(config2)
        if (sellerResponse.status !== 200) return


        setAuctions(bidderResponse.data.auctions.concat(sellerResponse.data.auctions))
        setPages(Math.ceil((bidderResponse.data.count + sellerResponse.data.count) / displayAmount))

        const categoryResponse = await fetchCategories()
        setCategories(categoryResponse)
    }

    const update = (pageNumber, sortByString, search, filtersArray, statusString) => {

        getAuctions(pageNumber, sortByString, search, filtersArray, statusString)
    }

    React.useEffect(() => {


        const allItems = async () => {
            if (!isLoggedIn()) navigate('/login')

            getAuctions().then((res) => {
                setAuctions(res.data.auctions)

                setImage(fetchImage(res.data.auctionId));

                setCats(fetchCategories());
                console.log(fetchCategories())



            })
        }




        allItems()
    }, [setAuctions])

    const getCategory = (categoryId) => {
        let messageReturn = ''
        if (cats !== undefined) {
            const found = cats.find(e => e.categoryId === categoryId);
            if (found != undefined) {
                messageReturn = found.name
            }
        }

        return messageReturn;
    }

    const handleFilterClick = (category) => {
        const newFilters = filters.filter((categoryTemp) => (
            categoryTemp.categoryId === category.categoryId
        ))

        setFilters(newFilters)
        update(page, sortBy, searchTerm, newFilters)
    };

    const handleFilterDelete = (category) => {
        const newFilters = filters.filter((categoryTemp) => (
            categoryTemp.categoryId !== category.categoryId
        ))

        setFilters(newFilters)
        update(page, sortBy, searchTerm, newFilters)
    };



    const items = () => auctions.map((auction,) =>
        <Grid item  xs={12} sm={6} md={4}>
            <Card sx={{boxShadow: 8, width: '100%', height: '100%',backgroundColor: "#1976d2", border: 6, borderColor: "#1976d2", maxWidth: 375, minWidth: 200}} onClick={() => navigate("/listing/" + auction.auctionId)}>
                <CardActionArea >

                    <CardContent style={{paddingBottom: 0}}>
                        <Grid item xs={12}>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <p>Hair Care</p>
                                <p>{getTimeRemaining(auction.endDate)}</p>
                            </div>
                        </Grid>

                        <Typography gutterBottom variant="h5" component="div">
                            {auction.title}
                        </Typography>

                        <div>
                            <Typography variant="body2" color="text.secondary" >
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
                                <p style={{padding: 0, margin: 0, fontSize: 10}}>
                                    {auction.highestBid == null? "Starting Bid" : "Current Bid"}
                                </p>
                                <p style={{padding: 0, margin: 0, fontSize: 16}}>
                                    ${auction.highestBid == null? "0" : money(auction.highestBid)}
                                </p>
                                <p style={{padding: 0, margin: 0, fontSize: 10}}>
                                    {auction.highestBid >= auction.reserve ? "Reserve (met)" : "Reserve (not met)"}
                                </p>
                                <p style={{padding: 0, margin: 0, fontSize: 16}}>
                                    ${auction.reserve == undefined || auction.reserve == null? "0" : money(auction.reserve)}
                                </p>

                            </div>

                            <div >
                                {(auction.sellerId != getUserId() && getTimeRemaining(auction.endDate) != 'Auction closed') ?
                                    <Button sx={{border: 2, borderColor: "white", backgroundColor: "blue", color: "white"}} >Bid</Button> : null}
                            </div>


                            <div >
                                {auction.sellerId == getUserId() ?
                                <Button sx={{border: 2, borderColor: "white", backgroundColor: "green", color: "white"}} >Edit</Button> : null}
                            </div>

                            <div >
                                {auction.sellerId == getUserId() ?
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
                    {/* End hero unit */}
                    <Grid container spacing={4}>


                        {items()}

                    </Grid>
                </Container>
                <Box>


                    <Container maxWidth="sm">
                        <div >
                            <Button sx={{marginLeft: 15, fontSize: 24, border: 2, borderColor: "green", backgroundColor: "green", color: "black"}} >Create New Auction</Button>
                        </div>



                    </Container>
                </Box>
            </main>
            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">

            </Box>
            {/* End footer */}
        </ThemeProvider>
    );
}