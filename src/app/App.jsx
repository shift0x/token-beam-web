import './App.css';

import ThemeOptions from './theme';
import { Container, CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import AppAppBar from '../components/AppAppBar';

const darktheme = createTheme(ThemeOptions("dark"))

function App() {
  return (
    <ThemeProvider theme={darktheme}>
      <Container>
        <CssBaseline />
        <AppAppBar />
        <Container sx={{ pt: 10}}>
          <Outlet />
        </Container>
      </Container>
    </ThemeProvider>
  );
}

export default App;
