const apiPath = '/api';

module.exports = {
    app: {
        port: 3000,
        cookie: {
            maxAge: 1000/*ms*/ * 60/*s*/ * 60/*m*/ * 1/*h*/,
        }
    },
    facebook: {
        api: {
            appId: '',
            appSecret: '',
        },
        apiPath: 'https://graph.facebook.com/v2.8',
        path: apiPath + '/facebook',
        redirect_url: '/callback',
    },
    vkontakte: {
        api: {
            appId: '',
            appSecret: '',
        },
        apiPath: 'https://api.vk.com/method',
        apiVersion: '5.63',
        path: apiPath + '/vkontakte',
        redirect_url: '/callback',
    }
};
