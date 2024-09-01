import { Box, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { ExpandLess, ExpandMore, AdminPanelSettings, Person, Groups, AccountTree, Lock, LockRounded, ViewModule } from "@mui/icons-material";
import { useState } from "react";
import ListItemComponent from "./ListItemComponent";
import { useModeStore } from "../../../store/CommonStore/StyleStore";

interface AdminListItemProps {
    openSidebar: boolean;
    activeItem: string | null;
    handleToggleList: (item: string) => void;
}

const AdminListItem = ({ openSidebar, activeItem, handleToggleList }: AdminListItemProps) => {
    const { mode } = useModeStore();
    const [openList, setOpenList] = useState(true);

    const handleOpenList = () => {
        setOpenList(!openList);
    };

    return (
        <ListItem disablePadding>
            <Box
                sx={{
                    width: openSidebar ? '100%' : '70px',
                    display: 'grid',
                    gridTemplateRows: '1fr',
                    transition: '0.2s ease',
                    '& > *': {
                        overflow: 'hidden',
                    },
                    marginX: openSidebar ? '8px' : '0px'
                }}
            >
                <ListItemButton onClick={handleOpenList} sx={{ borderRadius: '5px', height: '35px' }}>
                    <ListItemIcon>
                        <AdminPanelSettings sx={{ height: '20px' }} />
                    </ListItemIcon>
                    {openSidebar && (
                        <ListItemText>
                            <Typography
                                variant='body1'
                                component='div'
                                className={mode === 'light' ? 'text-black' : ' dark:text-white'}
                                sx={{ fontWeight: '600', marginLeft: '-16px' }}
                            >
                                Admin
                            </Typography>
                        </ListItemText>
                    )}
                    {openSidebar && (openList ? <ExpandLess sx={{ height: '20px' }} /> : <ExpandMore sx={{ height: '20px' }} />)}
                </ListItemButton>

                <Collapse in={openList} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        <ListItemComponent selected={activeItem === 'Users'} onClick={() => handleToggleList('Users')} to='/admin/users' variant='body2' icon={<Person sx={{ height: '20px' }} />} name=' Users' openSidebar={openSidebar} title='Users' />
                        <ListItemComponent selected={activeItem === 'Groups'} onClick={() => handleToggleList('Groups')} to='/admin/groups' variant='body2' icon={<Groups sx={{ height: '20px' }} />} name='Groups' openSidebar={openSidebar} title='Groups' />
                        <ListItemComponent selected={activeItem === 'Roles'} onClick={() => handleToggleList('Roles')} to='/admin/roles' variant='body2' icon={<AccountTree sx={{ height: '20px' }} />} name='Roles' openSidebar={openSidebar} title='Roles' />
                        <ListItemComponent selected={activeItem === 'Authorities'} onClick={() => handleToggleList('Authorities')} to='/admin/authorities' variant='body2' icon={<Lock sx={{ height: '20px' }} />} name='Authorities' openSidebar={openSidebar} title='Authorities' />
                        <ListItemComponent selected={activeItem === 'AuthorityTypes'} onClick={() => handleToggleList('AuthorityTypes')} to='/admin/authorityTypes' variant='body2' icon={<LockRounded sx={{ height: '20px' }} />} name='Authority Types' openSidebar={openSidebar} title='Authority Types' />
                        <ListItemComponent selected={activeItem === 'Modules'} onClick={() => handleToggleList('Modules')} to='/admin/modules' variant='body2' icon={<ViewModule sx={{ height: '20px' }} />} name='Modules' openSidebar={openSidebar} title='Modules' />
                    </List>
                </Collapse>
            </Box>
        </ListItem>
    );
};

export default AdminListItem;
