import { IDM } from '@typings/db';
import React, { useCallback, useRef, VFC } from 'react';
import Chat from '../Chat';
import { ChatZone } from './styles';
import { Scrollbars } from 'react-custom-scrollbars';

interface ChatListProps {
  chatData?: IDM[];
}

const ChatList: VFC<ChatListProps> = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback(() => {}, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
