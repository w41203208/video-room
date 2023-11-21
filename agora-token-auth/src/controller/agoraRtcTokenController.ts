const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

type RTCToken = string;
type GenerateRTCToken = (
  uid: number,
  channelName: string,
  role: number
) => RTCToken;

type Handle<T = any> = (req: any, res: any) => T;

/**
 * 產生一組RTC token
 * @param uid
 * @param channelName
 * @param role
 * @returns
 */
const generateRtcToken: GenerateRTCToken = (uid, channelName, role) => {
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
  const token = RtcTokenBuilder.buildTokenWithUid(
    appID,
    appCertificate,
    channelName,
    uid,
    role,
    expireTimestamp
  );
  return token;
};

interface Controller extends Record<string | number, Handle> {}

const agoraRTCTokenController = () => {
  let controller = {} as Controller;

  controller.getRTCToken = (req, res) => {
    if (req.method != 'POST') {
      return;
    }
    let { uid, channelName } = req.body;
    let role = req.body.role;
    switch (role) {
      case 1:
        role = RtcRole.PUBLISHER;

        break;
      case 2:
        role = RtcRole.SUBSCRIBER;
        break;
    }
    if (uid === null) {
      uid = 0;
    }
    const token = generateRtcToken(uid, channelName, role);
    return res.json({
      token,
    });
  };

  return controller;
};

export const AgoraRTCTokenController = agoraRTCTokenController();
