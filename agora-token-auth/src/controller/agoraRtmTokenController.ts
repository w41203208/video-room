import { RtmTokenBuilder, RtmRole } from 'agora-access-token';

type RTMToken = string;
type GenerateRTMToken = (uid: string) => RTMToken;

type Handle<T = any> = (req: any, res: any) => T;

const generateRtmToken: GenerateRTMToken = (uid) => {
  //Agora 控制台專案的 App ID
  const appID = '9533f78356b045399c1ba4a505f624c2';
  //Agora 控制台專案的 App Certificate
  const appCertificate = 'f751f1d1ef8f4519974e3420177152db';
  // token 過期秒數
  const expireTimeInSeconds = 3600;
  // 取得當前時間
  const currentTimestamp = Math.floor(Date.now() / 1000);
  // Token 過期的時間
  const expireTimestamp = expireTimeInSeconds + currentTimestamp;
  const token = RtmTokenBuilder.buildToken(
    appID,
    appCertificate,
    uid,
    RtmRole.Rtm_User,
    expireTimestamp
  );
  return token;
};
interface Controller extends Record<string | number, Handle> {}

const agoraRTMTokenController = () => {
  let controller = {} as Controller;

  controller.getRTMToken = (req, res) => {
    if (req.method != 'POST') {
      return;
    }
    let { uid } = req.body;
    const token = generateRtmToken(uid);

    return res.json({
      token,
    });
  };

  return controller;
};
export const AgoraRTMTokenController = agoraRTMTokenController();
