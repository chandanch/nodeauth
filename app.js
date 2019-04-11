const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (request, response) => {
    response.json({
        message: 'Welcome to API'
    });
});

app.post('/api/post', verifyToken, (request, response) => {
    response.json({
        status: 'Successfully created a post!',
        authData: request.authData
    });
});

app.post('/api/login', (request, response) => {

    // Mock User authentication
    const user = {
        id: 12220009,
        username: 'basar',
        email: 'basar@chandio.com'
    }
    
    jwt.sign({user: user}, 'chandiokey', {expiresIn: '10m'}, (error, token) => {
        // es6 syntax: {token: token} => {token}
        response.json({
            token,
            expiresIn: '10 minutes',
        });
    });

});

// Token Format:
// Authorization: Bearer <access_token>

/**
 * Middleware: Verifies if the token is valid
 */
function verifyToken(request, response, next) {
    // Get Authorization header value
    const bearerHeader = request.headers['authorization'];
    // check if the authorization header is available
    if (typeof(bearerHeader) !== 'undefined') {
        // split the 'Bearer & token by space'
        const bearer = bearerHeader.split(' ');
        // get the token
        const bearerToken = bearer[1];
        // verify the token with the private key that was used while creating the token
        jwt.verify(bearerToken, 'chandiokey', (error, authData) => {
            if (error) {
                response.status(403).send({
                    message: 'Access Denied, Invalid Auth token'
                });
            } else {
                request.authData = authData
                next();
            }
        })

    } else {
        response.status(403).send({
            message: 'Accces Denied, Authorization header is missing'
        })
    }
}

app.listen(5000, () => console.log('sever started on port 5000'));