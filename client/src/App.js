import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ViewPage from './pages/ViewPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from './styles/GlobalStyles';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/view/:shortId" element={<ViewPage />} />
          <Route path="/view" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;