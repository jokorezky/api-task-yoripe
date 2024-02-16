import { from } from 'env-var';
import { config } from 'dotenv';

config();

export class ConfigService {
  private readonly env = from(process.env);
  
  // JWT
  public readonly JWT_SECRET = this.env.get('JWT_SECRET').required().asString();
  public readonly JWT_EXPIRED = this.env
    .get('JWT_EXPIRED')
    .required()
    .asString();
  public readonly HASH_SECRET = this.env
    .get('HASH_SECRET')
    .required()
    .asString();
}
