import { useCallback } from 'react';
import io from 'socket.io-client';

const sockets: { [key: string]: SocketIOClient.Socket } = {};

const backUrl = 'http://localhost:3095';

const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect;
      delete sockets[workspace];
    }
  }, []);

  if (!workspace) return [undefined, disconnect];

  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }

  // emit 클라이언트에서 서버로 보내는 이벤트

  // 이 socket을 통해서 서버와 소통할 수 있다.
  //   sockets[workspace].emit('hello', 'world'); // 'hello' 라는 이름으로 'world'라는 데이터를 보낸다. emit(이벤트명, 데이터)

  // 서버쪽에서 데이터가 오면 이벤트 이름, 데이터 받는 콜백함수 (이벤트 리스너)
  // on 서버에서 클라이언트로 보내는 이벤트
  //   sockets[workspace].on('message', (data) => {
  //     console.log(data);
  //   });

  return [sockets[workspace], disconnect];
};

export default useSocket;
