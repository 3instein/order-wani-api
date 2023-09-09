import jwt from 'jsonwebtoken';
import { SECRET } from './secret';

export function generateAccessToken(username: string) {
    if (!SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign({ username }, SECRET, { expiresIn: '1800s' })
}

export function authenticateToken(req: any, res: any, next: any) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.json({
            status: 401,
            message: 'Unauthorized'
        })
    }

    jwt.verify(token, SECRET!, (err: any, user: any) => {
        if (err) {
            return res.json({
                status: 403,
                message: 'Forbidden'
            })
        }
        req.user = user
        next()
    })
}