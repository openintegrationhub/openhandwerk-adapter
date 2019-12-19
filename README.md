# openhandwerk-adapter

## Authorization
Each request to openHandwerk API requires an authorization. You have to pass your token as a `Bearer` token in headers.

## Requesting a token
To get a token for the requests you have to send a POST request to the login endpoint (/login).
If you hand over the right credentials as params, you will get a JSON object as response including the
access bearer token.

*Login params:*
  - email
  - password

## Actions and triggers
The **adapter** supports the following **actions** and **triggers**:

#### Triggers:
  - Get customers - polling (```getCustomersPolling.js```)

  All triggers are of type '*polling'* which means that the **trigger** will be scheduled to execute periodically. 

#### Actions:
  - Create customer (```createCustomer.js```)

##### Get customers

Get persons trigger (```getCustomersPolling.js```) performs a request which fetch all customers saved by a user at openHandwerk.

##### Create customer

Create customer action (``createCustomer.js``) creates a customer if it doesn#t already exists.
