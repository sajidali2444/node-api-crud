const express = require('express');
const secretAPI = '12345';
const message = 'API key is missing, you are not allowed to access api';
const app = express();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

//body parser
app.use(express.json());
//root api end point
app.get('/', (request, response) => {
  response.json({
    message: 'api response',
  });
  console.log('I am root path of your proejct');
  console.log('checking change set');
});

app.get('/users', async (request, response) => {
  if (request.headers['secret-key'] === secretAPI) {
    //connect to db
    //fetch users from db
    //convert result to json
    //return users
    const users = await prisma.users.findMany();
    response.json({
      message: 'api response',
      users,
    });
  } else {
    response.json({
      message,
    });
  }
});

//path name users
app.post('/users', async (request, response) => {
  //{}
  // or ||
  // and &&
  //create resoure / create users
  const { name, email, mobile, address } = request.body;
  console.log({ name, email, mobile, address });

  //   const user = {
  //     name: 'Sajid',
  //     email: 'sajid@gmail.com',
  //     mobile: '234234',
  //     address: 'ali garden',
  //   };

  const createdUser = await prisma.users.create({
    data: { name, email, mobile, address },
  });

  if (request.headers['secret-key'] === secretAPI) {
    response.json({
      message: 'api response',
      headerValue: request.headers['my-custom-header-value'],

      users: createdUser,
    });
  } else {
    response.status(404).json({
      message,
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
