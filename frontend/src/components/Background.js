import PropTypes from 'prop-types';
// import { Helmet } from 'react-helmet-async';
import { forwardRef } from 'react';
import { useTheme  } from '@mui/material/styles';
import { m } from 'framer-motion';
// @mui
import { Box, Container,Card } from '@mui/material';
import { MotionContainer, varSlide } from './animate';

// ----------------------------------------------------------------------

const radius = "75%"

const Background = forwardRef(({ children, ...other }, ref) => {
  const theme = useTheme();
  return (
  <>
      <div style={{width:"100vw" , height:"100vh", position: 'absolute', overflow:"hidden" ,}}>
        <div style={{
              backgroundColor: theme.palette.primary.main, 
              width:"200vw", 
              height:window.screen.height*0.6 , 
              borderBottomLeftRadius:radius , 
              borderBottomRightRadius:radius,
              left: '-50%',
              position: 'absolute',
              top: -window.screen.height*0.2 ,
            }}/>
        {/* <Container component={MotionContainer} sx={{ 
          }}>
          <m.div variants={varSlide().inDown} >
            <div style={{
              backgroundColor: theme.palette.primary.main, 
              width:"200vw", 
              height:window.screen.height*0.6 , 
              borderBottomLeftRadius:radius , 
              borderBottomRightRadius:radius,
              left: '-50%',
              position: 'absolute',
              top: -window.screen.height*0.2 ,
            }}/>
          </m.div>
        </Container> */}
      </div>
    
    <Card sx={{backgroundColor: 'transparent', boxShadow: 'none',}} >
    <Box ref={ref} {...other}>
      {children}
    </Box>
    </Card>
  </>
)});

Background.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  meta: PropTypes.node,
};

export default Background;
