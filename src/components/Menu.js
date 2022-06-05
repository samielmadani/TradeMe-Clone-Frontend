import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Container from "@mui/material/Container";
import AdbIcon from "@mui/icons-material/Adb";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";


let pages = ['Browse All', 'Profile', 'My Auctions', 'Edit Profile'];
let listtt = ['Login', 'Register'];


const checkLogger = () => {
   return Cookies.get('UserId') !== undefined && Cookies.get('UserId') !== null

}

const logout = async () => {

    return await axios.post(`http://localhost:4941/api/v1/users/logout`, {}, {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    })
        .then((response) => {
            Cookies.remove('UserId')
            Cookies.remove('UserToken')
            return response.status;
        })
}
const userImage = () => {
    if (!checkLogger()) return ""
    return `http://localhost:4941/api/v1/users/${ parseInt(Cookies.get('UserId') || "") || undefined }/image`
}
const whoDis = async () => {

    if (!checkLogger()) {
        return undefined
    }

    return await axios.get(`http://localhost:4941/api/v1/users/${parseInt(Cookies.get('UserId') || "") || undefined}`, {
        headers: {
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    })

}


export default function ClippedDrawer() {



    const [getAnc, SetAnc] = useState(null);
    const [userName, setUserName] = useState("User")
    const navvv = useNavigate()



        if (checkLogger()) {
            pages = ['Browse All', 'Profile', 'My Auctions', 'Edit Profile']
        } else {
            pages = ['Browse All', 'Login', 'Register']
        }

    const opensmallMenu = (event) => {
        if (checkLogger()) {
            listtt = ['Profile', 'Logout']
        } else {
            listtt = ['Login', 'Register']
        }
        SetAnc(event.currentTarget);
    };


    const closerMenu = async (location) => {
        SetAnc(null);
        if (location === 'Logout') {
            await logout()
            navvvvy('login')
            return
        }

        if (location === 'Browse All') {
            navvvvy('')
            return
        }

        if (location === 'Login') {
            navvvvy('login')
            return
        }

        if (location === 'Register') {
            navvvvy('register')
            return
        }

        if (location === 'Profile') {
            navvvvy('userProfile')
            return
        }

        if (location === 'My Auctions') {
            navvvvy('myauctions')
            return
        }

        if (location === 'Edit Profile') {
            navvvvy('editProfile')
            return
        }




    };

    const navvvvy = (location) => {
        navvv(`/${location.toLowerCase()}`)
    }

    useEffect(() => {
        const getUser = async () => {
            const response = await whoDis()

            if (response === undefined || response.status !== 200) return
            setUserName("test")
        }

        getUser()
    }, [])


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Link href="/">
                            <Typography
                                variant="h6"
                                component="a"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'white',
                                    textDecoration: 'none',
                                }}
                            >SENG365</Typography>
                        </Link>

                        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            SENG365
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open">
                                <IconButton onClick={opensmallMenu} sx={{ p: 0 }}>
                                    <Avatar src={userImage()} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={getAnc}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(getAnc)}
                                onClose={closerMenu}
                            >
                                {listtt.map((setting) => (
                                    <MenuItem key={setting} onClick={async () => await closerMenu(setting)}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {pages.map((a, b) => (
                            <ListItem key={a} disablePadding onClick={async () => await closerMenu(a)}>
                                <ListItemButton>
                                    <ListItemText primary={a} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <Divider/>

                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
            </Box>
        </Box>
    );
}
