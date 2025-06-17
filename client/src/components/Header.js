import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  const domainName = process.env.REACT_APP_DOMAIN || 'kickshare.fun';

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">{domainName}</Logo>
        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/" onClick={() => window.open('https://github.com/markdown-it/markdown-it', '_blank')}>
            Markdown Guide
          </NavLink>
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;