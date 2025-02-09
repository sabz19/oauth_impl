
/**
 * cached list of registered clients
 * Ideally fetch this from using an ORM + Database
 */
const registeredClients = {
    "upfirst": {'redirectUris': [], 'authGrantCode':''},
};

export default registeredClients;