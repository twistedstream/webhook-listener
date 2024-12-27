const { UnauthorizedError } = require("./error");

const { CLIENT_API_KEY } = process.env;

// middlewares

function requiresApiAuth() {
  return (req, _res, next) => {
    const authorization = req.get("Authorization");
    if (authorization) {
      const PREFIX = "Bearer ";
      if (authorization.startsWith(PREFIX)) {
        const apiKey = authorization.substring(PREFIX.length);

        if (apiKey === CLIENT_API_KEY) {
          return next();
        }
      }
    }

    return next(UnauthorizedError());
  };
}

module.exports = {
  requiresApiAuth,
};
