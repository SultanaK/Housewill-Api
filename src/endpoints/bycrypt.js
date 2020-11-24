
const bcrypt = require('bcryptjs')

bcrypt.hash('abcd1234', 10).then(hash => console.log({ hash }))

/* console.log(Buffer.from('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huZG9lIiwiaWF0IjoxNTgzNzI0MzAwLCJleHAiOjE1ODM4MTA3NTV9')) */