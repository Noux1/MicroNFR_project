import { Grid, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { NotificationType, useNotificationStore } from '../../store/NotificationStore/NotificationStore';

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
            sx={{ py: 2, height: '100%', boxSizing: 'border-box', fontFamily: 'Nunito, sans serif' }}
            direction="column"
        >
            <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
                <Typography variant="h6" sx={{ fontFamily: 'Nunito, sans-serif' }}>
                    Loading...
                </Typography>
            </Paper>
        </Stack>
    }

    return (
        <Stack
            sx={{ py: 2, height: '100%', boxSizing: 'border-box', fontFamily: 'Nunito, sans serif' }}
            direction="column"
        >
            <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                    <Typography variant="h5" sx={{ fontFamily: 'Nunito, sans-serif', paddingX: 1 }}>{notification.subject}</Typography>
                    <Grid container>
                        <Grid item lg={6}>
                            <Typography variant="h6" sx={{ fontFamily: 'Nunito, sans-serif', paddingTop: 1 }}>
                                User
                            </Typography>
                            <Typography variant="h6" color="textSecondary" sx={{ fontFamily: 'Nunito, sans-serif' }}>{notification.userId}</Typography>
                            <Typography variant="h6" sx={{ fontFamily: 'Nunito, sans-serif', paddingTop: 1 }} >
                                Channel
                            </Typography>
                            <Typography variant="h6" color="textSecondary" sx={{ fontFamily: 'Nunito, sans-serif' }}>{notification.notificationChannel}</Typography>
                        </Grid>
                        <Grid item md={6}>
                            <Typography variant="h6" sx={{ fontFamily: 'Nunito, sans-serif', paddingTop: 1 }} >
                                Content
                            </Typography>
                            <Typography variant="h6" color="textSecondary" sx={{ fontFamily: 'Nunito, sans-serif' }}>
                                {notification.body}
                            </Typography>
                            <Typography variant="h6" sx={{ fontFamily: 'Nunito, sans-serif', paddingTop: 1 }} >
                                Time
                            </Typography>
                            <Typography variant="h6" color="textSecondary" sx={{ fontFamily: 'Nunito, sans-serif' }}>
                                {notification.time.toLocaleString()}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item>
                            <Typography variant="h6" sx={{ fontFamily: 'Nunito, sans-serif', paddingTop: 1 }}>
                                Status
                            </Typography>
                            <Typography variant="h6" color="textSecondary" sx={{ fontFamily: 'Nunito, sans-serif' }}>{notification.seen ? 'Seen' : 'Not Seen'}</Typography>

                        </Grid>
                    </Grid>
                </Stack>
            </Paper>
        </Stack>
    )
}

export default NotificationPage