### Fruit Voting API Documentation

This API allows you to interact with a fruit voting contract. You can vote for your favorite fruit and retrieve the total number of votes for a specific fruit.

#### Base URL

The base URL for all endpoints is `https://your-api.com`.

### `/vote/:fruitName`

#### Endpoint Description

This endpoint allows you to vote for a specific fruit.

#### HTTP Method

- `GET`

#### URL Parameters

- `fruitName` (string, required): The name of the fruit you want to vote for.

#### Request Example

```http
GET https://your-api.com/vote/apple
```

#### Success Response

- Status Code: `200 OK`

- Response Body:

```json
{
  "to": "0x12345...", // Transaction recipient address
  "data": "0xabcdef..." // Transaction data (encoded name of the fruit)
}
```

#### Error Responses

- Status Code: `400 Bad Request`

  Response Body (Example):

  ```json
  {
    "error": "Invalid fruit name provided."
  }
  ```

- Status Code: `500 Internal Server Error`

  Response Body (Example):

  ```json
  {
    "error": "Internal server error. Please try again later."
  }
  ```

#### Observations

Note that the HTTP Method is `GET`. The method will return the unsigned transaction and will relegate its handling to the browser injected provider (metamask).

### `/getVotes/:fruitName`

#### Endpoint Description

This endpoint retrieves the total number of votes for a specific fruit.

#### HTTP Method

- `GET`

#### URL Parameters

- `fruitName` (string, required): The name of the fruit for which you want to retrieve the votes.

#### Request Example

```http
GET https://your-api.com/getVotes/apple
```

#### Success Response

- Status Code: `200 OK`

- Response Body:

```json
{
  "fruit": "apple",
  "votes": "42"
}
```

#### Error Responses

- Status Code: `400 Bad Request`

  Response Body (Example):

  ```json
  {
    "error": "Invalid fruit name provided."
  }
  ```

- Status Code: `500 Internal Server Error`

  Response Body (Example):

  ```json
  {
    "error": "Internal server error. Please try again later."
  }
  ```

`https://your-api.com` should be replaced with the actual URL where the API is hosted. For testing purposes, the application default port will be set such that `http://localhost:8000/`.

Please note that

### Enviromental variables

Please note that the following environmental variables should be set for a proper functioning of the backend:

`.env`

```env
PORT='8000'
ETHEREUM_NETWORK='sepolia'
SIGNER_PRIVATE_KEY='your-wallet-private-key'
INFURA_API_KEY='your-infura-api-key'
INFURA_API_SECRET='your-infura-api-secret'
```
