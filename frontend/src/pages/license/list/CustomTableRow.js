import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
// import Label from '../../../../components/Label';
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import  ButtonPopover  from '../../../components/popover/ButtonPopover';
import  PtForm  from '../form/LicenseForm';
import { useDispatch, useSelector } from '../../../redux/store';

// ----------------------------------------------------------------------



export default function CustomTableRow({ row, checkbox ,selected, selectedOne, onSelectRow }) {

  const dispatch = useDispatch()
  
  const { id, license_name, qty, license_code, status, type, info } = row;
  const [ openMenu , setOpenMenuActions ] = useState(null);
  const { license } = useSelector((state) => state.license);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
    selectedOne()
  };

  const passSelectedOne = (event) => {
    selectedOne()
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  }; 

  const switchLicenseStatus = (status) => {
    let value = null;
    switch(status) {
      case 1:
        value = "ACTIVE"
        break;
      default:
        value = "INACTIVE"
    }
    return value
  }; 

  const switchLicenseType = (type) => {
    let value = null;
    switch(type) {
      case 1:
        value = "PERPETUAL"
        break;
      case 2:
        value = "SUBSCRIBTION"
        break;
      default:
        value = "UNDEFINED"
    }
    return value
  }; 

  return (
    <TableRow hover selected={selected}>
      {checkbox && (
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      )}
      
      {/* <TableCell align="left" >{id}</TableCell> */}

      <TableCell align="left" sx={{ textTransform: 'uppercase' }}>{license_name}</TableCell>
      <TableCell align="left" sx={{ textTransform: 'uppercase' }}>{qty}</TableCell>
      <TableCell align="left" sx={{ textTransform: 'uppercase' }}>{license_code}</TableCell>
      <TableCell align="left" sx={{ textTransform: 'uppercase' }}>{switchLicenseStatus(status)}</TableCell>
      <TableCell align="left" sx={{ textTransform: 'uppercase' }}>{switchLicenseType(type)}</TableCell>
      <TableCell align="left" sx={{ textTransform: 'uppercase' }}>{info}</TableCell>

      
      <TableCell align="center" sx={{width: '10%'}}>
      {checkbox && ( 
        <ButtonPopover color="warning" onPress={passSelectedOne} startIcon={<Iconify icon={'eva:edit-fill'} />} >
          <PtForm text="Edit License" formData={license} />
        </ButtonPopover>
        )}
      </TableCell>
      
    </TableRow>
  );
}

CustomTableRow.propTypes = {
  row: PropTypes.object,
  checkbox: PropTypes.bool,
  selected: PropTypes.bool,
  selectedOne: PropTypes.func,
  onSelectRow: PropTypes.func,
};