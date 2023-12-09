import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp'

@Injectable()
export class UserImageValidationPipe implements PipeTransform {

  async transform(value: Express.Multer.File) {
    if (!value) {
      throw new BadRequestException(`No image`)
    }

    try{
      await sharp(value.buffer).metadata()
    }
    catch (err) {
      console.log(err)
      throw new BadRequestException(`It's not an image`)
    }

    return value
  }
}