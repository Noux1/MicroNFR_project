import { Box, Chip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React, { useState } from 'react'
import ButtonMore from './ButtonMore'
import { useModeStore } from '../../../store/CommonStore/StyleStore';
import PaginationTable from './PaginationTable';

interface TableProps {
    columnHeaders: string[]
    dataTable: {
        id: number;
        libelle: string;
        actif: boolean;
        authorityType?: number | string
    }[];
    handleUpdate: (id: number) => void;
    handleDelete: (id: number) => void;
}

const TableComponent: React.FC<TableProps> = ({ columnHeaders, dataTable, handleUpdate, handleDelete }: TableProps) => {
    const { mode } = useModeStore();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Number of items to display per page
    const totalPages = Math.ceil(dataTable.length / itemsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    // Calculate the range of items to display for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    const currentData = dataTable.slice(startIndex, endIndex);

    return (
        <Stack spacing={4} direction='column' justifyContent='space-between' alignItems='center'>
            <Paper sx={{ width: '100%', overflow: 'hidden', margin: 'auto' }}>
                <TableContainer sx={{ maxHeight: 300 }}>
                    <Box className={mode === 'light' ? 'bg-[#F5F8FF]' : 'bg-[#283042]'}>
                        <Table stickyHeader aria-label="sticky table" size='small'>
                            <TableHead sx={{ height: 50 }}>
                                <TableRow>
                                    {columnHeaders.map((header: string, index: number) => (
                                        <TableCell key={index}>
                                            <Typography variant='h6'>{header}</Typography>
                                        </TableCell>
                                    ))}
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody >
                                {currentData.map((data, index) => (
                                    <TableRow key={index} hover >
                                        <TableCell>
                                            <Typography variant='h6'>
                                                {data.libelle.charAt(0).toUpperCase() + data.libelle.slice(1)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {data.actif ? <Chip color='success' variant='outlined' label='Activated' /> : <Chip color='error' variant='outlined' label='Desactivated' />}
                                        </TableCell>
                                        {data.authorityType ? <TableCell>{data.authorityType}</TableCell> : <TableCell></TableCell>}
                                        <TableCell>
                                            <ButtonMore id={data.id} handleUpdate={handleUpdate} handleDelete={handleDelete} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </TableContainer>
            </Paper>
            <Box sx={{ position: 'absolute', bottom: 40 }}>
                <PaginationTable count={totalPages} page={currentPage} handleChangePage={handlePageChange} />
            </Box>
        </Stack >
    );
};

export default TableComponent;
