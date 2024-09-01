import { Typography } from '@mui/material'
import React from 'react'

type TextItemProps = {
    text1: string,
    text2: string
}

const TextItem: React.FC<TextItemProps> = ({ text1, text2 }) => {
    return (
        <>
            <Typography variant="h6" paddingTop={1}>
                {text1}
            </Typography>
            <Typography variant="body1">
                {text2}
            </Typography>
        </>
    )
}

export default TextItem