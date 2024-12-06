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
  ApiConsumes,
  ApiOkResponse,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/auth/auth/auth.guard';
import { FileDto } from './dto/file.dto';
import { CurrentUser } from 'src/core/user/current-user.decorator';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';

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
    type: FileDto,
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
  @ApiBody({
    description: 'File upload data',
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
        'tagIds[]': {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of tag IDs associated with the files',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: Record<string, any>,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    const tagIds = body.tagIds[0].split(',');

    const fileDtos: FileDto[] = [];

    for (const file of files) {
      const fileContent = await fs.readFile(file.path);

      const hash = crypto
        .createHash('sha256')
        .update(fileContent)
        .digest('hex');

      const existingFile = await this.service.findFileByHash(hash);
      if (existingFile) {
        throw new Error(
          `Duplicate file detected. File with hash ${hash} already exists.`,
        );
      }

      const fileDto = await this.service.createItem(
        {
          file,
          tagIds,
          hash,
        },
        user.userId,
      );

      fileDtos.push(fileDto);
    }

    return fileDtos;
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Delete tags',
    example: '1',
  })
  @ApiOkResponse({ description: 'Tag deleted' })
  @ApiResponse({
    status: 404,
    description: 'Tag not found.',
  })
  async delete(@Param('id') id: string) {
    const code = await this.service.delete(id);
    return code;
  }
}
