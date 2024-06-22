import { Pagination } from '@mui/material'
import React from 'react'

interface PaginationTableProps {
    count: number,
    page: number,
    handleChangePage: (event: React.ChangeEvent<unknown>, page: number) => void
}

const PaginationTable: React.FC<PaginationTableProps> = ({ count, page, handleChangePage }) => {
    return (
        <Pagination
            count={count}
            page={page}
            onChange={handleChangePage}
        />
    )
}

export default PaginationTable