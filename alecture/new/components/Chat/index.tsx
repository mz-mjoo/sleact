import { IChat, IDM } from '@typings/db';
import React, { memo, useMemo, VFC } from 'react';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link, useParams } from 'react-router-dom';

interface ChatProps {
  data: IDM | IChat;
}
const Chat: VFC<ChatProps> = ({ data }) => {
  // console.log('Chat 컴포넌트', user);

  const user = 'Sender' in data ? data.Sender : data.User;
  const { workspace } = useParams<{ workspace: string }>();
  const BACK_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3095' : 'https://sleact.nodebird.com';

  console.log('Chat 컴포넌트 user', user);

  // \d 숫자
  // +는 1개 이상
  // ? 0개나 1개
  // *이 0개 이상
  // g 모두 찾기
  // +만 붙이면 최대한 많이, +? ?를 붙이면 최대한 조금
  // \(엔터 위에 작대기) '또는'을 의미
  // \n는 줄바꿈
  const result = useMemo(
    () =>
      data.content.startsWith('uploads\\') ? (
        <img src={`${BACK_URL}/${data.content}`} style={{ maxHeight: 200 }} />
      ) : (
        regexifyString({
          input: data.content,
          pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
          decorator(match, index) {
            const arr = match.match(/@\[(.+?)]\((\d+?)\)/)!;

            if (arr) {
              return (
                <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                  @{arr[1]}
                </Link>
              );
            }

            return <br key={index} />;
          },
        })
      ),
    [data.content],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36x', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default Chat;
