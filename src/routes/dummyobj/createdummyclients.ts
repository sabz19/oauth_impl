import registeredClients from "../auth/registeredclients";
import AuthProfile from "../auth/authprofile";

/**
 * Create dummy clients to mimick registered clients
 */
function createDummyClients(){
    let upfirstProfile = new AuthProfile('upfirst');
    upfirstProfile.addRedirectUri('http://localhost:8081/process');
    registeredClients.push(upfirstProfile);

}

export default createDummyClients;
