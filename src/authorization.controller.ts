import { Body, Controller, Post } from "@nestjs/common";
import { LoginInputModel } from "./models/input/login.input.model";
import { AuthorizationService } from "./authorization.service";
import { LoginValidationPipe } from "./validation/pipes/login-validation.pipe";

@Controller('auth')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService){}

  @Post('/login')
  async login(@Body(LoginValidationPipe) loginData: LoginInputModel) {
    const userId = await this.authorizationService.verifyUser(loginData)
    
    const tokens = await this.authorizationService.signIn(userId)

    return {accessToken: tokens.accessToken}
  }
}