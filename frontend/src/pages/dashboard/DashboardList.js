// import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  // Box,
  // Tab,
  // Tabs,
  Card,
  // Table,
  // Switch,
  Stack,
  // Tooltip,
  // Divider,
  // TableBody,
  Container,
  Typography,
  // IconButton,
  // TableContainer,
  // TablePagination,
  // FormControlLabel,
  // Skeleton ,
} from '@mui/material';
import { useTheme  } from '@mui/material/styles';
import { m } from 'framer-motion';
// routes
// import { PATH_PAGE } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// import useTable
// { getComparator, emptyRows } 
// from '../../hooks/useTable';
// _mock_
// components
import Page from '../../components/Page';
import Background from '../../components/Background';
// import SkeletonLoading from '../../components/SkeletonLoading';
import Iconify from '../../components/Iconify';
// import Scrollbar from '../../components/Scrollbar';
// import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// import ButtonPopover from '../../components/popover/ButtonPopover';
import LoadingScreen from '../../components/LoadingScreen';
// import LicenseForm from './form/LicenseForm';
// import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
// import  CustomTableRow  from './list/CustomTableRow';
// import TableToolbar from '../../sections/menu/TableToolbar';
// redux
// import { useDispatch, useSelector } from '../../redux/store';
// import { getAll, deleteData, addOneData} from '../../redux/slices/license';
import useAuth from '../../hooks/useAuth';
import { MotionContainer, varBounce } from '../../components/animate';

// ----------------------------------------------------------------------

// const STATUS_OPTIONS = ['all', 'active', 'banned'];

// const ROLE_OPTIONS = [
//   'all',
//   'ux designer',
//   'full stack designer',
//   'backend developer',
//   'project manager',
//   'leader',
//   'ui designer',
//   'ui/ux designer',
//   'front end developer',
//   'full stack developer',
// ];

// const TABLE_HEAD = [
//   // { id: 'id', label: 'ID', align: 'left' },
//   { id: 'license_name', label: 'License Name', align: 'left' },
//   { id: 'qty', label: 'Quantity', align: 'left' },
//   { id: 'license_code', label: 'License Code', align: 'left' },
//   { id: 'status', label: 'Status', align: 'left' },
//   { id: 'type', label: 'Type', align: 'left' },
//   { id: 'info', label: 'Info', align: 'left' },
//   { id: '', label: '#', align: 'center' },
// ];

