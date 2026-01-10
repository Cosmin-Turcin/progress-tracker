import React from "react";
import Routes from "./Routes";
import { AuthProvider } from './contexts/AuthContext';
import { StatsProvider } from './contexts/StatsContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatsProvider>
          <Routes />
        </StatsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;