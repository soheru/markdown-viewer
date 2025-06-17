import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const HomeButton = styled(Link)`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
    text-decoration: none;
  }
`;

const NotFoundPage = () => {
  return (
    <NotFoundContainer>
      <Title>404 - Page Not Found</Title>
      <Message>
        The page you're looking for doesn't exist or has been moved.
      </Message>
      <HomeButton to="/">Back to Home</HomeButton>
    </NotFoundContainer>
  );
};

export default NotFoundPage;