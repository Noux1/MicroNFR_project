import { useState } from "react";
import { useModeStore, useStyleStore } from "../../../store/CommonStore/StyleStore";
import { Box, Collapse, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip, Typography } from "@mui/material";
import { AccountTree, AdminPanelSettings, DarkModeRounded, Domain, ExpandLess, ExpandMore, Groups, LightModeRounded, Person, Lock, LockRounded, ViewModule, Assessment, NotificationAdd, LibraryBooks, Logout, Home } from "@mui/icons-material";
import ListItemComponent from "../Reusable-components/ListItemComponent";
import { useKeycloakStore } from "../../../store/AuthStore/KeycloakStore";

const Sidebar = () => {
    const [openList, setOpenList] = useState(true);

    const handleOpenList = () => {
        setOpenList(!openList);
    };

    const [activeItem, setActiveItem] = useState<string | null>(null);
    const handleToggleList = (item: string) => {
        setActiveItem(item === activeItem ? null : item)
    }

    const { openSidebar } = useStyleStore()

    const { mode, setMode } = useModeStore();
    const { keycloak } = useKeycloakStore()
    return (
        <Box sx={{ display: 'flex' }} >
            <Drawer
                sx={{
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: openSidebar ? '235px' : '70px',
                        transition: 'width 0.3s',
                        overflowX: 'hidden'
                    }
                }}
                variant="permanent"
                anchor="left"
                open={openSidebar}
            >
                <Box
                    className={mode === 'light' ? 'bg-[#F5F8FF]' : ' dark:bg-[#191C26]'}
                    height='100%'
                >
                    <Toolbar sx={{ display: openSidebar ? 'flex' : 'block', width: openSidebar ? 'auto' : '100%', margin: 'auto' }}>
                        <Domain sx={{ width: openSidebar ? 'auto' : '100%', margin: 'auto' }} />
                        {openSidebar && (
                            <Typography
                                variant='h6'
                                component='div'
                                sx={{ fontFamily: 'Nunito, sans-serif', paddingX: 2 }}
                            >
                                MicroNFR
                            </Typography>
                        )}
                        <Tooltip title="Change theme" sx={{ width: openSidebar ? 'auto' : '40%', margin: 'auto' }}>
                            <IconButton
                                onClick={setMode}
                            >
                                {mode === 'light' ? <DarkModeRounded /> : <LightModeRounded />}
                            </IconButton>
                        </Tooltip>
                    </Toolbar>

                    <Divider />

                    <Box sx={{ height: '80%' }}>
                        <List sx={{ height: '100%' }}>
                            <ListItemComponent selected={activeItem === 'Home'} onClick={() => handleToggleList('Home')} to='/' variant='body1' icon={<Home sx={{ height: '20px' }} />} name=' Home' fontWeight='600' openSidebar={openSidebar} title='Home' />
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
                                                    sx={{ fontFamily: 'Nunito, sans-serif', fontWeight: '600', marginLeft: '-16px' }}
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
                            <ListItemComponent selected={activeItem === 'Audit'} onClick={() => handleToggleList('Audit')} to='/audit/events' variant='body1' icon={<Assessment sx={{ height: '20px' }} />} name='Audit' fontWeight='600' openSidebar={openSidebar} title='Audit' />
                            <ListItemComponent selected={activeItem === 'Notification'} onClick={() => handleToggleList('Notification')} to='/notifications' variant='body1' icon={<NotificationAdd sx={{ height: '20px' }} />} name='Notification' fontWeight='600' openSidebar={openSidebar} title='Notification' />
                        </List >
                    </Box>

                    <Divider />

                    <Toolbar sx={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        {openSidebar && (
                            <Typography variant='h6' sx={{ fontFamily: 'Nunito, sans-serif' }}>
                                Logout
                            </Typography>
                        )}
                        <IconButton onClick={() => keycloak.logout()} sx={{ width: openSidebar ? '100%' : '40%', margin: 'auto' }}>
                            <Logout sx={{ height: '20px' }} />
                        </IconButton>
                    </Toolbar>
                </Box >
            </Drawer >
        </Box >
    )
}

export default Sidebar