// import Workspace from '@new/layouts/Workspace';
import ChatBox from '@new/components/ChatBox';
import ChatList from '@new/components/ChatList';
import useInput from '@new/hooks/useInput';
import fetcher from '@new/utils/fetcher';
import makeSection from '@new/utils/makeSection';
import { IDM } from '@typings/db';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { Container, Header } from './styles';

const Channel = () => {
  const [chat, onChangeChat] = useInput('');
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
  } = useSWR<IDM[]>(`/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`, fetcher);

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
  }, []);

  const chatSections = makeSection(chatData ? [...chatData].reverse() : []);

  return (
    <Container>
      <Header>Channel 🐧</Header>
      <ChatList chatSections={chatSections} />
      {/* <ChatList /> */}
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
