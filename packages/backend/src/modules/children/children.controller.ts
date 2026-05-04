import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { CreateChildDto } from './dto/create-child.dto';

@Controller('children')
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Get()
  list() {
    return this.childrenService.list();
  }

  @Post()
  create(@Body() dto: CreateChildDto) {
    return this.childrenService.create(dto);
  }
}
