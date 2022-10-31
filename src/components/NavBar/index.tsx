import React, { useEffect, useState } from 'react';
import { FaSearch, FaRegFileVideo, FaList } from 'react-icons/fa';

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

  const upload = document.getElementById('upload');
  const bosch = document.getElementById('bosch');

  if (upload) {
    upload.addEventListener('click', () => {
      window.location.href = 'http://localhost:3000/upload';
    });
  }
  if (bosch) {
    bosch.addEventListener('click', () => {
      window.location.href = 'http://localhost:3000';
    });
  }

  return (
    <Container isBlack={isBlack}>
      <RoutesMenu>
        <img style={{cursor: 'pointer'}} src={Logo} alt="Bosch" id="bosch"></img>
      </RoutesMenu>
      <Profile>
        <FaSearch style={{cursor: 'pointer', color: 'black'}} />
        <FaRegFileVideo style={{cursor: 'pointer', color: 'black'}} id="upload" />
        <FaList style={{cursor: 'pointer', color: 'black'}} id="labels" />
      </Profile>
    </Container>
  );
};

export default NavBar;
