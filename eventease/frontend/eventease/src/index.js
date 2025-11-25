import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/animations.css'; // Add this line
import App from './App';


import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const AnimatedCircularProgress = styled(CircularProgress)`
  animation: ${pulse} 2s ease-in-out infinite;
`;