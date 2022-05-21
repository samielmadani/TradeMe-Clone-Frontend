import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Item from "../components/Item";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from "axios";
import {Autocomplete, Pagination, TextField} from "@mui/material";
import {useEffect, useState} from "react";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const fetchAuctions = async (config) => {
    const response =  await axios.get(`http://localhost:4941/api/v1/auctions`, { params: config})
    return response;
}

const fetchCategories = async () => {
    const response = await axios.get(`http://localhost:4941/api/v1/auctions/categories`)
    if (response.status !== 200) return []
    return response.data
}

const displayAmount = 4

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

const theme = createTheme();

export default function Auctions() {
    const [auctions, setAuctions] = useState([])
    const [categories, setCategories] = useState([])
    const [pages, setPages] = useState(3)
    const [page, setPage] = useState(1)
    const [sortBy, setSortBy] = useState(sortOptions[0]);
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState([])
    const [status, setStatus] = useState("ANY");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

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

    const getAuctions = async (pageNumber, sortByString, search, filtersArray, statusString) => {
        if (pageNumber == undefined) pageNumber = page
        if (sortByString == undefined) sortByString = sortBy
        if (search == undefined) search = searchTerm
        if (filtersArray == undefined) filtersArray = filters
        if (statusString == undefined) statusString = status

        let categoryIdsList = []
        for (let i=0; i < filtersArray.length; i++) {
            categoryIdsList.push(filtersArray[i].categoryId)
        }

        const config = {
            startIndex: (pageNumber - 1) * displayAmount,
            count: displayAmount,
            sortBy: convertToBackEndSort(sortByString),
            q: search,
            categoryIds: categoryIdsList,
            status: statusString
        }

        const response = await fetchAuctions(config)

        if (response.status !== 200) return

        setAuctions(response.data.auctions)
        setPages(Math.ceil(response.data.count / displayAmount))

        const categoryResponse = await fetchCategories()
        setCategories(categoryResponse)
    }

    const update = (pageNumber, sortByString, search, filtersArray, statusString) => {

        getAuctions(pageNumber, sortByString, search, filtersArray, statusString)
    }

    useEffect(() => {
        update()
    }, [])

    const getCategory = (categoryId) => {
        return categories.filter((categorie) => categorie.categoryId === categoryId)[0]
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






    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <main>
                {/* Hero unit */}
                <Box>
                    <Container  style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }} maxWidth={"lg"}>
                        <Stack style={{ width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <TextField fullWidth label="Search" id="search" onChange={handleSearchChange}/>
                            <Pagination style={{ width: '100%', display: 'flex', justifyContent: "inherit"}} count={Math.floor(cards.length/ 10 )+1} />
                            {/*<Autocomplete*/}
                            {/*    multiple*/}
                            {/*    id="tags-outlined"*/}
                            {/*    options={top100Films}*/}
                            {/*    getOptionLabel={(option) => option.title}*/}
                            {/*    defaultValue={[top100Films[13]]}*/}
                            {/*    filterSelectedOptions*/}
                            {/*    renderInput={(params) => (*/}
                            {/*        <TextField*/}
                            {/*            {...params}*/}
                            {/*            label="filterSelectedOptions"*/}
                            {/*            placeholder="Favorites"*/}
                            {/*        />*/}
                            {/*    )}*/}
                            {/*/>*/}
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


                    </Container>
                </Box>
                <Container sx={{ py: 8 }} maxWidth="md">
                    {/* End hero unit */}
                    <Grid container spacing={4}>
                        {cards.map((card) => (
                            <Grid item key={card} xs={12} sm={6} md={4}>

                                    <Item />

                            </Grid>
                        ))}
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