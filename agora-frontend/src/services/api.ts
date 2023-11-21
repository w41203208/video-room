import { routeLocationKey } from 'vue-router';
import { AxiosTokenClient, AxiosClient } from './axios';

// export const getAgoraRTCToken = (
//   uid: string,
//   channel: string,
//   role: number
// ) => {
//   return AxiosTokenClient({
//     url: '/fetch_rtc_token',
//     method: 'post',
//     data: {
//       uid: parseInt(uid),
//       channelName: channel,
//       role: role,
//     },
//   });
// };
export const getAgoraRTCToken = (
  uid: string,
  channel: string,
  role: number
) => {
  return AxiosClient({
    url: '/getRTCToken',
    method: 'post',
    data: {
      uid: parseInt(uid),
      channelName: channel,
      role: role,
    },
  });
};
export const getAgoraRTMToken = (uid: string) => {
  return AxiosClient({
    url: '/getRTMToken',
    method: 'post',
    data: {
      uid: uid,
    },
  });
};

export const getCreateRoom = () => {
  return AxiosClient({
    url: '/getCreateRoom',
    method: 'get',
    data: {},
  });
};

export const getRoomToken = (role: string) => {
  return AxiosClient({
    url: '/getRoomToken',
    method: 'post',
    data: {
      role: role,
    },
  });
};
