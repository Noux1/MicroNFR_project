import { useEffect, useMemo } from 'react'
import { useNotificationStore } from '../../store/NotificationStore/NotificationStore'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { Add, Refresh } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';


const Notifications = () => {
    const { notifications, getAllNotifications } = useNotificationStore()

    const columns = useMemo(() => [
        { field: 'userId', headerName: 'User', width: 80 },
        { field: 'notificationChannel', headerName: 'Channel', width: 100 },
        { field: 'subject', headerName: 'Subject', width: 200 },
        { field: 'body', headerName: 'Content', width: 350 },
        { field: 'time', headerName: 'Time', width: 250 }
    ], [])

    useEffect(() => {
        getAllNotifications()
    }, [getAllNotifications])


    const refreshEvents = () => {
        getAllNotifications()
    }

    const navigate = useNavigate();

    const handleViewDetails = (id: number) => {
        navigate(`/notifications/${id}`);
    };


    return (
        <Box
            sx={{
                height: 400, marginX: 6
            }}>
            <Stack direction='row' margin={2} justifyContent='space-between'>
                <Typography variant='h6' >Notifications</Typography>
                <IconButton size='small' onClick={refreshEvents}><Refresh /></IconButton>
            </Stack>

            <DataGrid
                columns={[
                    ...columns,
                    {
                        field: 'seen',
                        headerName: 'Status',
                        width: 100,
                        renderCell: (params: GridCellParams) => (
                            params.row.seen ? <span>Seen</span> : <span>Not Seen</span>
                        )
                    },
                    {
                        field: 'viewDetails',
                        headerName: 'View Details',
                        width: 100,
                        renderCell: (params: GridCellParams) => (
                            <IconButton onClick={() => handleViewDetails(params.row.id)}>
                                <Add />
                            </IconButton>
                        )
                    }
                ]}
                rows={notifications.map(notif => ({ ...notif, id: notif.id }))}
                getRowId={row => row.id}
            />

        </Box>
    );

}

export default Notifications