/* istanbul ignore file */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class TypeOrmOptionsFactory {
  static createTypeOrmOptions(name: string = undefined): TypeOrmModuleOptions {
    const port = process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT)
      : 5432;
    let ssl: boolean | { ca: string } = process.env.DATABASE_SSL ? true : false;
    ssl = process.env.SSL_CERT ? { ca: process.env.SSL_CERT } : ssl;
    const typeORMOptions: TypeOrmModuleOptions = {
      name: name,
      type: 'postgres',
      cache: true,
      replication: {
        master: {
          host: process.env.DATABASE_HOST || 'localhost',
          port: port,
          database: process.env.DATABASE_DB || 'dynamicorganizer',
          username: process.env.DATABASE_USER || 'dynamicorganizer',
          password: process.env.DATABASE_PASSWORD || 'dynamicorganizer',
          ssl: ssl,
        },
        slaves: [
          {
            host:
              process.env.DATABASE_HOST_READONLY ||
              process.env.DATABASE_HOST ||
              'localhost',
            port: port,
            database: process.env.DATABASE_DB || 'dynamicorganizer',
            username: process.env.DATABASE_USER || 'dynamicorganizer',
            password: process.env.DATABASE_PASSWORD || 'dynamicorganizer',
            ssl: ssl,
          },
        ],
      },
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: process.env.DATABASE_ORM_SYNC === 'true' || true,
      // disable sync -> sync entities only via pumpgun
      // synchronize: false,
      migrations: [
        process.env.DATABASE_MIGRATIONS_PATH || 'dist/migrations/*{.ts,.js}',
      ],
      migrationsTableName: 'migrations_typeorm',
      migrationsRun: process.env.DATABASE_ORM_MIGRATION === 'true' || true,
      logging:
        process.env.DATABASE_LOGGING === 'true' ? ['query', 'error'] : false,
    };
    return typeORMOptions;
  }
}
