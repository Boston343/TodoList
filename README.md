# Todo List

Todo list using express.js and EJS. This was used for EJS and Mongoose (MongoDB) learning.

You can add items to the list, and cross them out. Paths available include `localhost:3000/`, `localhost:3000/work`, and `localhost:3000/about`. You can clone this repo and install the node modules below to test on your local computer.

## Dependencies

-   Node modules - inside project run `npm install`
    -   express
    -   ejs
    -   mongoose
    -   lodash
    -   eslint - if desired for linting
        -   [ESLint Getting Started Guide](https://eslint.org/docs/latest/user-guide/getting-started)
-   MongoDB installed. You will need to install the free community server, as well as mongo shell
    -   Installation files:
        -   https://www.mongodb.com/try/download/community
        -   https://www.mongodb.com/try/download/shell
    -   You will then need to add both to your "PATH" environment variable
    -   You can then start your local MongoDB with the command "mongod", and the shell can be accessed with command "mongosh"

## Includes

-   JS includes
    -   express
    -   path
    -   url
    -   lodash
    -   mongoose
-   Mongoose
    -   Connecting to local mongoose database
    -   CRUD operations
-   EJS - Data retreival and manipulation
    -   Serving up HTML files with input from server
    -   Retreive data from form, manipulate, and respond to user with updated html file
    -   EJS layouts and running code inside `.ejs` files so we don't have to have a ton of html files
