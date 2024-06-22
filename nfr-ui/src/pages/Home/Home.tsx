import Pie from '../../components/Common/Common/Pie';
import Bar from '../../components/Common/Common/Bar';
import { Box, Paper, Typography, Stack } from '@mui/material';

const Home = () => {

    return (
        <Stack direction='column' margin={2} justifyContent='space-between'>
            <Typography variant='h5' sx={
                {
                    fontFamily: 'Nunito, sans serif'
                }
            }>
                Home
            </Typography>
            <Box sx={{ display: 'flex' }}>
                <Box
                    m={2}
                    height={400}
                    width={500}
                    pt={7}
                    sx={{ boxShadow: 2 }}
                >
                    <Pie />
                    <Typography pt={4} textAlign='center' fontWeight='Nunito, sans-serif'>
                        Figure1: Pie represents authorities in each authority type.
                    </Typography>
                </Box>
                <Box m={2}
                    height={400}
                    width={500}
                    p={1}
                    sx={{ boxShadow: 2 }}>
                    <Bar />
                    <Typography pt={4} textAlign='center' fontWeight='Nunito, sans-serif'>
                        Figure2: Bar represents authorities, roles, and modules of the connected user.
                    </Typography>
                </Box>
            </Box>
        </Stack>
    );
}

export default Home