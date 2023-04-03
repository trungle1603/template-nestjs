<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
    
## Installation

```bash
# Install packge
$ yarn install

# Generate JWT cetificate (require)
$ yarn run gen:jwt-key-pair

# Install mongo redis if your dont have it
$ docker-compose up -d mongo redis

# Generate self ssl certificate use for create https server (optional)
$ yarn run gen:cert
```

## Environment

Please read .env.example.

## Running the app

```bash
# watch mode
$ yarn run start:dev
```

## Note

-   Every api should provide api key in request header
-   With every route without Public decorator, need authencation (except verify-email)

```bash
# Headers
$ {
$   "x-api-key": "<Client API key>",
$   "Authentication": "Bearer <Your access token here>"
$ }
```
