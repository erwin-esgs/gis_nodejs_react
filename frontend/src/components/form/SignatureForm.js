import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, Typography, Grid, Switch, FormControlLabel,Box } from '@mui/material';
import { LoadingButton, DatePicker } from '@mui/lab';
// components
import Iconify from '../Iconify';
import { FormProvider, RHFTextField, RHFCheckbox, RHFSwitch } from '../hook-form';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAll, addData, editData } from '../../redux/slices/user';

// ----------------------------------------------------------------------

SignatureForm.propTypes = {
  text: PropTypes.string,
  formData: PropTypes.object,
};
export default function SignatureForm({text="" , formData=null}) {

  const canvasRef = useRef(null);

  const [canvasWidth, setCanvasWidth] = useState(null);
  const [canvasHeight, setCanvasHeight] = useState(null);

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    setCanvasWidth(canvasRef.current.offsetWidth);
    setCanvasHeight(canvasRef.current.offsetHeight);

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let parent , id_transaksi, column ;
    let signatureBase64 ;

    let drawing = false;
    let prevX, prevY;
    let currX, currY;

    canvas.addEventListener("mousemove", draw);
		canvas.addEventListener("mouseup", stop);
		canvas.addEventListener("mousedown", start);

    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
        // if (!drawing) { return; }
        let touch = e.touches[0];
        let mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
        });
        currX = touch.clientX - canvas.offsetLeft;
        currY = touch.clientY - canvas.offsetTop;
        
        if (!prevX && !prevY) {
        prevX = currX;
        prevY = currY;
        }
        context.beginPath();
        context.moveTo(prevX, prevY);
        context.lineTo(currX, currY);
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.stroke();
        context.closePath();
  
        prevX = currX;
        prevY = currY;
        
        canvas.dispatchEvent(mouseEvent);
      }, false);

    function draw(e) {
		  if (!drawing) {
			return;
		  }
      const rect = canvas.getBoundingClientRect();
      
		  // currX = e.clientX - canvas.offsetLeft;
		  // currY = e.clientY - canvas.offsetTop;
		  // currX = (e.clientX  - rect.left ) / 3
		  // currY = (e.clientY - rect.top ) / 3
		  // currX = (e.clientX - rect.left ) * canvas.clientWidth / window.screen.width 
		  // currY = (e.clientY - rect.top ) * canvas.clientHeight / window.screen.height 
		  // currX = e.clientX - rect.left 
		  // currY = e.clientY - rect.top  
		  currX = e.clientX - rect.left - canvas.offsetLeft 
		  currY = e.clientY - rect.top 
      // currX = e.clientX 
      // currY = e.clientY 
      // console.log( e.clientX , e.clientY , "|", canvas.offsetLeft , canvas.offsetTop , "|" , currX , currY , "|", window.screen.height , canvas.height )
      console.log( e.clientX , currX ,  canvas.clientWidth)
      console.log( e.clientY , currY ,  canvas.clientHeight)
		  if (!prevX && !prevY) {
			prevX = currX;
			prevY = currY;
		  }
		  context.beginPath();
		  context.moveTo(prevX, prevY);
		  context.lineTo(currX, currY);
		  context.strokeStyle = 'red';
		  context.lineWidth = 2;
		  context.stroke();
		  context.closePath();

		  prevX = currX;
		  prevY = currY;
		}

    function stop() {
		  drawing = false;
		  prevX = null;
      prevY = null;
		}

    function start(e) {
		  drawing = true;
		  // signatureBase64.value = e.clientX;
		}

  }, [canvasRef]);

  const dispatch = useDispatch()

  const LoginSchema = Yup.object().shape({
    // nip: Yup.number().min(0, 'Not valid'),
    nip: Yup.string().required(),
    name: Yup.string().required('Name is required'),// .email('Email must be a valid email address'),
    username: Yup.string().required('Username is required'),
    password: Yup.string(),
    role: Yup.mixed().test('is-valid', 'Data is invalid', (value) => {
      if (value === undefined) {
        return true; // Allow undefined value
      } 
        return Yup.object().shape({
          Dashboard: Yup.bool().required(),
          Kit_Monitoring: Yup.bool().required(),
          Kit_Assignment: Yup.bool().required(),
          Kit_Tracking: Yup.bool().required(),
          Geofence: Yup.bool().required(),
          Device_Management: Yup.bool().required(),
          Prisoner_Management: Yup.bool().required(),
          Prosecutor_Management: Yup.bool().required(),
          User_Management: Yup.bool().required(),
          Role_Management: Yup.bool().required(),
          License_Management: Yup.bool().required(),
          Log: Yup.bool().required(),
        })
      
    }),
  });

  const defaultValues = {
    nip: formData ? formData.nip : 0,
    name: formData ? formData.name : '',
    username: formData ? formData.username : '',
    password: '',
    role: formData ? JSON.parse(formData.role) : {
      "Dashboard":true,
      "Kit_Monitoring":false,
      "Kit_Assignment":false,
      "Kit_Tracking":false,
      "Geofence":false,
      "Device_Management":false,
      "Prisoner_Management":false,
      "Prosecutor_Management":false,
      "User_Management":false,
      "Role_Management":false,
      "License_Management":false,
      "Log":false
    },
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      data.role = JSON.stringify(data.role)
      data.nip = `${data.nip}`
      if(formData){
        dispatch(editData(formData.user_id, data))
      }else{
        dispatch(addData(data))
      }
    } catch (error) {
      console.error(error);
      reset();
    }
  };
  const spacing = 3
  const swithSX = { px: 1, py: 1, top: 0 }
  const swithFontSize = 13
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Typography align="center" variant="h6" sx={{ my: 1 }} >
      {text}
      </Typography>
      <Grid container spacing={spacing} >
        <Grid item xs={12} md={6}>
          <Stack spacing={spacing}>
            <RHFTextField name="nip" label="NIP" />
            <RHFTextField name="name" label="Name" />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={spacing}>
            <RHFTextField name="username" label="Username" />
            <RHFTextField type="password" name="password" label="Password" />
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          a
        </Grid>
      </Grid>
        <canvas ref={canvasRef}  style={{ width: '700px', height: '500px' ,border: "1px solid red"}}/>

      
      
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} >
      {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}  
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Submit
      </LoadingButton>
    </FormProvider>
  );
}
