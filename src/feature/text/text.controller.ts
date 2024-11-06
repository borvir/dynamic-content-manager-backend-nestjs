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
import { TextService } from './text.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TextCreateDto } from './dto/text-create.dto';
import { TextEditDto } from './dto/text-edit.dto';
import { TextDto } from './dto/text.dto';
import { Response } from 'express';
import { CurrentUser } from 'src/core/user/current-user.decorator';
import { JwtAuthGuard } from 'src/core/auth/auth/auth.guard';

@Controller('text')
@ApiTags('text')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TextController {
  constructor(private readonly service: TextService) {}

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
    type: TextDto,
    isArray: true,
  })
  async getItems(
    @Query(
      'withDeleted',
      new DefaultValuePipe<string, string>('false'),
      ParseBoolPipe,
    )
    includeDeleted: boolean,
  ): Promise<TextDto[]> {
    const items = await this.service.getItems(includeDeleted);
    return items;
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true, description: '', example: '1' })
  @ApiOkResponse({
    description: '',
    type: TextDto,
    isArray: false,
  })
  @ApiResponse({ status: 404, description: '' })
  async getFile(@Param('id') id: string): Promise<TextDto> {
    try {
      return await this.service.getItem(id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('/')
  @ApiBody({
    type: TextCreateDto,
    required: true,
    description: '',
  })
  @ApiOkResponse({
    description: 'Created successfully',
    type: TextDto,
    isArray: false,
  })
  async create(
    @Body() body: TextCreateDto,
    @CurrentUser() user: { userId: string; email: string },
  ): Promise<TextDto> {
    const dto = await this.service.createItem(body, user.userId);
    return dto;
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', required: true, description: '', example: '1' })
  @ApiBody({
    type: TextEditDto,
    required: true,
    description: '',
  })
  @ApiOkResponse({
    description: 'Updated successful',
    type: TextDto,
    isArray: false,
  })
  async update(
    @Body() body: TextEditDto,
    @Param('id') idToUpdate: string,
    @CurrentUser() user: { userId: string; email: string },
  ): Promise<TextDto> {
    const dto = await this.service.updateItem(body, idToUpdate, user.userId);
    return dto;
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Die ID des Text der gelöscht werden soll.',
    example: '1',
  })
  @ApiOkResponse({ description: 'Der Text wurde erfolgreich entfernt.' })
  @ApiResponse({
    status: 404,
    description: 'Der zu löschende Text wurde nicht gefunden.',
  })
  @ApiResponse({
    status: 226,
    description:
      'Der zu löschende Text ist noch in Benutzung und wurde inaktiv gesetzt.',
  })
  async delete(@Param('id') idToDelete: string, @Res() res: Response) {
    const code = await this.service.tryDeleteOrSetInactive(idToDelete);
    res.status(code).send(true);
  }
}
