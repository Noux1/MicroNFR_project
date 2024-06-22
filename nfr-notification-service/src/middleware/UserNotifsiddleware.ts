import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';


dotenv.config();

// Middleware to verify JWT token and check user identity
export const verifyTokenAndUserMatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            console.log('No token provided');
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = authorizationHeader.split(' ')[1];

        // Keycloak introspection endpoint URL
        const introspectionEndpoint = 'http://localhost:8088/auth/realms/Nfr-realm/protocol/openid-connect/token/introspect';

        // Keycloak client credentials from environment variables
        const client_id = process.env.KEYCLOAK_CLIENT_ID;
        const client_secret = process.env.KEYCLOAK_CLIENT_SECRET;

        if (!client_id || !client_secret) {
            console.error('Keycloak client ID or secret not set in environment variables');
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Introspection request to verify the token
        const introspectionResponse = await axios.post(introspectionEndpoint, new URLSearchParams({
            token: token,
            client_id: client_id,
            client_secret: client_secret
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const tokenInfo = introspectionResponse.data;

        if (!tokenInfo.active) {
            console.log('Token is not active');
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Extract user UUID from the introspection response
        const userUUID = tokenInfo.sub;
        console.log('User UUID:', userUUID);

        if (!userUUID) {
            console.log('User UUID is missing in the token');
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Extract userId from request parameters
        const { userId } = req.params;

        // Check if the user is accessing their own notifications
        if (userUUID !== userId) {
            console.log('User trying to access notifications of another user');
            return res.status(403).json({ error: 'You do not have permission to access these notifications' });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Error occurred:', err);
        return res.status(401).json({ error: 'Invalid token or failed to fetch user details' });
    }
};
