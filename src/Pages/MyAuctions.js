import * as React from 'react';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useState} from "react";


const isLoggedIn = () => {
    const userId = Cookies.get('UserId')
    return userId !== undefined && userId !== null

}

const getAuctions = async () => {
    const response =  await axios.get(`http://localhost:4941/api/v1/auctions`)
    return response;
}

const theme = createTheme();

export default function UserProfile() {

    const [auctions, setAuctions] = useState([])

    const navigate = useNavigate()

    React.useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
        }

        const allItems = () => {
            getAuctions().then((res) => {
                setAuctions(res.data.auctions)
                }

            )
        }


    })

    return (
        <ThemeProvider theme={theme}>
            <Grid container >

            </Grid>
        </ThemeProvider>
    );
}