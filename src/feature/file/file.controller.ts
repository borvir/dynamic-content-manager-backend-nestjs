import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Post,
  Query,
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
  ApiQuery,
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

  @Get('/getOwnFiles')
  @ApiQuery({
    name: 'withDeleted',
    description: '',
    type: Boolean,
    isArray: false,
    required: false,
    example: false,
  })
  @ApiOkResponse({
    description: '',
    // type: TagDto,
    isArray: true,
  })
  async getOwnItems(
    @CurrentUser()
    user: { userId: string; email: string },

    @Query(
      'withDeleted',
      new DefaultValuePipe<string, string>('false'),
      ParseBoolPipe,
    )
    includeDeleted: boolean,
  ): Promise<FileDto[]> {
    const items = await this.service.getOwnItems(includeDeleted, user.userId);
    return items;
  }

  @Post('upload')
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
          description: 'Array of files to upload',
        },
        'tagIds[]': {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of tag IDs (strings)',
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
    @Body() body: Record<string, any>,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    const tagIds = Array.isArray(body['tagIds[]'])
      ? body['tagIds[]']
      : [body['tagIds[]']];
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
