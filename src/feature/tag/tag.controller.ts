import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  HttpException,
  HttpStatus,
  ParseBoolPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TagCreateDto } from './dto/tag-create.dto';
import { TagEditDto } from './dto/tag-edit.dto';
import { TagDto } from './dto/tag.dto';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/core/auth/auth/auth.guard';
import { CurrentUser } from 'src/core/user/current-user.decorator';

@Controller('tag')
@ApiTags('tag')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private readonly service: TagService) {}

  @Get('/')
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
    type: TagDto,
    isArray: true,
  })
  async getItems(
    @Query(
      'withDeleted',
      new DefaultValuePipe<string, string>('false'),
      ParseBoolPipe,
    )
    includeDeleted: boolean,
  ): Promise<TagDto[]> {
    const items = await this.service.getItems(includeDeleted);
    return items;
  }

  @Get('/getOwnTags')
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
    type: TagDto,
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
  ): Promise<TagDto[]> {
    const items = await this.service.getOwnItems(includeDeleted, user.userId);
    return items;
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true, description: '', example: '1' })
  @ApiOkResponse({
    description: '',
    type: TagDto,
    isArray: false,
  })
  @ApiResponse({ status: 404, description: '' })
  async getFile(@Param('id') id: string): Promise<TagDto> {
    try {
      return await this.service.getItem(id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('/')
  @ApiBody({
    type: TagCreateDto,
    required: true,
    description: '',
  })
  @ApiOkResponse({
    description: 'Created successfully',
    type: TagDto,
    isArray: false,
  })
  async create(
    @Body() body: TagCreateDto,
    @CurrentUser() user: { userId: string; email: string },
  ): Promise<TagDto> {
    const dto = await this.service.createItem(body, user.userId);
    return dto;
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', required: true, description: '', example: '1' })
  @ApiBody({
    type: TagEditDto,
    required: true,
    description: '',
  })
  @ApiOkResponse({
    description: 'Updated successful',
    type: TagDto,
    isArray: false,
  })
  async update(
    @Body() body: TagEditDto,
    @Param('id') idToUpdate: string,
    @CurrentUser() user: { userId: string; email: string },
  ): Promise<TagDto> {
    const dto = await this.service.updateItem(body, idToUpdate, user.userId);
    return dto;
  }

  @Delete('/:id')
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
  async delete(@Param('id') idToDelete: string, @Res() res: Response) {
    const code = await this.service.tryDeleteOrSetInactive(idToDelete);
    res.status(code).send(true);
  }
}
