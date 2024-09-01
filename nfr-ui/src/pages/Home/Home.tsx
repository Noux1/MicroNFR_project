import Pie from '../../components/Common/Common/Pie';
import Bar from '../../components/Common/Common/Bar';
import { Box, Typography, Stack, useTheme, useMediaQuery } from '@mui/material';

const Home = () => {
    const theme = useTheme()
    const isMedOrLgScreen = useMediaQuery(theme.breakpoints.down("lg"))

    return (
        <Stack direction='column' margin={isMedOrLgScreen ? 4 : 2} justifyContent='space-between'>
            <Typography variant='h5' sx={
                {
                    marginX: 6
                }
            }>
                Home
            </Typography>
            <Box className={isMedOrLgScreen ? "flex flex-col m-auto" : "flex flex-row"}>
                <Box
                    m={2}
                    height={400}
                    width={500}
                    pt={7}
                    sx={{ boxShadow: 2, zIndex: 10, borderRadius: 2 }}
                >
                    <Pie />
                    <Typography pt={4} textAlign='center'  >
                        Figure1: Pie represents authorities in each authority type.
                    </Typography>
                </Box>
                <Box m={2}
                    height={400}
                    width={500}
                    p={1}
                    sx={{ boxShadow: 2, zIndex: 10, borderRadius: 2 }}>
                    <Bar />
                    <Typography pt={4} textAlign='center'>
                        Figure2: Bar represents authorities, roles, and modules of the connected user.
                    </Typography>
                </Box>
            </Box>
        </Stack >
    );
}

export default Home