import * as jose from 'jose';

type AuthGrantType = {
    'code': String,
    'accessToken': jose.SignJWT,
    'expiration' : Date
}

type JwtPayload = {
    'sub': String,
    'aud': String,
    'iss': String,
    'iat': Number,
    'exp': Number
}
export { JwtPayload, AuthGrantType };