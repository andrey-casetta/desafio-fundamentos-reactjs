import React from 'react';

import { Link } from 'react-router-dom';

import { Container } from './styles';

import Logo from '../../assets/logo.svg';
import Underline from '../../assets/Hover.png';

interface HeaderProps {
  size?: 'small' | 'large';
}

const Header: React.FC<HeaderProps> = ({ size = 'large' }: HeaderProps) => (
  <Container size={size}>
    <header>
      <img src={Logo} alt="GoFinances" />
      <nav>
        <Link to="/">
          Listagem
          <img
            src={Underline}
            alt="underline"
            className={
              window.location.pathname === '/' ? 'visible' : 'invisible'
            }
          />
        </Link>
        <Link to="/import">
          Importar
          <img
            src={Underline}
            alt="underline"
            className={
              window.location.pathname === '/import' ? 'visible' : 'invisible'
            }
          />
        </Link>
        <br />
      </nav>
    </header>
  </Container>
);

export default Header;
