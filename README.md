# OAuth 2.0 Implementation
![alt text](https://miro.medium.com/v2/resize:fit:494/1*St3fqJKbsSZD_eAhE5HtAw.png)

## Quick Start
1. Clone repo git clone `https://github.com/sabz19/oauth_impl.git`
2. npm install
3. npm start


## Assumptions For Demo Purposes

1. There is no Database used or cache servers like Redis / Memcached for sensitive data, all generated JWT tokens are temporarily stored in RAM by variables in code
2. RSA Algorithm is used for generating keys. Private keys are uploaded in this repo and used by the server to sign and encrypt tokens. These ideally need to be stored in a secure container
3. Implicit assumption that login has already occurred, so at the time of generating an auth code, an auth check is performed which by default always returns true
4. Since some RFC specifications are open-ended, some additional checks have been implemented such as checking for a registered list of uris to prevent CSRF


## Dependencies
1. Jose for JWT token generation
2. Express for server
