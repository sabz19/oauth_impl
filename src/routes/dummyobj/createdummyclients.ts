import registeredClients from "../auth/registeredclients";
import AuthProfile from "../auth/authprofile";

function createDummyClients(){
    let upfirstProfile = new AuthProfile('upfirst');
    upfirstProfile.addRedirectUri('http://localhost:8081');
    registeredClients.push(upfirstProfile);

}

export default createDummyClients;
