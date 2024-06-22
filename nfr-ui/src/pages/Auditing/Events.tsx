// import { useEffect, useMemo } from 'react'
// import { useEventStore } from '../../store/AuditStore/EventStore'
// import { Box, IconButton, Stack, Typography } from '@mui/material'
// import { DataGrid, GridCellParams } from '@mui/x-data-grid';
// import { Add, Refresh } from '@mui/icons-material';

// import { useNavigate } from 'react-router-dom';


// const Events = () => {
//     const { events, getAllEvents, filterAuditEvents } = useEventStore()

//     const columns = useMemo(() => [
//         { field: 'entityName', headerName: 'Entity Name', width: 100 },
//         { field: 'utilisateur', headerName: 'User', width: 100 },
//         { field: 'action', headerName: 'Action', width: 150 },
//         { field: 'date', headerName: 'Date', width: 200 },
//         { field: 'moduleName', headerName: 'Module Name', width: 150 }
//     ], [])

//     useEffect(() => {
//         getAllEvents()
//         console.log(events)
//     }, [getAllEvents])


//     const refreshEvents = () => {
//         getAllEvents()
//     }

//     const navigate = useNavigate();

//     const handleViewDetails = (entityId: number) => {
//         navigate(`/audit/events/${entityId}`);
//     };


//     return (
//         <Box
//             sx={{
//                 height: 400, marginX: 6
//             }}>
//             <Stack direction='row' margin={2} justifyContent='space-between'>
//                 <Typography variant='h6' sx={
//                     {
//                         fontFamily: 'Nunito, sans serif'
//                     }
//                 }>Events</Typography>
//                 <IconButton size='small' onClick={refreshEvents}><Refresh /></IconButton>
//             </Stack>
//             <DataGrid
//                 columns={[
//                     ...columns,
//                     {
//                         field: 'viewDetails',
//                         headerName: 'View Details',
//                         width: 100,
//                         renderCell: (params: GridCellParams) => (
//                             <IconButton
//                                 onClick={() => handleViewDetails(params.row._id)}
//                             >
//                                 <Add />
//                             </IconButton>
//                         )
//                     }
//                 ]}
//                 rows={events}
//                 getRowId={row => row._id}
//                 sx={{
//                     fontFamily: 'Nunito, sans serif'
//                 }}
//             />

//         </Box >
//     )
// }

// export default Events

