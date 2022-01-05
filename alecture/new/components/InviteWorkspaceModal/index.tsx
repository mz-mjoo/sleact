import useInput from '@new/hooks/useInput';
import { Button, Input, Label } from '@new/pages/Signup/styles';
import fetcher from '@new/utils/fetcher';
import { IChannel, IUser } from '@typings/db';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import Modal from '../Modal';

interface InviteWorkspaceModalProps {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkSpaceModal: (flag: boolean) => void;
}

const InviteWorkspaceModal: FC<InviteWorkspaceModalProps> = ({ show, onCloseModal, setShowInviteWorkSpaceModal }) => {
  const [newMember, onChangeNewMember, setNewMember] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const {
    data: userData,
    error,
    revalidate,
    mutate,
  } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, {
    dedupingInterval: 2000,
  });

  const { data: memberData, revalidate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher,
    {
      dedupingInterval: 2000,
    },
  );

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();

      if (!newMember || !newMember.trim()) return;

      axios
        .post(
          `/api/workspaces/${workspace}/members`,
          {
            email: newMember,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          revalidateChannel();
          setShowInviteWorkSpaceModal(false);
          setNewMember('');
        })
        .catch((err) => {
          console.dir(err);
          toast.error(err.response?.data, {
            position: 'bottom-center',
          });
        });
    },
    [workspace, newMember],
  );

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" type="email" value={newMember} onChange={onChangeNewMember} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
};

export default InviteWorkspaceModal;
