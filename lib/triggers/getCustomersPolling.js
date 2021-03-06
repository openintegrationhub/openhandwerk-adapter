"use strict";
const co = require('co');
const request = require('request-promise');
const messages = require('elasticio-node').messages;
const uuidv1 = require('uuid/v1');

exports.process = processTrigger;

async function processTrigger(msg, cfg) {
    const self = this;

    // access token got by the login from the API
    const apiKey = cfg.apiKey;

    // access the value of the apiUrl field defined in credentials section of component.json
    const API_URL = cfg.apiBaseUrl;

    // meta data
    const { applicationUid, domainId, schema } = cfg;

    let meta = {
      applicationUid: (applicationUid !== undefined && applicationUid !== null) ? applicationUid : undefined,
      schema: (schema !== undefined && schema !== null) ? schema : undefined,
      domainId: (domainId !== undefined && domainId !== null) ? domainId : undefined,
    }

    // Returns a generator based control flow using co. Please note that co returns a Promise.

    return co(function*() {

        console.log('Fetching customers from API => ' + API_URL + '/customers');

        const requestOptions = {
            uri: API_URL + `/customers`,
            followAllRedirects: true,
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer " + apiKey
            },
            json: true
        };

        let contentWithMeta;

        // yielding the response
        console.log("Response from request: ");
        let response = yield request.get(requestOptions);

        // console.log("Response from request /customers : " + JSON.stringify(response, null, 2));
        console.log("Response from request: ");
        console.log(response);

        if (typeof response !== undefined) {
          const customerCount = response.length;

          console.log('Found %s Customers', customerCount);
          if(customerCount > 0) {
              response.forEach(elem => {
                  meta.recordUid = elem.rowid;
                  delete elem.rowid;

                  contentWithMeta = {
                    meta,
                    data: elem
                  };

                  console.log('Emitting data');
                  self.emit('data', messages.newMessageWithBody(contentWithMeta));
              });
          }
        } else {
          console.log("no customers");
        }
    });
}
