# Users service

API to manage a user persistence layer.

# Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Development](#development)
- [License](#license)

# Installation
This is node.js app.

In the terminal from the root of your app you can install it with:

```sh 
npm install
```

# Configuration
The configuration is in `src/config/config.js` config file.

It contains template with all configuration parameters.

Some of them have default values but other must be configured appropriately.

If you want to log in mongo with specific user you can specify the following settings under `dbSettings`:
```sh
{
  ...
  user: <mongo_user>,
  pass: <mongo_pwd>,
  auth: true
}
```

# Usage
Run your app with:
```sh 
npm run
```

Then open the swagger ui pannel usually at [here](http://localhost:3000/swagger) to play with the exposed endpoints.

# Development
> This section is for individuals developing the Users service app and not intended for end-users.

## Sample Development Workflow

Clone this repository

From the root of your project run `npm install`

Run `npm test` to see unite test suite test results

Start doing your code changes

Make sure the test suite is still working after code changes

### Start with docker
Run the following command to do this:
```sh
docker-compose up
```

Usually you could open [here](http://localhost:3000/swagger) to play with the exposed endpoints.

## Contributing 

This project is open source. Please consider forking this project to improve, enhance or fix issues. If you feel like the community will benefit from your fork, please open a pull request.

# License

MIT License

Copyright (c) 2017 Vladimir Trifonov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
