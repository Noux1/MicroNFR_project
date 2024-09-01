import { CircularProgress, Grid, Paper, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { NotificationType, useNotificationStore } from '../../store/NotificationStore/NotificationStore';
import BreadCrumbs from '../../components/Common/Reusable-components/BreadCrumbs';
import NotifItem from '../../components/Common/Reusable-components/TextItem'

const NotificationPage = () => {
    const { id } = useParams<{ id: string }>();
    const notificationId = parseInt(id, 10);
    const [notification, setNotification] = useState<NotificationType | null>(null)
    const { getNotificationById } = useNotificationStore()

    useEffect(() => {
        const fetchEvent = async () => {
            console.log(id)
            try {
                const NotificationData = await getNotificationById(notificationId)
                setNotification(NotificationData)
            } catch (error) {
                console.error("Failed to fetch notification", error)
            }
        }
        fetchEvent()
    }, [getNotificationById, id, notificationId])


    if (!notification) {
        return <Stack
            sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
            direction="column"
        >
            <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                <Stack
                    direction="column"
                    sx={{
                        height: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <CircularProgress />
                </Stack>
            </Paper >
        </Stack >
    }

    return (
        <>
            <BreadCrumbs to='/notifications' text1='Notifications' text2='Notification' />
            <Stack
                sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
                direction="column"
            >
                <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                    <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                        <Typography variant="h5" sx={{ paddingX: 1 }}>{notification.subject}</Typography>
                        <Grid container>
                            <Grid item lg={6}>
                                <NotifItem text1='User' text2={notification.userId.toString()} />
                                <NotifItem text1='Channel' text2={notification.notificationChannel} />
                            </Grid>
                            <Grid item md={6}>
                                <NotifItem text1='Status' text2={notification.seen ? 'Seen' : 'Not Seen'} />

                                <NotifItem text1='Time' text2={notification.time.toLocaleString()} />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <NotifItem text1='Content' text2={notification.body} />
                            </Grid>
                        </Grid>
                    </Stack>
                </Paper>
            </Stack>
        </>
    )
}

export default NotificationPage