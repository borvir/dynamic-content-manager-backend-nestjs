import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/config/multer.config';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/auth/auth/auth.guard';
import { FileDto } from './dto/file.dto';
import { CurrentUser } from 'src/core/user/current-user.decorator';

@Controller('file')
@ApiTags('file')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly service: FileService) {}

  @Post('file')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        tagIds: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Created successfully',
    type: FileDto,
    isArray: false,
  })
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() tagIds: string[],
    @CurrentUser() user: { userId: string; email: string },
  ) {
    const fileDtos: FileDto[] = [];
    for (const file of files) {
      fileDtos.push(
        await this.service.createItem(
          { file: file, tagIds: tagIds },
          user.userId,
        ),
      );
    }
    return fileDtos;
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Die ID des Tag der gelöscht werden soll.',
    example: '1',
  })
  @ApiOkResponse({ description: 'Der Tag wurde erfolgreich entfernt.' })
  @ApiResponse({
    status: 404,
    description: 'Der zu löschende Tag wurde nicht gefunden.',
  })
  @ApiResponse({
    status: 226,
    description:
      'Der zu löschende Tag ist noch in Benutzung und wurde inaktiv gesetzt.',
  })
  async delete(@Param('id') id: string) {
    const code = await this.service.delete(id);
    return code;
  }
}
