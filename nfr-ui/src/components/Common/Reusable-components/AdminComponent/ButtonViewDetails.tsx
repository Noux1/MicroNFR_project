import { Add } from '@mui/icons-material'
import { IconButton } from '@mui/material'

const ButtonViewDetails = ({ id, handleViewDetails }) => {
    return (
        <IconButton onClick={() => handleViewDetails(id)}>
            <Add />
        </IconButton >
    )
}
export default ButtonViewDetails