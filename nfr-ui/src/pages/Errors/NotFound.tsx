import { Box, Link, Typography } from '@mui/material'


const NotFound = () => {
    return (
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant="h2">404</Typography>
            <Typography variant="h4">Page Not Found</Typography>
            <Typography variant="h6">The page you are looking for may have been deleted or is temporarily unavailable.</Typography>
            <Link href='/' underline='hover'>
                <Typography variant="h6">Go Back To Home</Typography>
            </Link>
        </Box >
    )
}

export default NotFound