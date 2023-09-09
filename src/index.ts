import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import createError from "http-errors"
import cors from "cors"
import CryptoJS from "crypto-js";
import { generateAccessToken, authenticateToken } from "./tokenHandling";
import cookieParser from 'cookie-parser';

const prisma = new PrismaClient()
const app = express()

app.use(express.json(), cors(), cookieParser())

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({
      status: 400,
      message: 'Username and password are required'
    })
  }

  const passwordHash = CryptoJS.SHA256(password).toString()

  prisma.user.findFirst({
    where: {
      username
    }
  }).then(user => {
    if (!user || passwordHash !== user.password) {
      return res.json({
        status: 401,
        message: 'Invalid credentials'
      });
    }

    const token = generateAccessToken(username)

    res.cookie('token', token, {
      httpOnly: true,
      // You might also want to set other cookie options like:
      // secure: true,  // For HTTPS
      // maxAge: ...    // Expiration duration
      // sameSite: 'strict' // Protection against CSRF
    });
    res.json({
      status: 200,
      message: 'Login success'
    })
  })
})

app.post('/verify_token', authenticateToken, (req: any, res: any) => {
  prisma.user.findFirst({
    where: {
      username: req.user.username
    }
  }).then(user => {
    if (!user) {
      return res.json({
        status: 404,
        message: 'User not found'
      });
    }
    res.json({
      status: 200,
      message: 'Token is valid',
      data: user.username
    });
  }).catch(error => {
    res.json({
      status: 500,
      message: 'Server error'
    });
  });
})

app.get('/menus', authenticateToken, async (req: Request, res: Response) => {

  const result = await prisma.menu.findMany()

  if (result.length === 0) {
    return res.json({
      status: 404,
      message: 'No menus found'
    })
  }
  res.json({
    status: 200,
    message: 'List of menus',
    data: result
  })
})

app.get('/orders', async (req: Request, res: Response) => {
  const result = await prisma.order.findMany()

  if (result.length === 0) {
    return res.json({
      status: 404,
      message: 'No orders found'
    })
  }

  res.json({
    status: 200,
    message: 'List of orders',
    data: result
  })
})

// handle 404 error
app.use((req: Request, res: Response, next: Function) => {
  next(createError(404))
})

app.listen(3000, () =>
  console.log(`⚡️[server]: Server is running at https://localhost:3000`)
)