import React, { useEffect, useState } from 'react';

import Logo from '../../assets/logo.png';

import { Container, RoutesMenu, Profile } from './styles';

const NavBar: React.FC = () => {
  const [isBlack, setIsBlack] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => setIsBlack(window.scrollY > 10));

    // Executa quando a pagina for desconstruida
    return () => {
      window.removeEventListener('scroll', () =>
        setIsBlack(window.scrollY > 10),
      );
    };
  }, []);

  return (
    <Container isBlack={isBlack}>
      <RoutesMenu>
        <a href={'http://localhost:3000'}>
          <img src={Logo} alt="Bosch" />
        </a>
      </RoutesMenu>
    </Container>
  );
};

export default NavBar;
