import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { compare } from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { ConfigType } from "./config/configuration";
import { LoginInputModel } from "./models/input/login.input.model";
import { CreateJWT } from "./models/output/JWTresponce";

@Injectable()
export class AuthorizationService {
  constructor(private jwtService: JwtService, private readonly userService: UserService, private configService: ConfigService<ConfigType>){}

  async signIn(userId: string){
    const tokens = await this.createJWT(userId)

    return tokens
  }

  async verifyUser(loginData: LoginInputModel): Promise<string> {
    const user = await this.userService.getUserByEmail(loginData.email)
    if(user){
      try {
        const isMatch = await compare(loginData.password, user.password)
        if(isMatch){
          return user.id.toString()
        }
        throw new UnauthorizedException()
      } catch (error) {
        console.error('Error comparing passwords:', error);
        throw new UnauthorizedException()
      }
      
    }
    
    throw new UnauthorizedException()
  }

  private async createJWT(userId: string): Promise<CreateJWT> {
    const JWT_SECRET_KEY = this.configService.get('JWT_SECRET_KEY')
    const accessTokenPayload = { userId: userId }
    const result = {
      accessToken: await this.jwtService.signAsync(accessTokenPayload, { secret: JWT_SECRET_KEY }),
    }
    return result
  }
}