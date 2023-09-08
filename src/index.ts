import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import createError from "http-errors"
import cors from "cors"

const prisma = new PrismaClient()
const app = express()

app.use(express.json(), cors())

app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.json({
      status: 400,
      message: 'Username or password is required'
    })
  }

  const result = await prisma.user.findFirst({
    where: {
      username,
      password
    }
  })

  if (!result) {
    return res.json({
      status: 404,
      message: 'User not found'
    })
  }

  res.json({
    status: 200,
    message: 'Login success',
    data: result
  })
})

app.get('/menus', async (req: Request, res: Response) => {
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