import { Typography } from '@mui/material'
import React from 'react'

type EventItemProps = {
    text1: string,
    text2: string
}

const EventItem: React.FC<EventItemProps> = ({ text1, text2 }) => {
    return (
        <>
            <Typography variant="h6" sx={{ fontFamily: 'Nunito, sans-serif', paddingTop: 1 }} >
                {text1}
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Nunito, sans-serif' }}>
                {text2}
            </Typography>
        </>
    )
}

export default EventItem