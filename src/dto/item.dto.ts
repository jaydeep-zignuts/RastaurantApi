import { IsNotEmpty } from "class-validator";

export class ItemDto{

    id: number;

    @IsNotEmpty()
    item_name: string;
   
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    image: string;

    @IsNotEmpty()
    displayOrder: number;

    category_id:number

}