// <Box sx={{ marginX: 6, marginY: 2 }}>
//     <Stack direction='row' justifyContent='space-between' spacing={4} sx={{ marginBottom: 2 }}>
//         <AuditFilter
//             label='User'
//             value={userFilter}
//             onChange={(e) => setUserFilter(e.target.value)}
//         />
//         <AuditFilter
//             label='Action'
//             value={actionFilter}
//             onChange={(e) => setActionFilter(e.target.value)}
//         />
//         <AuditFilter
//             label='Module Name'
//             value={moduleNameFilter}
//             onChange={(e) => setModuleNameFilter(e.target.value)}
//         />
//         <AuditFilter
//             label='Entity'
//             value={entityFilter}
//             onChange={(e) => setEntityFilter(e.target.value)}
//         />
//         <AuditFilter
//             label='Start Date'
//             value={startDateFilter}
//             onChange={(e) => setStartDateFilter(e.target.value)}
//         />
//         <AuditFilter
//             label='End Date'
//             value={endDateFilter}
//             onChange={(e) => setEndDateFilter(e.target.value)}
//         />
//         <Button color='primary' variant='contained' size='small' onClick={refreshEvents}>Refresh</Button>
//         <Button color='primary' variant='contained' size='small' onClick={handleFilterChange}>Apply Filters</Button>
//     </Stack>
//     <AuditTable
//         columnHeaders={columnHeadres}
//         dataTable={events}
//     />
// </Box >

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography, IconButton } from '@mui/material';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { Add, Refresh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { EventType, useEventStore } from '../../store/AuditStore/EventStore';

const Events = () => {
    const { events, getAllEvents, filterAuditEvents } = useEventStore();
    const [filteredEvents, setFilteredEvents] = useState<EventType[]>([]);
    const [filterField, setFilterField] = useState<string>('');
    const [filterValue, setFilterValue] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [isFiltered, setIsFiltered] = useState<boolean>(false);


    const columns = useMemo(() => [
        { field: 'entityName', headerName: 'Entity Name', width: 100 },
        { field: 'utilisateur', headerName: 'User', width: 100 },
        { field: 'action', headerName: 'Action', width: 150 },
        { field: 'date', headerName: 'Date', width: 200 },
        { field: 'moduleName', headerName: 'Module Name', width: 150 }
    ], []);

    useEffect(() => {
        getAllEvents();
    }, [getAllEvents]);

    const refreshEvents = () => {
        getAllEvents();
        setFilteredEvents([]);
        setIsFiltered(false);
        setStartDate(null);
        setEndDate(null);
        setFilterField('');
        setFilterValue('');
    };

    const navigate = useNavigate();

    const handleViewDetails = (entityId: number) => {
        navigate(`/audit/events/${entityId}`);
    };

    const handleFilterFieldChange = (event: SelectChangeEvent<string>) => {
        setFilterField(event.target.value);
    };

    const handleFilterValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
    };

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value ? new Date(event.target.value) : null);
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(event.target.value ? new Date(event.target.value) : null);
    };

    const handleFilter = async () => {
        const filters: { [key: string]: string | Date | null } = {
            [filterField]: filterValue
        };
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;

        const filteredEvents = await filterAuditEvents(filters);
        setFilteredEvents(filteredEvents);
        setIsFiltered(true);
    };

    return (
        <Box sx={{ height: 350, marginX: 6 }}>
            <Stack direction='row' margin={2} justifyContent='space-between'>
                <Typography variant='h6' sx={{ fontFamily: 'Nunito, sans serif' }}>Events</Typography>
                <IconButton size='small' onClick={refreshEvents}><Refresh /></IconButton>
            </Stack>
            <Stack direction='row' spacing={2} sx={{ marginBottom: 2 }}>
                <FormControl variant="outlined" size="small" sx={{ width: 100 }}>
                    <InputLabel>Filter By</InputLabel>
                    <Select
                        value={filterField}
                        onChange={handleFilterFieldChange}
                        label="Filter By"
                    >
                        <MenuItem value="utilisateur">User</MenuItem>
                        <MenuItem value="action">Action</MenuItem>
                        <MenuItem value="moduleName">Module Name</MenuItem>
                        <MenuItem value="entity">Entity</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    variant="outlined"
                    size="small"
                    label="Filter Value"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    name={filterField}
                />
                <TextField
                    type='datetime-local'
                    variant="outlined"
                    size="small"
                    label="Start Date"
                    value={startDate ? startDate.toISOString().slice(0, 16) : ''}
                    onChange={handleStartDateChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    type='datetime-local'
                    variant="outlined"
                    size="small"
                    label="End Date"
                    value={endDate ? endDate.toISOString().slice(0, 16) : ''}
                    onChange={handleEndDateChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button variant="contained" onClick={handleFilter}>Filter</Button>
            </Stack>
            <DataGrid
                columns={[
                    ...columns,
                    {
                        field: 'viewDetails',
                        headerName: 'View Details',
                        width: 100,
                        renderCell: (params: GridCellParams) => (
                            <IconButton onClick={() => handleViewDetails(params.row._id)}>
                                <Add />
                            </IconButton>
                        )
                    }
                ]}
                rows={isFiltered ? filteredEvents : events}
                getRowId={row => row._id}
                sx={{ fontFamily: 'Nunito, sans serif' }}
            />
        </Box>
    );
};

export default Events;
