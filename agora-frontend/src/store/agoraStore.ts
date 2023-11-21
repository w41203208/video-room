import { getAgoraRTCToken } from '@/services/api';
import { CreateAgoraClientInfoType, RemotePlayers } from '@/types';
import { Module } from 'vuex';
import { agoraState, rootState } from './types';

export const agoraStore: Module<agoraState, rootState> = {
  state: {
    createAgoraInfo: {
      uid: '',
      token: '',
      channel: '',
      mode: '',
      role: 0,
    },
    remoteUsers: [],
  },
  getters: {
    isAuth: (state) => !!state.createAgoraInfo.token,
    getRemoteUses: (state) => state.remoteUsers,
  },
  mutations: {
    setCreateAgoraInfo(state, info) {
      state.createAgoraInfo = info;
    },
    setAgoraToken(state, token: string) {
      state.createAgoraInfo.token = token;
    },
    resetCreateAgoraInfo(state) {
      state.createAgoraInfo = {
        uid: '',
        token: '',
        channel: '',
        mode: '',
        role: 0,
      };
    },
    m_setRemoteUser(state, user) {
      state.remoteUsers.push(user);
    },
    m_removeRemoteUser(state, uid) {
      state.remoteUsers.filter((user) => uid !== user.uid);
    },
    m_resetRemoteUser(state) {
      state.remoteUsers = [];
    },
  },
  actions: {
    a_getCreateAgoraInfo(context, info: CreateAgoraClientInfoType) {
      const { uid, channel, mode, role } = info;
      return new Promise((resolve, reject) => {
        getAgoraRTCToken(uid, channel, role)
          .then((res: any) => {
            const newInfo = {
              uid: uid,
              token: res.data.token,
              channel: channel,
              mode: mode,
              role: role,
            };
            context.commit('setCreateAgoraInfo', newInfo);
            resolve(res);
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    },
  },
};
