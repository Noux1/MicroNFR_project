import { Box, Chip, Stack, Typography } from '@mui/material'
import React from 'react'
import Popup from './Popup'
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid'
import ButtonMore from './ButtonMore'
import SnackBar from '../SnackBar'
import ButtonForm from './ButtonForm'
import { FormField } from './FormAdd'
import ButtonViewDetails from './ButtonViewDetails'
import ButtonDelete from './ButtonDelete'

interface DataTableProps {
    title: string,
    createAuthority: string,
    userAuthorities: { data: string, isGranted: boolean }[],
    titleAddButton: string,
    fields: FormField[]
    handleOpenAddPopup: (formData: any) => void;
    isOpenPopup: boolean
    closePopup: () => void
    handleSubmitOption: (formData: any) => void;
    initialData?: Record<string, any>,
    updateAuthority: string,
    deleteAuthority?: string,
    handleViewDetails: (id: number) => void;
    handleDelete?: (id: number) => void;
    rows: any[],
    columns: GridColDef<any>[]
    isOpenSnackbar: boolean;
    closeSnackbar: () => void;
    snackbarText: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}

const DataTable: React.FC<DataTableProps> = ({ title, titleAddButton, createAuthority, userAuthorities, fields, handleOpenAddPopup, isOpenPopup, closePopup, handleSubmitOption, initialData, columns, updateAuthority, deleteAuthority, handleViewDetails, handleDelete, isOpenSnackbar, closeSnackbar, snackbarText, severity, rows }) => {
    const hasUpdateAuthority = userAuthorities.some(auth => auth.data === updateAuthority && auth.isGranted);
    const hasDeleteAuthority = userAuthorities.some(auth => auth.data === deleteAuthority && auth.isGranted);

    return (
        <>
            <Box
                sx={{
                    height: 350, marginX: 6
                }}>
                <Stack direction='row' margin={2} justifyContent='space-between'>
                    <Typography variant='h5'>
                        {title}
                    </Typography>
                    {userAuthorities.some(auth => auth.data === createAuthority && auth.isGranted) && (
                        <ButtonForm
                            text={titleAddButton}
                        // fields={fields}
                        // onSubmit={handleOpenAddPopup}
                        />
                    )}
                    <Popup
                        open={isOpenPopup}
                        onClose={closePopup}
                        fields={fields}
                        onSubmit={handleSubmitOption}
                        initialData={initialData}
                    />
                </Stack>
                <DataGrid
                    columns={[
                        ...columns,
                        {
                            field: 'actif',
                            headerName: 'Status',
                            width: 200,
                            renderCell: (params: GridCellParams) => (
                                <Box>
                                    {params.value ? (
                                        <Chip color='success' variant='outlined' label='Activated' />
                                    ) : (
                                        <Chip color='error' variant='outlined' label='Deactivated' />
                                    )}
                                </Box>
                            )
                        },
                        {
                            field: 'actions',
                            headerName: 'Actions',
                            width: 100,
                            renderCell: (params: GridCellParams) => (
                                <>
                                    {hasUpdateAuthority && hasDeleteAuthority ? (
                                        <ButtonMore
                                            id={params.row.id}
                                            handleUpdate={handleViewDetails}
                                            handleDelete={handleDelete}
                                        />
                                    ) : hasUpdateAuthority ? (
                                        <ButtonViewDetails
                                            id={params.row.id}
                                            handleViewDetails={handleViewDetails}
                                        />
                                    ) : hasDeleteAuthority ? (
                                        <ButtonDelete
                                            id={params.row.id}
                                            handleDelete={handleDelete}
                                        />
                                    ) : null}
                                </>
                            )
                        }
                    ]}
                    rows={rows.map((row) => ({ ...row, id: row.id }))}
                    getRowId={(row) => row.id}
                />
            </Box >
            <SnackBar
                open={isOpenSnackbar}
                severity={severity}
                onClose={closeSnackbar}
                text={snackbarText}
            />
        </>
    )
}

export default DataTable