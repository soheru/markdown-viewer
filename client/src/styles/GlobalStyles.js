import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#3f51b5',
    secondary: '#f50057',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#212121',
    textLight: '#757575',
    border: '#e0e0e0',
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    round: '50%'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
  }
};

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-weight: 500;
  }
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  button, .button {
    cursor: pointer;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 1rem;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #303f9f;
    }
    
    &:disabled {
      background-color: ${({ theme }) => theme.colors.textLight};
      cursor: not-allowed;
    }
  }
  
  input, textarea {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: ${({ theme }) => theme.spacing.md};
  }
  
  .card {
    background-color: ${({ theme }) => theme.colors.surface};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.lg};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  .alert {
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    &.alert-success {
      background-color: #e8f5e9;
      color: ${({ theme }) => theme.colors.success};
      border-left: 4px solid ${({ theme }) => theme.colors.success};
    }
    
    &.alert-error {
      background-color: #ffebee;
      color: ${({ theme }) => theme.colors.error};
      border-left: 4px solid ${({ theme }) => theme.colors.error};
    }
    
    &.alert-info {
      background-color: #e3f2fd;
      color: ${({ theme }) => theme.colors.info};
      border-left: 4px solid ${({ theme }) => theme.colors.info};
    }
  }
`;