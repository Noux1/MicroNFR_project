import { FormControl, InputAdornment, TextField } from '@mui/material'
import { useSearchStore } from '../../../store/CommonStore/StyleStore'
import { SearchOutlined } from '@mui/icons-material'

const Search = () => {
    const { search, onSearch } = useSearchStore()

    return (
        <FormControl>
            <TextField
                size='small'
                id="search field"
                label="search field"
                value={search}
                onChange={onSearch}
                type='search'
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchOutlined />
                        </InputAdornment>
                    ),
                }}

            />
        </FormControl>
    )
}

export default Search