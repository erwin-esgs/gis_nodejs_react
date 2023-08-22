// import { paramCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
// @mui
import {
  Card,
  Stack,
  Container,
  Typography,
  Grid,
  Link,
} from '@mui/material';
import { useTheme  } from '@mui/material/styles';
import { m } from 'framer-motion';
import Page from '../components/Page';

import SignatureForm from '../components/form/SignatureForm';
import ButtonPopover from '../components/ButtonPopover';

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------


export default function Dashboard() {
  const canvasRef = useRef(null);

  useEffect(() => {
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
		  currX = e.clientX - canvas.offsetLeft;
		  currY = e.clientY - canvas.offsetTop;
		  
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
  
  return (
    <Page title="Dashboard">
      <Grid container spacing={2} >
        <Grid item xs={12}>
          <Link href='/map/openstreet'> Map_OpenStreet</Link>
          {/* <ButtonPopover text='+Signature' > 
            <SignatureForm text="SignatureForm" />
          </ButtonPopover> */}
        </Grid>
        <Grid item xs={12}>
          <Link href='/map/mapbox'> Map_Mapbox</Link>
        </Grid>
      </Grid>
        <>
          <canvas ref={canvasRef} width={700} height={500} style={{border: "1px solid red"}}/>
        </>
    </Page>
  );
}

// ----------------------------------------------------------------------
