import { useState } from "react";
import { useModeStore, useStyleStore } from "../../../store/CommonStore/StyleStore";
import { Box, Divider, Drawer, IconButton, List, Toolbar, Tooltip, Typography } from "@mui/material";
import { DarkModeRounded, Domain, LightModeRounded, Assessment, NotificationAdd, Logout, Home } from "@mui/icons-material";
import { useKeycloakStore } from "../../../store/AuthStore/KeycloakStore";
import { useUserStore } from "../../../store/AdminStore/UserStore";
import ListItemComponent from "./ListItemComponent";
import AdminListItem from "./AdminListItem";


const Sidebar = () => {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const { openSidebar } = useStyleStore()
    const { mode, setMode } = useModeStore();
    const { keycloak } = useKeycloakStore()
    const { user } = useUserStore()

    const handleToggleList = (item: string) => {
        setActiveItem(item === activeItem ? null : item)
    }

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
                    height='100%' >
                    <Toolbar sx={{ display: openSidebar ? 'flex' : 'block', width: openSidebar ? 'auto' : '100%', margin: 'auto' }}>
                        <Domain sx={{ width: openSidebar ? 'auto' : '100%', margin: 'auto' }} />
                        {openSidebar && (
                            <Typography
                                variant='h6'
                                component='div'
                                sx={{ paddingX: 2 }}
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
                            <AdminListItem openSidebar={openSidebar} activeItem={activeItem} handleToggleList={handleToggleList} />
                            <ListItemComponent selected={activeItem === 'Audit'} onClick={() => handleToggleList('Audit')} to='/audit/events' variant='body1' icon={<Assessment sx={{ height: '20px' }} />} name='Audit' fontWeight='600' openSidebar={openSidebar} title='Audit' />
                            <ListItemComponent selected={activeItem === 'Notification'} onClick={() => handleToggleList('Notification')} to='/notifications' variant='body1' icon={<NotificationAdd sx={{ height: '20px' }} />} name='Notification' fontWeight='600' openSidebar={openSidebar} title='Notification' />
                        </List >
                    </Box>

                    <Divider />

                    <Toolbar sx={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                        {openSidebar && (
                            <Typography variant='body2' >
                                {user.email}
                            </Typography>
                        )}
                        <IconButton onClick={() => keycloak.logout()} sx={{ width: 'auto', margin: 'auto' }}>
                            <Logout sx={{ height: '20px' }} />
                        </IconButton>
                    </Toolbar>
                </Box >
            </Drawer >
        </Box >
    )
}

export default Sidebar