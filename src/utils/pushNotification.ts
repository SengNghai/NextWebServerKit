// import webPush from 'web-push';

export const publicVapidKey = 'BI1DH5Pe73fMpZWhXOohot5UB85QlttiTW5CBgDflA_d3FM7iAX2LdPU7ZtaNMXIKFUuyBHkH2FEkHAuLqE4950';
export const privateVapidKey = '-VgJtyfrkLoXBmnf4zy_xOHru2GYld3OSMy94Qmp1lw';

// // 配置 VAPID 密钥
// webPush.setVapidDetails('mailto:your-email@example.com', publicVapidKey, privateVapidKey);

// // 推送通知函数

// export const sendPushNotification = async (subscription: webPush.PushSubscription, payload: object) => {
//     try {
//       const data = JSON.stringify(payload);
//       await webPush.sendNotification(subscription, data);
//       console.log('推送成功:', subscription.endpoint);
//     } catch (error) {
//       console.error('推送失败:', subscription.endpoint, error as Error );
//       throw new Error(`推送失败: ${error}`);
//     }
//   };