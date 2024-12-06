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
import { ViewService } from './view.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ViewCreateDto } from './dto/view-create.dto';
import { ViewEditDto } from './dto/view-edit.dto';
import { ViewDto } from './dto/view.dto';
import { Response } from 'express';
import { CurrentUser } from 'src/core/user/current-user.decorator';
import { JwtAuthGuard } from 'src/core/auth/auth/auth.guard';

@Controller('view')
@ApiTags('view')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ViewController {
  constructor(private readonly service: ViewService) {}

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
    type: ViewDto,
    isArray: true,
  })
  async getItems(
    @Query(
      'withDeleted',
      new DefaultValuePipe<string, string>('false'),
      ParseBoolPipe,
    )
    includeDeleted: boolean,
  ): Promise<ViewDto[]> {
    const items = await this.service.getItems(includeDeleted);
    return items;
  }

  @Get('/getOwnView')
  @ApiQuery({
    name: 'withDeleted',
    description: '',
    type: Boolean,
    isArray: false,
    required: false,
    example: false,
  })
  @ApiQuery({
    name: 'filter',
    type: 'string',
    required: false,
    description: 'Search term for view names',
  })
  @ApiOkResponse({
    description: '',
    type: ViewDto,
    isArray: true,
  })
  async getOwnItems(
    @Query(
      'withDeleted',
      new DefaultValuePipe<string, string>('false'),
      ParseBoolPipe,
    )
    includeDeleted: boolean,
    @CurrentUser()
    user: { userId: string; email: string },
    @Query('filter') filter: string,
  ): Promise<ViewDto[]> {
    const items = await this.service.getOwnItems(
      includeDeleted,
      user.userId,
      filter,
    );
    return items;
  }

  @Get('/:id')
  @ApiParam({ name: 'id', required: true, description: '', example: '1' })
  @ApiOkResponse({
    description: '',
    type: ViewDto,
    isArray: false,
  })
  @ApiResponse({ status: 404, description: '' })
  async getFile(@Param('id') id: string): Promise<ViewDto> {
    try {
      return await this.service.getItem(id);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_FOUND);
    }
  }

  @Post('/')
  @ApiBody({
    type: ViewCreateDto,
    required: true,
    description: '',
  })
  @ApiOkResponse({
    description: 'Created successfully',
    type: ViewDto,
    isArray: false,
  })
  async create(
    @Body() body: ViewCreateDto,
    @CurrentUser() user: { userId: string; email: string },
  ): Promise<ViewDto> {
    const dto = await this.service.createItem(body, user.userId);
    return dto;
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', required: true, description: '', example: '1' })
  @ApiBody({
    type: ViewEditDto,
    required: true,
    description: '',
  })
  @ApiOkResponse({
    description: 'Updated successful',
    type: ViewDto,
    isArray: false,
  })
  async update(
    @Body() body: ViewEditDto,
    @Param('id') idToUpdate: string,
    @CurrentUser() user: { userId: string; email: string },
  ): Promise<ViewDto> {
    const dto = await this.service.updateItem(body, idToUpdate, user.userId);
    return dto;
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Die ID des View der gelöscht werden soll.',
    example: '1',
  })
  @ApiOkResponse({ description: 'Der View wurde erfolgreich entfernt.' })
  @ApiResponse({
    status: 404,
    description: 'Der zu löschende View wurde nicht gefunden.',
  })
  @ApiResponse({
    status: 226,
    description:
      'Der zu löschende View ist noch in Benutzung und wurde inaktiv gesetzt.',
  })
  async delete(@Param('id') idToDelete: string, @Res() res: Response) {
    const code = await this.service.tryDeleteOrSetInactive(idToDelete);
    res.status(code).send(true);
  }
}