// ----------------------------------------------------------------------

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function LicenseList() {
  const [isLoading , setIsLoading] = useState(true)
  const theme = useTheme();
  // const dispatch = useDispatch();
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  useEffect(() => {
    setTimeout(()=>{
      const d = new Date();
      setSeconds(d.getSeconds());
      setminutes(d.getMinutes());
      setHours(d.getHours());
      setDays(weekday[d.getUTCDay()]);
      setDates(`${d.toLocaleString('default', { day: '2-digit' })} ${d.toLocaleString('default', { month: 'short' })} ${d.toLocaleString('default', { year: 'numeric' })}`)
    }, 1000);
    async function init() {
      await sleep(500);
      setIsLoading(false);
    }
    init()
  });
  
  // const {
  //   dense,
  //   page,
  //   order,
  //   orderBy,
  //   rowsPerPage,
  //   setPage,
  //   selected,
  //   setSelected,
  //   onSelectRow,
  //   onSelectAllRows,
  //   onSort,
  //   onChangeDense,
  //   onChangePage,
  //   onChangeRowsPerPage,
  // } = useTable();

  const { themeStretch } = useSettings();
  // const checkbox = false;
  // const { licenses, isLoading} = useSelector((state) => state.license);
  // const tableData = licenses;
  // const [filterName, setFilterName] = useState('');
  const { user , logout} = useAuth();

  const d = new Date();
  const [seconds , setSeconds] = useState(d.getSeconds())
  const [minutes , setminutes] = useState(d.getMinutes())
  const [hours , setHours] = useState(d.getHours())
  const [days , setDays] = useState(weekday[d.getUTCDay()])
  const [dates , setDates] = useState(`${d.toLocaleString('default', { day: '2-digit' })} ${d.toLocaleString('default', { month: 'short' })} ${d.toLocaleString('default', { year: 'numeric' })}`)

  const width = 150
  const height = 150
  const padding = "25px"
  const fontSize = 18
  const Vspacing = 6
  const Hspacing = 3
  const timeFontSize = 80
  const iconSize = "60px"

  return (
    <Page title="Dashboard">
      {isLoading ? <LoadingScreen /> : 
      <Background>
        <>
          
            <Stack
              spacing={0}
              sx={{
                pt: 6,
                pb: 3,
                px: 1,
                flexShrink: 0,
                alignItems: 'center',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography sx={{ color: 'black' }}>{`Hi, ${user.name}`}</Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" >
                <Typography variant="heading" sx={{fontSize:timeFontSize , color: 'black' }}>{`${hours}:${minutes}`}</Typography>
              </Stack>

              <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography sx={{ color: 'black' }}>{days}, {dates}</Typography>
              </Stack>

            </Stack>
          
          <Container maxWidth={themeStretch ? false : 'lg'}>
            
             {/* (<SkeletonLoading isLoading={isLoading} > */}
            <>
            {/* <HeaderBreadcrumbs
              heading={`Dashboard : ${user.name}`}
              links={[
                { name: 'Dashboard', href: PATH_PAGE.pt },
                { name: 'Management' },
              ]}
              action={
                user.role === 0 && (<ButtonPopover text='Add License' startIcon={<Iconify icon={'eva:plus-fill'} />} >
                  <LicenseForm text="Add License" />
                </ButtonPopover>)
              }
            /> */}
          
            <Stack
              spacing={Vspacing}
              sx={{
                pt: 8,
                pb: 2,
                px: 2.5,
                flexShrink: 0,
                alignItems: 'center'
              }}
            >
              
              <Stack direction="row" spacing={Hspacing} alignItems="center" justifyContent="space-between">
                <Container component={MotionContainer}>
                  <m.div variants={varBounce({durationIn:0.75}).in} >
                    <Card sx={{ width, height, padding, fontSize, textTransform: 'uppercase' }}>
                      <Stack  alignItems="center" justifyContent="space-between">
                        <div>Presence</div>
                        <Iconify style={{ fontSize: iconSize, color:theme.palette.primary.main }} icon={'eva:pin-outline'} />
                      </Stack>
                    </Card>
                  </m.div>
                </Container>
                <Container component={MotionContainer}>
                  <m.div variants={varBounce({durationIn:0.85}).in} >
                    <Card sx={{ width, height, padding, fontSize, textTransform: 'uppercase' }}>
                      <Stack  alignItems="center" justifyContent="space-between">
                        <div>Absence</div>
                        <Iconify style={{ fontSize: iconSize, color:theme.palette.primary.main }} icon={'eva:calendar-outline'} />
                      </Stack>
                    </Card>
                  </m.div>
                </Container>
                
              </Stack>

              <Stack direction="row" spacing={Hspacing} alignItems="center" justifyContent="space-between">
                <Container component={MotionContainer}>
                  <m.div variants={varBounce({durationIn:0.95}).in} >
                    <Card sx={{ width, height, padding, fontSize, textTransform: 'uppercase' }}>
                      <Stack  alignItems="center" justifyContent="space-between">
                        <div>Disposition</div>
                        <Iconify style={{ fontSize: iconSize, color:theme.palette.primary.main }} icon={'eva:email-outline'} />
                      </Stack>
                    </Card>
                  </m.div>
                </Container>
                <Container component={MotionContainer}>
                  <m.div variants={varBounce({durationIn:1.05}).in} >
                    <Card sx={{ width, height, padding, fontSize, textTransform: 'uppercase' }}>
                      <Stack  alignItems="center" justifyContent="space-between">
                        <div>Settings</div>
                        <Iconify style={{ fontSize: iconSize, color:theme.palette.primary.main }} icon={'eva:settings-2-outline'} />
                      </Stack>
                    </Card>
                  </m.div>
                </Container>
              </Stack>

              <Stack direction="row" spacing={Hspacing} alignItems="center" justifyContent="space-between">
                <Container component={MotionContainer}>
                  <m.div variants={varBounce({durationIn:1.15}).in} >
                    <Card sx={{ width, height, padding, fontSize, textTransform: 'uppercase' }} onClick={async ()=>{setIsLoading(true);await sleep(500);logout()}}>
                      <Stack  alignItems="center" justifyContent="space-between">
                        <div>Logout</div>
                        <Iconify style={{ fontSize: iconSize, color:theme.palette.primary.main }} icon={'eva:log-out-outline'} />
                      </Stack>
                    </Card>
                  </m.div>
                </Container>
                <Container component={MotionContainer}>
                  <m.div variants={varBounce({durationIn:1.25}).in} >
                    <Card sx={{ width, height, padding, fontSize, textTransform: 'uppercase' }}>
                      <Stack  alignItems="center" justifyContent="space-between">
                        <div>Profile</div>
                        <Iconify style={{ fontSize: iconSize, color:theme.palette.primary.main }} icon={'eva:person-outline'} />
                      </Stack>
                    </Card>
                  </m.div>
                </Container>
              </Stack>

            </Stack>
            </>            
          </Container>
        </>
      </Background>
      }
    </Page>
  );
}

// ----------------------------------------------------------------------

// function applySortFilter({ tableData, comparator, filterName, filterStatus, filterRole }) {
//   try{
//     const stabilizedThis = tableData.map((el, index) => [el, index]);

//     stabilizedThis.sort((a, b) => {
//       const order = comparator(a[0], b[0]);
//       if (order !== 0) return order;
//       return a[1] - b[1];
//     }); 
    
//     tableData = stabilizedThis.map((el) => el[0]);
  
//     if (filterName) {
//       tableData = tableData.filter((item) => {
        
//         const key = Object.keys(item)
//         let result=false
//         key.forEach(element => {
//           let itemElement = item[element]
//           try {
//             if(Number.isInteger( itemElement )){
//               itemElement = itemElement.toString()
//             }
//             result = ( itemElement.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ) || result
//           } catch (error) {
//             result = result || false
//           }
//         });
//         return result
//       });
//     }
    
//     if (filterStatus){
//       if (filterStatus !== 'all') {
//         tableData = tableData.filter((item) => item.status === filterStatus);
//       }
//     }
//     if (filterRole){
//       if (filterRole !== 'all') {
//         tableData = tableData.filter((item) => item.role === filterRole);
//       }
//     }
  
    
//   }catch(e){
//     console.log(e)
//   }
//   return tableData;
// }
