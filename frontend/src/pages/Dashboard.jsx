// import { paramCase } from 'change-case';
import { useState, useEffect, useRef } from 'react';
// @mui
import {
  Card,
  Stack,
  Container,
  Typography,
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

  const [canvasWidth, setCanvasWidth] = useState(null);
  const [canvasHeight, setCanvasHeight] = useState(null);

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
      const rect = canvas.getBoundingClientRect();
      
		  // currX = e.clientX - canvas.offsetLeft;
		  // currY = e.clientY - canvas.offsetTop;
		  // currX = (e.clientX  - rect.left ) / 3
		  // currY = (e.clientY - rect.top ) / 3
		  // currX = (e.clientX - rect.left ) * canvas.clientWidth / window.screen.width 
		  // currY = (e.clientY - rect.top ) * canvas.clientHeight / window.screen.height 
		  // currX = e.clientX - rect.left 
		  // currY = e.clientY - rect.top  
		  currX = e.clientX - rect.left
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
  }, []);
  
  return (
    <Page title="Dashboard">
        <>
          <ButtonPopover text='+Signature' > 
            <SignatureForm text="SignatureForm" />
          </ButtonPopover>
        </>
        <canvas ref={canvasRef}  style={{ width: '700px', height: '500px' ,border: "1px solid red"}}/>
    </Page>
  );
}

// ----------------------------------------------------------------------
