import { Module } from '@nestjs/common'
import { JwtEcrypter } from './jwt-encrypter'
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { BcryptHasher } from './bcrypt-hasher'
import { HasherGenerator } from '@/domain/forum/application/cryptography/hasher-generator'
import { HasherCompare } from '@/domain/forum/application/cryptography/hasher-comparer'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEcrypter,
    },
    { provide: HasherCompare, useClass: BcryptHasher },
    { provide: HasherGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HasherCompare, HasherGenerator],
})
export class CryptographyModule { }
