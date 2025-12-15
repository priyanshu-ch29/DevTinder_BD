- app.use("/messi/stats", (req, res) => {
  res.send("Messi stats!")
  res.send("Messi internation stats!")
  })
  ❌ error as we have send one response we can't send other response after sending the first response the response stream will end and cannot change the header after the response has send to client.

- patch VS Put -> patch only updates the field value u are sending in the body and put updates the entire document eg. i send
  {
  "first_name": "priyanshu"
  }
  then only first_name will be updated in patch but in put the entire document will be updated

- express.json() -> middleware -> it is used to parse the incoming request body and convert it into a JavaScript object and it is a built-in middleware function in express.

- JWT token -> JSON Web Token -> it is a compact and self-contained way of representing claims to be transferred between two parties.
  It is a string that is signed and encoded in base64.
  It is used to authenticate the user and to verify the user's identity.
  It is a secure way of transferring data between the client and the server.
  It is a stateless way of authentication.
  It is a way of transferring data between the client and the server without storing the data in the server.
  Token contains 3 parts -> header, payload, signature.
  Header contains the type of token and the algorithm used to sign the token.
  Payload contains the claims.
  Signature is used to verify that the sender of the token is who it says it is and to ensure that the message wasn't changed along the way.
