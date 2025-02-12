
import AuthProfile from "./authprofile";
/**
 * cached list of registered clients
 * Ideally fetch this from using an ORM + Database in correlation with a user login
 * Each client can have multiple redirectUris, authGrantCode and access tokens
 */
const registeredClients: AuthProfile [] = [];

export default registeredClients;