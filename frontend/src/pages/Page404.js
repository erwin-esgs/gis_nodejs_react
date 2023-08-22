import { m } from 'framer-motion';
import { Link as RouterLink , useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container,Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
// components
import Page from '../components/Page';
import { MotionContainer, varBounce } from '../components/animate';
import useAuth from '../hooks/useAuth';
import { 
  // PATH_DASHBOARD, 
  PATH_AUTH 
} from '../routes/paths';
// assets
import { PageNotFoundIllustration } from '../assets';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Page404() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const handleLogout = async () => {
    try {
      await logout();
      navigate(PATH_AUTH.login, { replace: true });

    } catch (error) {
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };
  return (
    <Page title="404 Page Not Found">
      <Container component={MotionContainer}>
        <ContentStyle sx={{ textAlign: 'center', alignItems: 'center' }}>
          <m.div variants={varBounce().in}>
            <Typography variant="h3" paragraph>
              Sorry, page not found!
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <Typography sx={{ color: 'text.secondary' }}>
              Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check
              your spelling.
            </Typography>
          </m.div>

          <m.div variants={varBounce().in}>
            <PageNotFoundIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
          </m.div>

          <Stack spacing={3}>
            <m.div variants={varBounce().in}>
              <Button to="/" size="large" variant="contained" component={RouterLink}>
                Go to Home
              </Button>
            </m.div>
            <m.div variants={varBounce().in}>
              <Button  variant="contained" onClick={()=>{handleLogout()}}>
                Logout
              </Button>
            </m.div>
          </Stack>
          
          
        </ContentStyle>
      </Container>
    </Page>
  );
}
