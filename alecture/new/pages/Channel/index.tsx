// import Workspace from '@new/layouts/Workspace';
import ChatBox from '@new/components/ChatBox';
import ChatList from '@new/components/ChatList';
import useInput from '@new/hooks/useInput';
import React, { useCallback } from 'react';
import { Container, Header } from './styles';

const Channel = () => {
  const [chat, onChangeChat] = useInput('');
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
  }, []);
  return (
    <Container>
      <Header>Channel 🐧</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
