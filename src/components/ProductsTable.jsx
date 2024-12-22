import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector, useDispatch } from 'react-redux';
import { deleteItem } from '../store/features/items/ProductSlice';
import { IoIosCreate, IoIosTrash } from "react-icons/io";
import PropTypes from 'prop-types';
import { Box, LinearProgress } from '@mui/material';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // Hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ProductsTable({ onEdit }) {
  ProductsTable.propTypes = {
    onEdit: PropTypes.func.isRequired,
  };

  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const status = useSelector((state) => state.items.status);
  const error = useSelector((state) => state.items.error);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem(id));
    }
  };

  if (status === 'loading') {
    return       <Box sx={{ width: '100%' }}>
    <LinearProgress />
  </Box>
  }
  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="left">Price</StyledTableCell>
            <StyledTableCell align="left">Stock</StyledTableCell>
            <StyledTableCell align="left">Category</StyledTableCell>
            <StyledTableCell align="left">Description</StyledTableCell>
            <StyledTableCell align="left">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <StyledTableRow key={item.id}>
              <StyledTableCell>
                <div className="avatar">
                  <div className="mask mask-squircle ml-5 border-2 shadow-xl h-16 w-16">
                    <img src={item.image} alt={item.name} />
                  </div>
                </div>
              </StyledTableCell>

              <StyledTableCell component="th" scope="row">
                {item.name}
              </StyledTableCell>

              <StyledTableCell align="left">{item.price}</StyledTableCell>
              <StyledTableCell align="left">{item.stock}</StyledTableCell>
              <StyledTableCell align="left">{item.categoryId}</StyledTableCell>
              <StyledTableCell align="left">{item.description}</StyledTableCell>
              <StyledTableCell className="py-2 px-4 border-b flex space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="text-black hover:text-slate-500"
                >
                  <IoIosCreate size={20} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <IoIosTrash size={20} />
                </button>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
