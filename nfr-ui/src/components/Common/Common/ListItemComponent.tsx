import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom';
import { useModeStore } from '../../../store/CommonStore/StyleStore';


interface Props {
    selected: boolean,
    onClick: () => void,
    to: string,
    variant: 'body1' | 'body2',
    icon: ReactNode,
    name: string,
    fontWeight?: string
    openSidebar: boolean
    title: string
}


const ListItemComponent: React.FC<Props> = ({ selected, onClick, to, variant, icon, name, fontWeight, openSidebar, title }: Props) => {
    const { mode } = useModeStore();

    return (
        <ListItem disablePadding sx={{ marginBottom: '5px' }} >
            {
                openSidebar ?
                    (<ListItemButton selected={selected} onClick={onClick} sx={{ borderRadius: '5px', marginX: openSidebar ? '6px' : '0px', height: '35px' }} >
                        <ListItemIcon >
                            {icon}
                        </ListItemIcon>
                        <ListItemText className={mode === 'light' ? 'text-black' : ' dark:text-white'}>
                            <Link to={to}>
                                <Typography
                                    variant={variant}
                                    sx={{
                                        fontWeight: fontWeight, marginLeft: '-16px'
                                    }}
                                > {name}
                                </Typography>
                            </Link>
                        </ListItemText>
                    </ListItemButton>
                    ) : (
                        <ListItemButton selected={selected} onClick={onClick} sx={{ borderRadius: '5px', marginX: openSidebar ? '6px' : '0px', height: '35px' }} >
                            <Link to={to}>
                                <Tooltip title={title} placement='bottom-end'>
                                    <ListItemIcon >
                                        {icon}
                                    </ListItemIcon>
                                </Tooltip>
                            </Link>
                        </ListItemButton>

                    )
            }
        </ListItem >
    )
}

export default ListItemComponent