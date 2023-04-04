import { IsNotEmpty } from "class-validator";

export class CategoryDto{

    id: number;

    @IsNotEmpty()
    category_name: string;

    category: number;
}    