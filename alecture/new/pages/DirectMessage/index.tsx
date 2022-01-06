import fetcher from '@new/utils/fetcher';
import React from 'react';
import useSWR from 'swr';
import { Container } from '../Channel/styles';
import { Header } from '../Signup/styles';
import gravatar from 'gravatar';
import { useParams } from 'react-router';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspace/${workspace}/users/${id}`, fetcher);

  const { data: myData } = useSWR('/api/users', fetcher);
  console.log('DirectMessage', userData);

  if (!userData || !myData) {
    return null;
  }
  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      {/* <ChatList /> */}
      {/* <ChatBox /> */}
    </Container>
  );
};

export default DirectMessage;
