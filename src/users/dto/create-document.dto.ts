import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do documento é obrigatório' })
  name: string;

  @IsUrl({}, { message: 'A URL do arquivo deve ser válida' })
  @IsNotEmpty({ message: 'A URL do arquivo é obrigatória' })
  fileUrl: string;
}
