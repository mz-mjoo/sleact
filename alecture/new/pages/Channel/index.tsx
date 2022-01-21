// import Workspace from '@new/layouts/Workspace';
import ChatBox from '@new/components/ChatBox';
import ChatList from '@new/components/ChatList';
import InviteChannelModal from '@new/components/InviteChannelModal';
import useInput from '@new/hooks/useInput';
import useSocket from '@new/hooks/useSocket';
import fetcher from '@new/utils/fetcher';
import makeSection from '@new/utils/makeSection';
import { IChannel, IChat, IUser } from '@typings/db';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { useParams } from 'react-router';
import useSWR, { useSWRInfinite } from 'swr';
import { Container, DragOver, Header } from './styles';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const { data: myData } = useSWR('/api/users', fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const {
    data: chatData,
    mutate: mutateChat,
    revalidate,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  // 채널에 참가중인 멤버 데이터
  const { data: channelMemberData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const scrollbarRef = useRef<Scrollbars>(null);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const [socket] = useSocket(workspace);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        const savedChat = chat;
        // Optimistic UI
        if (chat?.trim() && chatData && channelData) {
          mutateChat((prevChatData) => {
            // dm에 들어가는 데이터들을 넣어준다.
            prevChatData?.[0].unshift({
              id: (chatData[0][0].id || 0) + 1,
              content: savedChat,
              UserId: myData.id,
              User: myData,
              ChannelId: channelData.id,
              Channel: channelData,
              createdAt: new Date(),
            });
            return prevChatData;
          }, false).then(() => {
            setChat('');
            scrollbarRef.current?.scrollToBottom();
          });
        }

        axios
          .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
            content: chat,
          })
          .then(() => {
            revalidate();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [chat, chatData, myData, channelData, workspace, channel],
  );

  // 로딩시 스크롤바 제일 아래로
  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }

    return () => {};
  }, [chatData, myData]);

  const onMessage = useCallback(
    (data: IChat) => {
      // id는 상대방 아이디
      if (data.Channel.name === channel && (data.content.startsWith('uploads\\') || data.UserId !== myData.id)) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              console.log('scrollToBottom!', scrollbarRef.current?.getValues());
              setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
              }, 50);
            }
          }
        });
      }
    },
    [channel],
  );

  useEffect(() => {
    socket?.on('message', onMessage);

    return () => {
      socket?.off('message', onMessage);
    };
  }, [socket, onMessage]);

  const chatSections = makeSection(chatData ? [...chatData].flat().reverse() : []);

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

  const onDragOver = useCallback((e) => {
    console.log(e.target);

    setDragOver(true);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    console.log(e.target);

    setDragOver(false);
  }, []);

  if (!chatData || !myData) {
    return null;
  }

  return (
    // onDrop & onDragOver 가 있는 컴포넌트가 드롭존, 이미지를 드롭해서 놓을 수 있는 공간.
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      <Header>
        <span>#{channel}</span>
        <div className="header-right">
          <span>{channelMemberData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <ChatList chatSections={chatSections} setSize={setSize} isReachingEnd={isReachingEnd} ref={scrollbarRef} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      ></InviteChannelModal>
      {dragOver && <DragOver>사진 업로드! 🎉</DragOver>}
    </Container>
  );
};

export default Channel;
