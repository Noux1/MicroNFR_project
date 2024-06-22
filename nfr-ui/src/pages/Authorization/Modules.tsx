import { Box, Chip, Stack, Typography } from '@mui/material'
import { DataGrid, GridCellParams } from '@mui/x-data-grid'
import { useEffect, useMemo, useState } from 'react'
import { useModuleStore } from '../../store/AdminStore/ModuleStore'
import ButtonForm from '../../components/Common/Reusable-components/ButtonForm'
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore'
import Popup from '../../components/Common/Reusable-components/Popup'
import ButtonMore from '../../components/Common/Reusable-components/ButtonMore'
import SnackBar from '../../components/Common/Reusable-components/SnackBar'
import { useNavigate } from 'react-router-dom'
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore'
import Unauthorized from '../Errors/Unauthorized'

const Modules = () => {
    const columns = useMemo(() => [
        { field: 'moduleName', headerName: 'Module Name', width: 150 },
        { field: 'moduleCode', headerName: 'Module Code', width: 150 },
        { field: 'color', headerName: 'Color', width: 100 },
        { field: 'icon', headerName: 'Icon', width: 100 },
        { field: 'uri', headerName: ' Uri', width: 150 },

    ], [])

    const { modules, addModule, updateModule, deleteModule, getModules } = useModuleStore()
    const { authorities: userAuthorities } = useKeycloakStore()
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        getModules()
    }, [getModules])

    const fields = [
        {
            name: 'Module Name',
            label: 'Module Name',
            type: 'text',
            required: true
        },
        {
            name: 'Module Code',
            label: 'Module Code',
            type: 'text',
            required: true
        },
        {
            name: 'Status',
            label: 'Status',
            type: 'switch',
            options: ['Activated', 'Desactivated']
        },
        {
            name: 'Icon',
            label: 'Icon',
            type: 'text',
            required: true
        },
        {
            name: 'Uri',
            label: 'Uri',
            type: 'text',
            required: true
        },
        {
            name: 'Color',
            label: 'Color',
            type: 'text',
            required: true
        },
    ];
    const { isOpen, openPopup, closePopup } = usePopupStore();
    const [updateFormData, setUpdateFormData] = useState<Record<string, any>>({});
    const [updateModuleId, setUpdateModuleId] = useState<number | null>(null);
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')

    const handleOpenAddPopup = () => {
        setUpdateFormData({}); // Clear any previous initial data
        openPopup();
    };

    const handleSubmitModule = (formData: Record<string, any>) => {
        if (updateModuleId !== null) {
            updateModule(updateModuleId, {
                id: updateModuleId,
                moduleName: formData['Module Name'],
                moduleCode: formData['Module Code'],
                color: formData['Color'],
                icon: formData['Icon'],
                uri: formData['Uri'],
                actif: formData['Status'] === 'Activated'
            })
            setUpdateModuleId(null)
            setUpdateFormData({})
        } else {
            const newModule = {
                id: null,
                moduleName: formData['Module Name'],
                moduleCode: formData['Module Code'],
                color: formData['Color'],
                icon: formData['Icon'],
                uri: formData['Uri'],
                actif: formData['Status'] === 'Activated'
            }
            addModule(newModule)
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`Module added successfully`);
            console.log(newModule)
        }
        closePopup()
    }

    const navigate = useNavigate()
    const handleViewDetails = (id: number) => {
        navigate(`/admin/modules/${id}`);
    };

    const handleDeleteModule = (id: number) => {
        deleteModule(id)
        // eslint-disable-next-line
        openSnackbar();
        setSnackbarSeverity('success')
        setSnackbarMsg(`Module removed successfully`);
    }

    return (
        <>
            {userAuthorities.some(auth => auth.data === 'MODULE_VIEW_ALL' && auth.isGranted) ? (
                <>
                    <Box
                        sx={{
                            height: 350, marginX: 6
                        }}>
                        <Stack direction='row' margin={2} justifyContent='space-between'>
                            <Typography variant='h5' sx={
                                {
                                    fontFamily: 'Nunito, sans serif'
                                }
                            }>Modules</Typography>
                            {userAuthorities.some(auth => auth.data === 'MODULE_CREATE' && auth.isGranted) && (<ButtonForm
                                text='Add Module'
                                fields={fields}
                                onSubmit={handleOpenAddPopup} />)}
                            <Popup
                                open={isOpen}
                                onClose={closePopup}
                                fields={fields}
                                onSubmit={handleSubmitModule}
                                initialData={updateFormData}
                            />
                            {/* <IconButton size='small' onClick={refreshEvents}><Refresh /></IconButton> */}
                        </Stack>

                        <DataGrid
                            columns={[
                                ...columns,
                                {
                                    field: 'actif',
                                    headerName: 'Status',
                                    width: 150,
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
                                        <ButtonMore
                                            id={params.row.id}
                                            handleUpdate={handleViewDetails}
                                            handleDelete={userAuthorities.some(auth => auth.data === 'MODULE_DELETE' && auth.isGranted) && handleDeleteModule} />
                                    )
                                }
                            ]}
                            rows={modules.map((module, index) => ({ ...module, id: module.id }))} // Add unique IDs to each row
                            getRowId={(row) => row.id}
                            sx={{
                                fontFamily: 'Nunito, sans serif'
                            }}
                        />

                    </Box >
                    <SnackBar
                        open={isOpenSnackbar}
                        severity={snackbarSeverity}
                        onClose={closeSnackbar}
                        text={snackbarMsg}
                    />
                </>
            ) : (
                <Unauthorized />
            )
            }
        </>
    )
}

export default Modules