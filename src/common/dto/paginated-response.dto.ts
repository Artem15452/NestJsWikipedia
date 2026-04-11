import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({ description: 'Масив даних' })
  data: T[];

  @ApiProperty({ example: 1, description: 'Поточна сторінка' })
  page: number;

  @ApiProperty({ example: 20, description: 'Кількість записів на сторінку' })
  limit: number;

  @ApiProperty({ example: 100, description: 'Загальна кількість записів' })
  total: number;

  @ApiProperty({ example: 5, description: 'Загальна кількість сторінок' })
  pages: number;

  @ApiProperty({ example: true, description: 'Чи існує наступна сторінка' })
  hasNextPage: boolean;

  @ApiProperty({ example: true, description: 'Чи існує попередня сторінка' })
  hasPrevPage: boolean;

  constructor(data: T[], page: number, limit: number, total: number) {
    this.data = data;
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.pages = Math.ceil(total / limit);
    this.hasNextPage = page < this.pages;
    this.hasPrevPage = page > 1;
  }
}
