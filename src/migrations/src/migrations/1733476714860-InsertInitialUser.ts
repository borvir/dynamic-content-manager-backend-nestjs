import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InsertInitialUser1733476714860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await bcrypt.hash('adminPassword', 10);

    const userExists = await queryRunner.query(
      `SELECT * FROM public."user" WHERE email = 'admin@example.com'`,
    );

    if (userExists.length === 0) {
      await queryRunner.query(`
      INSERT INTO "user" (id, username, email, password, role, "createdAt", "changedAt", "isConfirmed")
      VALUES (
        'c68b73e6-8f3b-4a3e-8a6c-fec26c7a6b73',
        'admin',
        'admin@example.com',
        '${password}',
        'Owner',
        NOW(),
        NOW(),
        true
      )
          `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM user WHERE username = 'admin'
        `);
  }
}
