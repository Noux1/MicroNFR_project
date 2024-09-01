import { NavigateNext } from '@mui/icons-material'
import { Breadcrumbs, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

interface BreadcrumbsProps {
    to: string,
    text1: string,
    text2: string
}

const BreadCrumbs: React.FC<BreadcrumbsProps> = ({ to, text1, text2 }) => {
    return (
        <Stack spacing={1} sx={{ paddingLeft: 4 }}>
            <Breadcrumbs separator={<NavigateNext fontSize='small' />}>
                <Link to={to}>
                    <Typography >{text1}</Typography>
                </Link>
                <Typography>{text2}</Typography>
            </Breadcrumbs>
        </Stack >
    )
}

export default BreadCrumbs