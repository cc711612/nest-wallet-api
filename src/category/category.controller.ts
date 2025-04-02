import { Controller, Get, Post, Put, Delete, Body, Param, Query, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './entities/category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

//   @Post()
//   @ApiOperation({ summary: 'Create a new category' })
//   @ApiResponse({ status: 201, description: 'Category created successfully', type: Category })
//   @ApiResponse({ status: 400, description: 'Invalid input data' })
//   create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
//     return this.categoryService.create(createCategoryDto);
//   }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'List of all categories', type: [Category] })
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

//   @Get(':id')
//   @ApiOperation({ summary: 'Get a category by ID' })
//   @ApiResponse({ status: 200, description: 'Category details', type: Category })
//   @ApiResponse({ status: 404, description: 'Category not found' })
//   findOne(@Param('id') id: string): Promise<Category> {
//     return this.categoryService.findOne(Number(id));
//   }

//   @Put(':id')
//   @ApiOperation({ summary: 'Update a category by ID' })
//   @ApiResponse({ status: 200, description: 'Category updated successfully', type: Category })
//   @ApiResponse({ status: 404, description: 'Category not found' })
//   @ApiResponse({ status: 400, description: 'Invalid input data' })
//   update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
//     return this.categoryService.update(Number(id), updateCategoryDto);
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Soft delete a category by ID' })
//   @ApiResponse({ status: 200, description: 'Category deleted successfully' })
//   @ApiResponse({ status: 404, description: 'Category not found' })
//   remove(@Param('id') id: string): Promise<void> {
//     return this.categoryService.softDelete(Number(id));
//   }

//   @Patch(':id/restore')
//   @ApiOperation({ summary: 'Restore a deleted category' })
//   @ApiResponse({ status: 200, description: 'Category restored successfully', type: Category })
//   @ApiResponse({ status: 404, description: 'Category not found' })
//   restore(@Param('id') id: string): Promise<Category> {
//     return this.categoryService.restore(Number(id));
//   }
}