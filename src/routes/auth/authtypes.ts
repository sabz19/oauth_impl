import * as jose from 'jose';

type AuthGrantType = {
    'code': String,
    'accessToken': jose.SignJWT,
    'refreshToken': jose.SignJWT,
    'expiration' : Date
}

type JwtPayload = {
    'sub': String,
    'aud': String,
    'iss': String,
    'iat': Number,
    'exp': Number
}

enum Token{
    Access,
    Refresh
}

export { JwtPayload, AuthGrantType, Token };