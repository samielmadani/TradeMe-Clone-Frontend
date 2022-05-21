import * as React from 'react';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";


const isLoggedIn = () => {
    const userId = Cookies.get('UserId')
    return userId !== undefined && userId !== null

}

const theme = createTheme();

export default function UserProfile() {

    const navigate = useNavigate()

    React.useEffect(() => {
        if (!isLoggedIn()) {
            navigate('/login');
        }
    })

    return (
        <ThemeProvider theme={theme}>
            <Grid container >

            </Grid>
        </ThemeProvider>
    );
}