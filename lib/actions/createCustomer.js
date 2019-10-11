"use strict";

const request = require('request-promise');
const messages = require('elasticio-node').messages;

exports.process = processAction;

function processAction(msg, cfg) {
    // access token got by the login from the API
    const apiKey = cfg.apiKey;

    // access the value of the apiUrl field defined in credentials section of component.json
    const API_URL = cfg.apiBaseUrl;

    const self = this;
    const iamToken = process.env.ELASTICIO_IAM_TOKEN;
    const oihUid = (msg.body.meta!=undefined && msg.body.meta.oihUidEncrypted!= undefined) ? msg.body.meta.oihUidEncrypted : 'oihUidEncrypted not set yet';

    const requestOptions = {
        uri: API_URL + `/customer`,
        followAllRedirects: true,
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer " + apiKey
        },
        body: msg.body,
        json: true
    };

    const getApplicationUid = {
        uri: `http://component-repository.openintegrationhub.com/components/` + process.env.ELASTICIO_COMP_ID,
        json: true,
        headers: {
          "Authorization" : `Bearer ` + iamToken,
        }
    };

    const applicationUidResponse = await request.get(getApplicationUid);
    const appUid = applicationUidResponse.data.applicationUid;

    console.log('Creating new customer [/]');

    console.log(API_URL);

    let meta ={
        applicationUid: (appUid!=undefined && appUid!=null) ? appUid : 'appUid not set yet',
        oihUidEncrypted: oihUid
    };

    request.post(requestOptions).then((res) => {
      console.log("success");

      meta.recordUid = res.customer_id;
      delete res.customer_id;

      const contentWithMeta = {
          meta,
          data: res
      };

      self.emit('data', messages.newMessageWithBody(contentWithMeta));
    }, function(err) {
      console.log("[ERROR]");
      console.log(err);
    });
}
