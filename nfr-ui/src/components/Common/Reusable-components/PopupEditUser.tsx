import { Add, Close } from '@mui/icons-material';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Module } from '../../../store/AdminStore/ModuleStore';
import { Role } from '../../../store/AdminStore/RoleStore';
import { Authority } from '../../../store/AdminStore/AuthorityStore';
import { Group } from '../../../store/AdminStore/GroupStore';

interface PopupEditUserProps {
    open: boolean,
    onClose: () => void
    onSubmit: (formData: any) => void;
    initialData?: Record<string, any>
    add: (formData: any, type: 'module' | 'role' | 'authority' | 'group' | 'requiredActions') => void
    modules: Module[]
    roles: Role[]
    authorities: Authority[]
    groups: Group[]
}

const PopupEditUser: React.FC<PopupEditUserProps> = ({ open, onClose, onSubmit, initialData, add, modules, roles, authorities, groups }) => {
    const [formData, setFormData] = useState<Record<string, any>>(initialData);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string, value: unknown }> | React.ChangeEvent<{ name?: string, value: unknown }> | SelectChangeEvent<any>) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name as string]: value });
    };

    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        const status = checked ? 'Activated' : 'Deactivated'; // Map switch value to 'Activated' or 'Deactivated'
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: status
        }));
    };
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} >
            <DialogTitle >
                <Box className='flex justify-between '>
                    Edit
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent className='flex-col justify-between items-start'>
                <Box component="form" onSubmit={handleSubmit}>
                    {['User Name', 'First Name', 'Last Name', 'Email', 'Phone Number'].map((field) => (
                        // <Box key={field} display="flex" alignItems="center">
                        <TextField
                            size='small'
                            key={field}
                            label={field}
                            name={field}
                            value={formData[field] || ''}
                            onChange={handleChange}
                            margin="normal"
                            fullWidth
                            sx={{ marginBottom: 1 }}
                        />
                        // </Box>
                    ))}

                    <Box display="flex" alignItems="center">
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="required-actions-label">Required Actions</InputLabel>
                            <Select
                                labelId="required-actions-label"
                                multiple
                                name="requiredActions"
                                value={formData.requiredActions || []}
                                onChange={handleChange}
                                renderValue={(selected) => (
                                    <Box display="flex" flexWrap="wrap">
                                        {(selected as string[]).map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {['VERIFY_EMAIL',
                                    'CONFIGURE_TOTP',
                                    'UPDATE_PASSWORD',
                                    'TERMS_AND_CONDITIONS'].map((action) => (
                                        <MenuItem key={action} value={action}>
                                            {action}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <Button
                            onClick={() => add(formData, 'requiredActions')}
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                        >
                            Add
                        </Button>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="module-label">Module</InputLabel>
                            <Select
                                labelId="module-label"
                                name="module"
                                value={formData.module || ''}
                                onChange={handleChange}
                            >
                                {modules.map((module) => (
                                    <MenuItem key={module.id} value={module.moduleName}>
                                        {module.moduleName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            onClick={() => add(formData, 'module')}
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                        >
                            Add
                        </Button>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="role-label">Role</InputLabel>
                            <Select
                                labelId="role-label"
                                name="role"
                                value={formData.role || ''}
                                onChange={handleChange}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.libelle}>
                                        {role.libelle}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            onClick={() => add(formData, 'role')}
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                        >
                            Add
                        </Button>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="authority-label">Authority</InputLabel>
                            <Select
                                labelId="authority-label"
                                name="authority"
                                value={formData.authority || ''}
                                onChange={handleChange}
                            >
                                {authorities.map((authority) => (
                                    <MenuItem key={authority.id} value={authority.libelle}>
                                        {authority.libelle}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            onClick={() => add(formData, 'authority')}
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                        >
                            Add
                        </Button>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="group-label">Group</InputLabel>
                            <Select
                                labelId="group-label"
                                name="group"
                                value={formData.group || ''}
                                onChange={handleChange}
                            >
                                {groups.map((group) => (
                                    <MenuItem key={group.id} value={group.libelle}>
                                        {group.libelle}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            onClick={() => add(formData, 'group')}
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                        >
                            Add
                        </Button>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <FormControl sx={{ marginBottom: 3 }}>
                            <FormControlLabel
                                label='Status'
                                control={
                                    <Switch checked={formData["Status"] === 'Activated' || false}
                                        onChange={handleSwitchChange}
                                        name='Status' size='small' />}

                            />
                        </FormControl>
                    </Box>

                    <Button type='submit' variant='contained' color='primary' sx={{ marginY: 2 }} size='small'>Edit</Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog >
    )
}

export default PopupEditUser