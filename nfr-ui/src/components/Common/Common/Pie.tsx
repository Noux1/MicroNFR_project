import { useEffect, useState } from 'react'
import { PieChart } from '@mui/x-charts';
import { useAuthorityStore } from '../../../store/AdminStore/AuthorityStore';
import { useModeStore } from '../../../store/CommonStore/StyleStore';

const Pie = () => {
    const { authorities, getAuthorities } = useAuthorityStore()
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        getAuthorities()
    }, [getAuthorities])


    useEffect(() => {
        const keywords = ["USER", "MODULE", "AUTHORITY", "AUTHORITY_TYPE", "ROLE", "GROUP"];

        // Initialize an object to store the counts for each keyword
        const counts = {};

        // Filter authorities based on the keywords
        const filtered = authorities.filter((authority) => {
            const firstWord = authority.libelle.split('_')[0];
            if (keywords.includes(firstWord)) {
                // Increment the count for the keyword
                counts[firstWord] = (counts[firstWord] || 0) + 1;
                return true;
            }
            return false;
        });

        const chartData = Object.entries(counts).map(([keyword, count]) => ({
            id: keyword,
            value: count,
            label: keyword,
        }));

        setChartData(chartData);
    }, [authorities])
    const { mode } = useModeStore(); // Get the mode from the mode store

    // Define colors for light mode and dark mode
    const lightModeColors = ['#F5F8FF', '#DCE6FF', '#C2D4FF', '#A9C2FF', '#8FB1FF'];
    const darkModeColors = ['#769FFF', '#5C8DFF', '#427BFF', '#2969FF', '#1057FF'];

    return (
        <PieChart
            series={
                [
                    {
                        data: chartData,
                    },
                ]}
            width={400}
            height={200}
            colors={mode === 'light' ? lightModeColors : darkModeColors}
        />
    )
}

export default Pie