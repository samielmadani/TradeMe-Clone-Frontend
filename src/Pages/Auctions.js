import * as React from 'react';
import {useState} from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import axios from "axios";
import { CardActionArea, InputLabel, NativeSelect, OutlinedInput,  Pagination, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import * as PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";


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

const money = (int) => {
    return int.toString();
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
    if (min < 0) return `Closed`

    return "closing soon"
}

const findAucc = async (cccc) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions`, { params: cccc})
}

const typesss = [
    'Closing soon',
    'Closing late',
    'Lowest bid',
    'Highest reserve',
    'Lowest reserve',
    'Title ascending',
    'Highest bid',
    'Title descending',
];

const findCattsss = async () => {
    return await axios.get(`http://localhost:4941/api/v1/auctions/categories`)
        .then((response) => {
            return `http://localhost:4941/api/v1/auctions/categories`
        })
}

const findPicc = async (idd) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions/${idd}/image`)
        .then((response) => {
            return `http://localhost:4941/api/v1/auctions/${idd}/image`
        })
}

const theme = createTheme();

function AvatarChip(props) {
    return null;
}

AvatarChip.propTypes = {
    id: PropTypes.any,
    name: PropTypes.string
};
export default function Auctions() {
    const [auctions, setAuctions] = useState([])
    const [image, getPicss] = useState(undefined)
    const [categories, setCategories] = useState([])
    const [cats, setCats] = useState([])
    const [pages, numberrs] = useState(3)
    const [page, setPage] = useState(1)

    const navigate = useNavigate()


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

    const [sortBy, setSortBy] = useState(typesss[0]);
    const [searchTerm, setSearchTerm] = useState("")
    const [allsearchterms, setAllterms] = useState([])
    const [status, setStatus] = useState("ANY");


    const sortType = (sortttt) => {
        switch(sortttt) {
            case 'Closing soon':
                return 'CLOSING_SOON'

            case 'Closing late':
                return "CLOSING_LAST"

            case 'Title ascending':
                return "ALPHABETICAL_ASC"

            case 'Title descending':
                return "ALPHABETICAL_DESC"

            case 'Highest bid':
                return "BIDS_DESC"

            case 'Highest reserve':
                return "RESERVE_DESC"

            case 'Lowest reserve':
                return "RESERVE_ASC"

            case 'Lowest bid':
                return "BIDS_ASC"

            default:
                return 'CLOSING_SOON'
        }
    }

    const getAuctions = async (pageNumber, sortttt, search, filter, statusString) => {
        if (search == undefined) {
            search = searchTerm
        }

        if (filter == undefined) {
            filter = allsearchterms
        }

        if (statusString == undefined) {
            statusString = status
        }
        if (pageNumber == undefined) {
            pageNumber = page
        }
        if (sortttt == undefined)  {
            sortttt = sortBy
        }


        let idss = []
        for (let i=0; i < filter.length; i++) {
            idss.push(filter[i].categoryId)
        }

        const config = {
            startIndex: (pageNumber - 1) * 10,
            count: 40,
            sortBy: sortType(sortttt),
            q: search,
            categoryIds: idss,
            status: statusString
        }
        const response = await findAucc(config)
        if (response.status !== 200) {
            return
        }
        setAuctions(response.data.auctions)
        numberrs(5)
        setCategories(await findCattsss())
    }

    const update = (pageNumber, sortttt, search, filter, statusString) => {
        getAuctions(pageNumber, sortttt, search, filter, statusString)
    }

    React.useEffect(() => {

       const itemss = async () => {
            getAuctions().then((res) => {
                setAuctions(res.data.auctions)
                getPicss(findPicc(res.data.auctionId));
                setCats(findCattsss());
            })
        }

        itemss()
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
                                <p >

                                </p>
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

                    <Container  style={{
                        justifyContent: 'center',
                    }} maxWidth={"lg"}>
                        <Stack style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <TextField fullWidth label="Search" id="search" onChange={handleSearchChange}/>

                            <Pagination style={{ width: '100%', display: 'flex', justifyContent: "inherit"}} count={Math.floor(auctions.length/ 10 )+1}  />

                        </Stack>

                    </Container>

                    <Container maxWidth="sm">
                        <Typography
                            paddingTop={4}
                            component="h1"
                            variant="h2"
                            align="center"
                            color="text.primary"
                            gutterBottom
                        >
                            Auctions
                        </Typography>
                        <FormControl sx={{ m: 1, width: 300, marginLeft: 15 }}>
                            <InputLabel id="filter">Sorting</InputLabel>
                            <NativeSelect
                                labelId="filter"
                                size="small"
                                value={sortBy}
                                onChange={handleSortChanged}
                                input={<OutlinedInput />}
                            >
                                {typesss.map((typeee) => (
                                    <option key={typeee} value={typeee}>{typeee}</option>))}
                            </NativeSelect>
                        </FormControl>


                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="lg">
                    {/* End hero unit */}
                    <Grid container  rowSpacing={1}>

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