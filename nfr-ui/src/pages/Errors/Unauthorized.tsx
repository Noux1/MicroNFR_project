import { Box, Link, Typography } from '@mui/material'

const Unauthorized = () => {
    return (
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <Typography variant="h2">401</Typography>
            <Typography variant="h4">Unauthorized</Typography>
            <Typography variant="h6">You are not authorized to access this page.</Typography>
            <Link href='/' underline='hover'>
                <Typography variant="h6">Go Back To Home</Typography>
            </Link>
        </Box >
    )
}

export default Unauthorized