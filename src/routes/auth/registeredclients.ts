
/**
 * cached list of registered clients
 * Ideally fetch this from using an ORM + Database in correlation with a user login
 * Each client can have multiple redirectUris, authGrantCode and access tokens
 */
const registeredClients = {
    "upfirst": {
        'redirectUris': [], 
        'authGrantCode':{
            'code':'', 'expiration':''
        }, 
        'accessTokens':[{'token':'' ,'scopes':[]}]
    },
};

export default registeredClients;