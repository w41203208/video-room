import { RemotePlayers } from '@/types';

export interface rootState {
  agora: agoraState;
  test: testState;
}

export interface agoraState {
  createAgoraInfo: {
    uid: string;
    token: string;
    channel: string;
    mode: string;
    role: number;
  };
  remoteUsers: Array<RemotePlayers>;
}

export interface testState {
  testnum: number;
}
