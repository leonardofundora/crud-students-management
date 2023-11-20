const {prisma} =require('../prisma/PrismaConection')

class LoginServices{

    static async login(user){
        const {email,password} =user

       return await prisma.user.findMany({where:{

            password,
            email,
        }})

    }
}

module.exports={LoginServices}