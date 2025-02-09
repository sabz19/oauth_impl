type AuthGrantType = {
    'code': String,
    'accessToken': String,
    'expiration' : Date
}

type AuthAccessTokenType = {
    'token': String
}


export { AuthGrantType, AuthAccessTokenType };