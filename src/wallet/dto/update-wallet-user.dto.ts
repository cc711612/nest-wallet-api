import { PartialType } from '@nestjs/swagger';
import { CreateWalletUserDto } from './create-wallet-user.dto';

export class UpdateWalletUserDto extends PartialType(CreateWalletUserDto) {} 