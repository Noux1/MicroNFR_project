import { Grid, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { EventType, useEventStore } from '../../store/AuditStore/EventStore';
import Descriptions from './descriptions';
import EventItem from '../../components/Common/Reusable-components/EventItem';
import BreadCrumbs from '../../components/Common/Reusable-components/BreadCrumbs';

const Event = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<EventType | null>(null)
    const { getEventById } = useEventStore()

    useEffect(() => {
        const fetchEvent = async () => {
            console.log(eventId)
            try {
                const eventData = await getEventById(eventId)
                console.log(getEventById(eventId))
                console.log(eventData)

                setEvent(eventData)
            } catch (error) {
                console.error("Failed to fetch event", error)
            }
        }
        fetchEvent()
    }, [eventId, getEventById])



    // const event = {
    //     entityId: 1,
    //     entityName: 'entity',
    //     user: 'siham',
    //     action: 'delete',
    //     date: new Date(),
    //     moduleName: 'audit',
    //     description: 'gsdufhiuds'
    // }

    if (!event) {
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
        <>
            <BreadCrumbs to='/audit/events' text1='Events' text2='Event' />
            <Stack
                sx={{ py: 2, height: '90%', boxSizing: 'border-box', fontFamily: 'Nunito, sans serif', marginBottom: 4 }}
                direction="column"
            >
                <Paper sx={{ flex: 1, mx: 'auto', width: '80%', p: 2 }}>
                    <Stack direction="column" spacing={1} sx={{ height: 1 }}>
                        <Typography variant="h5" sx={{ fontFamily: 'Nunito, sans-serif', paddingX: 1 }}>{event.entityName.charAt(0).toUpperCase() + event.entityName.slice(1)}</Typography>
                        <Grid container>
                            <Grid item md={6}>
                                <EventItem text1='User' text2={event.utilisateur} />
                                <EventItem text1='Date' text2={event.date.toLocaleString()} />
                            </Grid>
                            <Grid item md={6}>
                                <EventItem text1='Action' text2={event.action} />
                                <EventItem text1='Module Name' text2={event.moduleName} />
                            </Grid>
                        </Grid>
                        {event.description && (<Grid container>
                            <Grid item>
                                <EventItem text1='Description' text2={event.description} />
                            </Grid>
                        </Grid>)}
                        {event.data && (<Grid container>
                            <Grid item>
                                <Typography variant="h5" sx={{ fontFamily: 'Nunito, sans-serif', paddingTop: 1 }}>
                                    Description
                                </Typography>
                                <Descriptions data={event.data} />
                            </Grid>
                        </Grid>)}
                    </Stack>
                </Paper >
            </Stack >
        </>
    )
}

export default Event