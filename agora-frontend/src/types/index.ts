import {
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  SDK_CODEC,
  SDK_MODE,
} from 'agora-rtc-sdk-ng';
interface RtcOptions extends CreateAgoraClientInfoTypeAfterToken {
  appId: string;
  codec: SDK_CODEC;
}
interface CreateAgoraClientInfoTypeAfterToken
  extends CreateAgoraClientInfoType {
  token: string;
}
interface CreateAgoraClientInfoType extends BaseOptions {
  role: number;
  mode: SDK_MODE;
}
interface BaseOptions {
  channel: string;
  uid: string;
}
interface RemotePlayers {
  uid: string;
  video: boolean;
  audio: boolean;
  videoTrack: IRemoteVideoTrack | undefined;
  audioTrack: IRemoteAudioTrack | undefined;
}
export {
  CreateAgoraClientInfoType,
  RtcOptions,
  BaseOptions,
  CreateAgoraClientInfoTypeAfterToken,
  RemotePlayers,
  SDK_MODE,
};
