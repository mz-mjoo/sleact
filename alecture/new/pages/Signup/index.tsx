import useInput from '@new/hooks/useInput';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Header, Form, Label, Input, Button, LinkContainer, Error, Success } from './styles';
import axios from 'axios';
import fetcher from '@new/utils/fetcher';
import useSWR from 'swr';

const Signup = () => {
  const { data, error, revalidate } = useSWR('/api/users', fetcher);
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password],
  );

  if (data === undefined) {
    return <div>로딩중.. 🐤</div>;
  }

  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      console.log(email, nickname, password, passwordCheck);

      // mismatchError가 없다면?
      if (!mismatchError) {
        console.log('서버로 회원가입하기');
        // 비동기처리 로딩 단계
        setSignupError('');
        setSignupSuccess(false);
        axios
          .post('/api/users', {
            email,
            nickname,
            password,
          }) // 성공 단계
          .then((response) => {
            console.log('어디!?!', response);
            setSignupSuccess(true);
          }) // 실패 단계
          .catch((error) => {
            console.log(error.response);
            setSignupError(error.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, passwordCheck, mismatchError],
  );

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signupError && <Error>{signupError}</Error>}
          {signupSuccess && <Success>회원가입이 완료되었습니다! 🐥</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default Signup;
