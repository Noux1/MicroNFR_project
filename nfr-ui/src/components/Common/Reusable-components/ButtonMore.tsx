import React, { useState } from 'react'
import { MoreVert } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, Menu, MenuItem } from '@mui/material'
// import { usePopupStore } from '../../../store/CommonStore/StyleStore'

interface ButtonMoreProps {
    id: number;
    handleUpdate: (id: number) => void;
    handleDelete: (id: number) => void;
}

const ButtonMore: React.FC<ButtonMoreProps> = ({ id, handleDelete, handleUpdate }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const [openDialog, setOpenDialog] = useState(false);

    // const { openPopup } = usePopupStore()

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleUpdateClick = () => {
        handleUpdate(id);
        setOpenDialog(false)
    };

    const handleDeleteClick = () => {
        handleDelete(id);
    };

    return (
        <>
            <IconButton
                id='more-button'
                aria-haspopup='true'
                aria-controls={open ? 'more-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MoreVert />
            </IconButton>
            <Menu
                id='more-menu'
                open={open}
                anchorEl={anchorEl}
                MenuListProps={{
                    'aria-labelledby': 'more-button'
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left'
                }}
                onClose={handleClose}
            >
                <MenuItem onClick={handleUpdateClick}>
                    Update
                </MenuItem>
                <MenuItem onClick={handleOpenDialog}>
                    Delete
                </MenuItem>
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Do you really want to delete it?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button color='error' onClick={handleDeleteClick} autoFocus>
                            Delete
                        </Button>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Menu >
        </>
    );
};

export default ButtonMore;