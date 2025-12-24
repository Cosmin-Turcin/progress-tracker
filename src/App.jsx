import React from "react";
import Routes from "./Routes";
import { AuthProvider } from './contexts/AuthContext';
import { StatsProvider } from './contexts/StatsContext';

function App() {
  return (
    <AuthProvider>
      <StatsProvider>
        <Routes />
      </StatsProvider>
    </AuthProvider>
  );
}

export default App;