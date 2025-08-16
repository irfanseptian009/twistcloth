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
import { toast } from 'react-toastify';
import { useTheme } from '../contexts/ThemeContext';

export default function ProductsTable({ onEdit }) {
  const { colors, isDarkMode } = useTheme();
  
  ProductsTable.propTypes = {
    onEdit: PropTypes.func.isRequired,
  };

  const dispatch = useDispatch();
  const items = useSelector((state) => state.items.items);
  const status = useSelector((state) => state.items.status);
  const error = useSelector((state) => state.items.error);

  // Create dynamic styled components based on theme
  const StyledTableCellDynamic = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: isDarkMode ? '#1f2937' : '#111827',
      color: isDarkMode ? '#f9fafb' : '#ffffff',
      fontWeight: 'bold',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      backgroundColor: isDarkMode ? '#374151' : '#ffffff',
      color: isDarkMode ? '#f9fafb' : '#111827',
      borderBottom: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
    },
  }));

  const StyledTableRowDynamic = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
      backgroundColor: isDarkMode ? '#4b5563' : '#f9fafb',
    },
    '&:nth-of-type(even)': {
      backgroundColor: isDarkMode ? '#374151' : '#ffffff',
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    '&:hover': {
      backgroundColor: isDarkMode ? '#6b7280' : '#f3f4f6',
    },
  }));

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteItem(id));
    }
    toast.success("Item berhasil dihapus!");
  };

  if (status === 'loading') {
    return (
      <Box sx={{ width: '100%', p: 2 }}>
        <LinearProgress />
      </Box>
    );
  }
  
  if (status === 'failed') {
    return (
      <div className={`p-4 rounded-lg bg-red-500/20 border border-red-500/30`}>
        <p className="text-red-400 text-center font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`${colors.surface} rounded-xl shadow-2xl overflow-hidden`}>
      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor: isDarkMode ? '#374151' : '#ffffff',
          boxShadow: 'none'
        }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="products table">
          <TableHead>
            <TableRow>
              <StyledTableCellDynamic></StyledTableCellDynamic>
              <StyledTableCellDynamic>Name</StyledTableCellDynamic>
              <StyledTableCellDynamic align="left">Price</StyledTableCellDynamic>
              <StyledTableCellDynamic align="left">Stock</StyledTableCellDynamic>
              <StyledTableCellDynamic align="left">Category</StyledTableCellDynamic>
              <StyledTableCellDynamic align="left">Description</StyledTableCellDynamic>
              <StyledTableCellDynamic align="left">Actions</StyledTableCellDynamic>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <StyledTableRowDynamic key={item.id}>
                <StyledTableCellDynamic>
                  <div className="avatar">
                    <div className={`mask mask-squircle ml-5 border-2 ${colors.border} shadow-xl h-16 w-16 overflow-hidden rounded-lg`}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </StyledTableCellDynamic>

                <StyledTableCellDynamic component="th" scope="row">
                  <span className="font-semibold">{item.name}</span>
                </StyledTableCellDynamic>

                <StyledTableCellDynamic align="left">
                  <span className={`font-bold ${colors.primary}`}>
                    Rp {parseInt(item.price).toLocaleString()}
                  </span>
                </StyledTableCellDynamic>
                
                <StyledTableCellDynamic align="left">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.stock > 10 
                      ? 'bg-green-500/20 text-green-400' 
                      : item.stock > 0 
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.stock} units
                  </span>
                </StyledTableCellDynamic>
                
                <StyledTableCellDynamic align="left">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.surfaceSecondary} ${colors.text}`}>
                    {item.categoryId}
                  </span>
                </StyledTableCellDynamic>
                
                <StyledTableCellDynamic align="left">
                  <span className="max-w-xs truncate block">
                    {item.description}
                  </span>
                </StyledTableCellDynamic>
                
                <StyledTableCellDynamic>
                  <div className="flex flex-row space-x-3">
                    <button
                      onClick={() => onEdit(item)}
                      className={`p-2 rounded-full ${colors.surfaceSecondary} hover:${colors.primary} transition-all duration-200 hover:scale-110`}
                      title="Edit item"
                    >
                      <IoIosCreate size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all duration-200 hover:scale-110"
                      title="Delete item"
                    >
                      <IoIosTrash size={20} />
                    </button>
                  </div>
                </StyledTableCellDynamic>
              </StyledTableRowDynamic>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
