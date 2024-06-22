import { useEffect, useMemo, useState } from 'react';
import { Box, Chip, Stack, Typography } from '@mui/material';
import ButtonForm from '../../components/Common/Reusable-components/ButtonForm';
import { usePopupStore, useSnackbarStore } from '../../store/CommonStore/StyleStore';
import { useAuthorityTypeStore } from '../../store/AdminStore/AuthorityTypeStore';
import Popup from '../../components/Common/Reusable-components/Popup';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import ButtonMore from '../../components/Common/Reusable-components/ButtonMore';
import axiosInstance from '../../utils/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import SnackBar from '../../components/Common/Reusable-components/SnackBar';
import { useKeycloakStore } from '../../store/AuthStore/KeycloakStore';
import Unauthorized from '../Errors/Unauthorized';


const AuthorityTypes = () => {
    const columns = useMemo(() => [
        { field: 'libelle', headerName: 'Authority Type', width: 200 },

    ], [])

    const { authorityTypes, addAuthorityType, deleteAuthorityType, getAuthorityTypes } = useAuthorityTypeStore()
    const { authorities: userAuthorities } = useKeycloakStore()
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

    useEffect(() => {
        getAuthorityTypes()
    }, [getAuthorityTypes])

    const fields = [
        {
            name: 'Authority Type',
            label: 'Authority Type',
            type: 'text',
            required: true
        },
        {
            name: 'Status',
            label: 'Status',
            type: 'switch',
            options: ['Activated', 'Desactivated']
        },

    ];
    const { isOpen, openPopup, closePopup } = usePopupStore();
    const [updateFormData, setUpdateFormData] = useState<Record<string, any>>({});
    const [updateAuthorityTypeId, setUpdateAuthorityTypeId] = useState<number | null>(null);
    const { isOpenSnackbar, openSnackbar, closeSnackbar } = useSnackbarStore()
    const [snackbarMsg, setSnackbarMsg] = useState<string>('')

    const handleOpenAddPopup = () => {
        setUpdateFormData({}); // Clear any previous initial data
        openPopup();
    };

    const handleSubmitAuthorityType = async (formData: Record<string, any>) => {

        // Construire l'objet de rôle à envoyer au backend
        const authorityTypeData = {
            id: null,
            libelle: formData['Authority Type'],
            actif: formData['Status'] === 'Activated'
        };

        // Envoyer la requête au backend pour ajouter ou mettre à jour le rôle
        try {

            await addAuthorityType(authorityTypeData);
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`Authority Type added successfully`);
            console.log('Authority Type added/updated successfully');
        } catch (error) {
            console.error('Error adding/updating authority type:', error);
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to add Authority Type`);
        }

        // Réinitialiser les états et fermer la popup
        setUpdateAuthorityTypeId(null);
        setUpdateFormData({});
        closePopup();
    }
    const navigate = useNavigate()
    const handleViewDetails = (id: number) => {
        navigate(`/admin/authorityTypes/${id}`);
    };

    const handleDeleteAuthorityType = (id: number) => {
        try {
            deleteAuthorityType(id)
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('success')
            setSnackbarMsg(`Authority Type added successfully`);
            console.log('Authority Type deleted successfully');
        } catch (error) {
            // eslint-disable-next-line
            openSnackbar();
            setSnackbarSeverity('error')
            setSnackbarMsg(`Failed to delete Authority Type`);
        }
    }

    return (
        <>
            {userAuthorities.some(auth => auth.data === 'AUTHORITY_TYPE_VIEW_ALL' && auth.isGranted) ? (
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
                            }>Authority Type</Typography>
                            {userAuthorities.some(auth => auth.data === 'AUTHORITY_TYPE_CREATE' && auth.isGranted) && (<ButtonForm
                                text='Add Authority Type'
                                fields={fields}
                                onSubmit={handleOpenAddPopup} />)}
                            <Popup
                                open={isOpen}
                                onClose={closePopup}
                                fields={fields}
                                onSubmit={handleSubmitAuthorityType}
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
                                        <ButtonMore
                                            id={params.row.id}
                                            handleUpdate={handleViewDetails}
                                            handleDelete={userAuthorities.some(auth => auth.data === 'AUTHORITY_TYPE_DELETE' && auth.isGranted) && handleDeleteAuthorityType} />
                                    )
                                }
                            ]}
                            rows={authorityTypes.map((authorityType, index) => ({ ...authorityType, id: authorityType.id }))} // Add unique IDs to each row
                            getRowId={(row) => row.id}
                            sx={{
                                fontFamily: 'Nunito, sans serif'
                            }}
                        />
                    </Box>
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
};

export default AuthorityTypes;