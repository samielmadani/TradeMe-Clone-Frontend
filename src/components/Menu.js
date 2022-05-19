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
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Container from "@mui/material/Container";
import AdbIcon from "@mui/icons-material/Adb";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import axios from "axios";

const isLoggedIn = () => {
    const userId = Cookies.get('UserId')
    return userId !== undefined && userId !== null
}

const logout = async () => {
    const config = {
        headers: {
            "content-type": "application/json",
            "X-Authorization": Cookies.get('UserToken') || ""
        }
    }

    return await axios.post(`http://localhost:4941/api/v1/users/logout`, {}, config)
        .then((response) => {
            Cookies.remove('UserId')
            Cookies.remove('UserToken')
            return response.status;
        })
        .catch((error) => {
            console.log(error)
            return error.response.status;
        })
}

const getProfilePhoto = () => {
    if (!isLoggedIn()) return ""
    const userId = parseInt(Cookies.get('UserId') || "") || undefined

    return `http://localhost:4941/api/v1/users/${userId}/image`
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

const drawerWidth = 240;
const pages = ['Auctions', 'My Auctions', 'Profile'];
let settings = ['Login', 'Register'];


export default function ClippedDrawer() {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [userName, setUserName] = useState("User")
    const navigater = useNavigate()

    const handleOpenUserMenu = (event) => {
        if (isLoggedIn()) {
            settings = ['Profile', 'Account', 'Logout']
        } else {
            settings = ['Login', 'Register']
        }
        setAnchorElUser(event.currentTarget);
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = async (location) => {
        setAnchorElUser(null);
        if (location === 'Logout') {
            await logout()
            navigate('login')
            return
        }
        navigate(location)
    };

    const navigate = (location) => {
        navigater(`/${location.toLowerCase()}`)
    }

    useEffect(() => {
        const getUser = async () => {
            const response = await getLoggedInUser()

            if (response == undefined || response.status !== 200) return
            console.log(response)
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
                            LOGO
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

                        </Box>

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={userName} src={getProfilePhoto()} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={async () => await handleCloseUserMenu(setting)}>
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
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {settings.map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                        <div onClick={(e) => navigate(text)}>{text}</div>

                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        {['All mail', 'Trash', 'Spam'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
            </Box>
        </Box>
    );
}
