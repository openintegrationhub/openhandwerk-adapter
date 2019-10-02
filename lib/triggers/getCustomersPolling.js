"use strict";
const co = require('co');
const request = require('request-promise');
const messages = require('elasticio-node').messages;

exports.process = processTrigger;

function processTrigger(msg, cfg) {

    // access token got by the login from the API
    const apiKey = cfg.apiKey;

    // access the value of the apiUrl field defined in credentials section of component.json
    const API_URL = cfg.apiBaseUrl;

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

        // yielding the response
        console.log("Response from request: ");
        let response = yield request.get(requestOptions);

        // console.log("Response from request /customers : " + JSON.stringify(response, null, 2));
        console.log("Response from request: ");
        console.log(response);

        if (typeof response.records !== undefined) {
          const customerCount = response.records.length;

          console.log('Found %s Customers', customerCount);
          if(customerCount > 0) {
              response.records.forEach(elem => {
                  console.log('Emitting data');
                  messages.newMessageWithBody(elem);
              });
          }
        } else {
          console.log("no records");
        }
    });
}
