import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class LinkEmployeesDto {
  @IsArray()
  @IsNotEmpty({ message: 'A lista de employeeIds não pode estar vazia.' })
  @IsUUID('all', { each: true, message: 'Cada employeeId deve ser um UUID válido.' })
  employeeIds: string[];
}
