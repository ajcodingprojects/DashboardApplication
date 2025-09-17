import { useState } from 'react';
import './App.css';

import DashboardComponent from './DashboardComponent/DashboardComponent';

import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import * as React from 'react';

function App() {
  const [] = useState(0)

  return (
      <>
          <ThemeProvider theme={darkTheme}>
              <CssBaseline />
              <DashboardComponent />
          </ThemeProvider>
    </>
  )
}

export default App


const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});