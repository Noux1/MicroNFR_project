import React, { useEffect, useState } from 'react'
import { User, useUserStore } from '../../../store/AdminStore/UserStore';
import { BarChart } from '@mui/x-charts';
import { useModeStore } from '../../../store/CommonStore/StyleStore';

const Bar = () => {
    const { user, getUser } = useUserStore();
    const [chartData, setChartData] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedUser: User = await getUser(user.id);
                const rolesCount = fetchedUser.roleResponses.length;
                const modulesCount = fetchedUser.moduleResponses.length;
                const authoritiesCount = fetchedUser.authorityResponses.length;

                // Format the data for the bar chart
                const data = [
                    rolesCount,
                    modulesCount,
                    authoritiesCount
                    ,
                ];

                setChartData(data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchData();
    }, [getUser, user.id]);

    const { mode } = useModeStore(); // Get the mode from the mode store

    // Define colors for light mode and dark mode
    const lightModeColor = ['#C2D4FF'];
    const darkModeColor = ['#427BFF'];


    return (
        <BarChart
            xAxis={[{ scaleType: 'band', data: ['Roles', 'Modules', 'Authorities'] }]}
            series={[{ data: chartData }]}
            width={500}
            height={300}
            colors={mode === 'light' ? lightModeColor : darkModeColor}
        />
    );
};

export default Bar;