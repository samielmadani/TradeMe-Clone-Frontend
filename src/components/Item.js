import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from "axios";


const fetchImage = async (auctionId) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions/${auctionId}/image`)
        .then((response) => {
            return `http://localhost:4941/api/v1/auctions/${auctionId}/image`
        })
        .catch((error) => {
            // return require("../assets/no_image.png")
        })
}

const fetchAuction = async (id) => {
    return await axios.get(`http://localhost:4941/api/v1/auctions/${id}`)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response;
        })
}

const formatNumberToMoney = (number) => {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    });

    return formatter.format(number);
}

const getTimeRemaining = (date) => {

    const end = new Date(Date.parse(date))
    const cur = new Date()
    const day = Math.floor(end.getTime() - cur.getTime() / 864000);
    const hour = Math.floor(end.getTime() - cur.getTime() / 360000);
    const min = Math.floor(end.getTime() - cur.getTime() / 6000);

    if (day > 1) return `closes in ${day} days`
    if (day > 0) return `closes tomorrow`
    if (hour > 0) return `closes in ${hour} hours`
    if (min > 0) return `closes in ${min} minutes`
    if (min < 0) return `Auction closed`

    return "closing soon"
}

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function RecipeReviewCard() {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        R
                    </Avatar>
                }
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title="Shrimp and Chorizo Paella"
                subheader="September 14, 2016"
            />
            <CardMedia
                component="img"
                height="194"
                image="/static/images/cards/paella.jpg"
                alt="Paella dish"
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    This impressive paella is a perfect party dish and a fun meal to cook
                    together with your guests. Add 1 cup of frozen peas along with the mussels,
                    if you like.
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Method:</Typography>
                    <Typography paragraph>
                        Heat 1/2 cup of the broth in a pot until simmering, add saffron and set
                        aside for 10 minutes.
                    </Typography>

                </CardContent>
            </Collapse>
        </Card>
    );
}
