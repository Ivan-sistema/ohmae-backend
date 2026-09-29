import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

// 🎯 Tipos de usuários oficiais mapeados do ecossistema Ohmae
export const TIPOS_USUARIO = ['PAI_MAE', 'CUIDADOR'] as const;
export type TipoUsuario = (typeof TIPOS_USUARIO)[number];

export class CriarUsuarioDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(120, { message: 'O nome pode ter no máximo 120 caracteres.' })
  nome: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha precisa ter no mínimo 8 caracteres.' })
  senha: string;

  @IsIn(TIPOS_USUARIO, {
    message: `O tipo deve ser estritamente um destes: ${TIPOS_USUARIO.join(', ')}.`,
  })
  tipo: TipoUsuario;
}
