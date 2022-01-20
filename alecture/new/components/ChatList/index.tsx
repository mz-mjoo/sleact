import { IChat, IDM } from '@typings/db';
import React, { forwardRef, useCallback } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import { Scrollbars } from 'react-custom-scrollbars';
import Chat from '@new/components/Chat';

interface ChatListProps {
  chatSections: { [key: string]: (IDM | IChat)[] };
  setSize: (index: number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, ChatListProps>(({ chatSections, setSize, isEmpty, isReachingEnd }, ref) => {
  // const scrollbarRef = useRef(null);
  const onScroll = useCallback((values) => {
    if (values.scrollTop === 0) {
      console.log('가장 위');
      // 데이터 추가 로딩

      setSize((prevSize) => prevSize + 1).then(() => {
        // 스크롤 위치 유지 ( 페이지를 하나 더 불러옴 )
      });
    }
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
