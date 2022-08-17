# stream-checker

My approach to this problem uses a simple approach of using dynamoDB to save and store the instances of a user streaming. Due to issues connecting to a local instance of dynamoDB on a separate docker network. I reverted to simulating this approach using an array of objects in the place of a dynamoDB.

Using three methods, GET POST and DELETE to manage stream. POST when starting a new stream and check if there is less than 3 streams concurrently playing, GET to get the list of streams and Delete to remove and stream when it is ended. Each user streaming in limited to 3 streams and once the stream is concluded it can be removed from the que or list using the Delete method.

### Building

- clone the repository into your chosen location.
- install the dependencies `npm install` within the main folder stream-check/main.
- run `sam build`.
- run `sam local start-api` to start the API locally.
- utilise Postman or a similar API client to call the API.

### Endpoints

- GET

To check and add a stream, send a GET request to http://localhost:3000/stream, an example request body is as follows:


- POST

To check and add a stream, send a POST request to http://localhost:3000/stream, an example request body is as follows:

```js
{
    "userId": "1234"
}
```

- DELETE

To remove a stream, send a DELETE request to http://localhost:3000/stream.

```js
{
    "userId": "1234"
}
```