import request from 'supertest';
import app from '../index';
import { URL } from 'url';

let authCode;

describe('GET /api/oauth/authorize', () =>{
    
    it('should return 401 unauthorized response with invalid response type', async() => {
        const queryParams = 'client_id=upfirst&state=state1&redirect_uri=http://localhost:8081/process&&response_type=cod'
        const response = await request(app).get('/api/oauth/authorize'+'?'+queryParams);
        expect(response.status).toEqual(401);
    })

    it('should return 302 response with authorization code grant ', async() => {
        const queryParams = 'client_id=upfirst&state=state1&redirect_uri=http://localhost:8081/process&&response_type=code'
        const response = await request(app).get('/api/oauth/authorize'+'?'+queryParams);
        expect(response.status).toEqual(302);
        expect(response.headers.location).toContain(
            '/process?code='
        );
        const urlString = response.headers.location;
        const url = new URL(urlString);
        const resqueryParams = url.searchParams;
        authCode = resqueryParams.get('code');

        expect(authCode).not.toContain('undefined');

    });


});

describe('POST /api/oauth/token', ()=>{
    it('should return 200 with request sent with correct auth code unexpired', async() => {
        expect(authCode).not.toContain('undefined');

        const data = {
            grant_type:'authorization_code',
            client_id:'upfirst',
            redirect_uri:'http://localhost:8081/process',
            code: authCode
        }

        const encodedData = Object.keys(data)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join('&');

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded'
            },
            body:encodedData
        }
        const response = await request(app).post('/api/oauth/token');
        console.log('response from POST ' + response.status);
    })
});