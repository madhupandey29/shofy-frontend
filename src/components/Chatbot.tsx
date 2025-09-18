// components/Chatbot.tsx
'use client';

import React from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const theme = {
  background: '#f5f8fb',
  headerBgColor: '#0D9488',
  headerFontColor: '#fff',
  botBubbleColor: '#0D9488',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

const steps = [
  { id: '1', message: 'Hi! How can I help you?', trigger: '2' },
  { id: '2', user: true, trigger: '3' },
  { id: '3', message: 'Thanks! We’ll get back to you soon.', end: true },
];

const Chatbot = () => {
  return (
    <ThemeProvider theme={theme}>
      <div style={{ position: 'fixed', bottom: '90px', right: '24px', zIndex: 9999 }}>
        <ChatBot steps={steps} floating />
      </div>
    </ThemeProvider>
  );
};

export default Chatbot;
