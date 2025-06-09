import { ApiProperty } from "@nestjs/swagger";

export class Order {
  id: number;
  order: number;
}

export class UpdateOrder {
  @ApiProperty({
    type: [Order],
    description: "업데이트할 staff의 id와 해당 staff의 순서 목록",
    example: {
      국제교류1팀: [
        { id: 1, order: 1 },
        { id: 2, order: 2 },
        { id: 3, order: 3 },
      ],
    },
  })
  "국제교류1팀": Order[];
}
