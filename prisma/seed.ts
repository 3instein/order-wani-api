import { PrismaClient } from "@prisma/client"
import CryptoJS from "crypto-js"

const prisma = new PrismaClient()

async function main() {

    const dummyUser = await prisma.user.create({
        data: {
            username: "dummy",
            password: CryptoJS.SHA256('dummy').toString()
        }
    })

    const ayamGeprek = await prisma.menu.create({
        data: {
            image: "ayam-geprek.jpeg",
            name: "Ayam Geprek",
            price: 15000
        }
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })