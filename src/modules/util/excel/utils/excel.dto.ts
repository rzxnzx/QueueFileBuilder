import { IsString, IsDateString, IsOptional } from "class-validator";

export class PayloadDTO {

    @IsString()
    empresa: string;
    
    @IsOptional()
    @IsString()
    payload?: string;

    @IsString()
    usuario: string;
    
    @IsOptional()
    @IsString()
    tipo?: string; 
    
    @IsOptional()
    @IsString()
    raw_query?: string; 

    @IsDateString()
    created_At?: string;

    @IsOptional()
    @IsDateString()
    deleted_At?: string; 
}
