import React from 'react';
import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MoreVertIcon from "@mui/icons-material/MoreVert";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
    },
    dropDown: {
        color: 'inherit',
    }
}));

export default function SimpleListMenu({ children }) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    // const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        // setSelectedIndex(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <List className={ classes.dropDown } component="nav" aria-label="Device settings">
                <ListItem
                    disablePadding
                    // button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    onClick={handleClickListItem}
                >
                    {/*<ListItemText primary="When device is locked" secondary={options[selectedIndex]} />*/}
                    <MoreVertIcon />
                </ListItem>
            </List>
            <Menu
                id="lock-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {children.length ? children.map((item, index) => {
                    if (item == null) return;
                    return (<MenuItem
                        key={index}
                        disabled={ item.props.disabled }
                        // selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {item}
                    </MenuItem>)
                }) : null}
            </Menu>
        </div>
    );
}
