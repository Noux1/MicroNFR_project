import { useState, useEffect } from 'react';
import { Menu, Notifications } from '@mui/icons-material';
import { AppBar, Badge, IconButton, MenuItem, Popover, Stack, Toolbar } from '@mui/material';
import { useModeStore, useStyleStore } from '../../../store/CommonStore/StyleStore';
import { setupSocket } from '../../../socketFunctions';
import { useNavigate } from 'react-router-dom';
//@ts-ignore
import notificationSound from '../../../assets/notification_sound.mp3';
import { useUserStore } from '../../../store/AdminStore/UserStore';
import { axiosInstance2 } from '../../../utils/AxiosInstance';


const Navbar = () => {
    const { openSidebar, setOpenSidebar } = useStyleStore();
    const { mode } = useModeStore();
    const [anchorEl, setAnchorEl] = useState(null);
    const { user } = useUserStore()
    const [notifications, setNotifications] = useState([]);
    const [unseenCount, setUnseenCount] = useState(0);
    const maxVisibleNotifications = 4;
    const navigate = useNavigate();
    const socket = setupSocket();

    useEffect(() => {
        if (user.uuid) {
            socket.emit('join-room', user.uuid);
        }
    }, [user.uuid]);


    useEffect(() => {

        socket.on('notification', (notification) => {
            console.log(notification);
            const audio = new Audio(notificationSound);
            // Update notifications state with the new notification
            setNotifications(prevNotifications => [notification, ...prevNotifications]);

            // Update unseen count based on the new notification
            setUnseenCount(prevCount => prevCount + 1);
            if (audio.play) {
                try {
                    audio.play();
                } catch (error) {
                    console.error('Error playing notification sound:', error);
                }
            }
        });
        return () => {
            socket.off('notification');
        };
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user || !user.uuid) {
                return;
            }

            try {
                const response = await axiosInstance2.get(`/users/${user.uuid}/notifications`);
                const notificationsData = response.data.notifications;
                if (notificationsData && notificationsData.length > 0) {
                    const reversedNotifications = notificationsData.reverse();
                    setNotifications(reversedNotifications);
                    const unseenNotifications = reversedNotifications.filter(notification => !notification.seen);
                    setUnseenCount(unseenNotifications.length);
                } else {
                    setNotifications([]);
                    setUnseenCount(0);
                }
            } catch (error) {
                console.error('Failed to get notifications for user:', error);
            }
        };

        fetchNotifications();
    }, [user]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleSidebar = () => {
        setOpenSidebar(!openSidebar)
    }

    const handleNotificationClick = async (notificationId, seen, navigateTo) => {
        try {
            await axiosInstance2.put(`/notifications/${notificationId}/read`);
            if (!seen) {
                setUnseenCount(prevCount => Math.max(0, prevCount - 1));
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        notification.id === notificationId
                            ? { ...notification, seen: true }
                            : notification
                    )
                );
            }
            navigate(navigateTo);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'notifications-popover' : undefined;

    const itemHeight = 80;

    let popoverHeight;
    if (notifications.length === 0) {
        popoverHeight = itemHeight;
    } else {
        popoverHeight = Math.min(notifications.length * itemHeight, maxVisibleNotifications * itemHeight);
    }

    return (
        <AppBar position="sticky" sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'white' }} elevation={0}>
            <Toolbar className={mode === 'light' ? 'bg-white' : 'bg-[#283042]'}>
                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ width: '100%' }}>
                    <IconButton onClick={toggleSidebar}>
                        <Menu />
                    </IconButton>
                    <Stack direction='row' spacing={2} alignItems="center">
                        <IconButton onClick={handleClick} aria-describedby={id}>
                            {unseenCount > 0 ? (
                                <Badge badgeContent={unseenCount} color="error">
                                    <Notifications />
                                </Badge>
                            ) : (
                                <Notifications />
                            )}
                        </IconButton>

                    </Stack>
                    <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        slotProps={{
                            paper: {
                                sx: {
                                    width: 400,
                                    maxHeight: popoverHeight,
                                    overflowY: 'auto',
                                    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2)'
                                }
                            }
                        }}
                    >
                        {notifications.length === 0 ? (
                            <MenuItem onClick={handleClose} sx={{ height: itemHeight, display: 'flex', justifyContent: 'center', color: 'gray' }}>No notifications yet</MenuItem>
                        ) : (notifications.map((notification, index) => {
                            const notificationDateTime = new Date(notification.time);
                            const formattedDate = notificationDateTime.toLocaleDateString('en-GB');
                            const formattedTime = notificationDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                            const currentDate = new Date();
                            const isToday = currentDate.toDateString() === notificationDateTime.toDateString();
                            const isYesterday = new Date(currentDate.getTime() - 86400000).toDateString() === notificationDateTime.toDateString();

                            return (
                                <MenuItem key={index} onClick={() => { handleNotificationClick(notification.id, notification.seen, `/notifications/${notification.id}`); handleClose(); }} sx={{ height: itemHeight, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', backgroundColor: notification.seen ? 'transparent' : (mode === 'light' ? '#F5F8FF' : '#5e5e5e') }}>
                                    <div style={{ marginBottom: '4px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{notification.subject}</div>
                                        <div style={{ width: '100%' }}>{notification.body}</div>
                                    </div>
                                    <div style={{ width: '100%', fontSize: 'small', color: mode === 'light' ? 'gray' : '#bfbfbf', display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            {isToday ? '' : isYesterday ? 'Yesterday' : formattedDate}
                                        </div>
                                        <div>{formattedTime}</div>
                                    </div>
                                </MenuItem>
                            );
                        }))}
                    </Popover>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
