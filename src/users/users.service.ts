import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  private readonly jwtSecret: string;
  private readonly jwtExpiration: string;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    this.jwtSecret = this.configService.get<string>("JWT_SECRET");
    this.jwtExpiration = this.configService.get<string>("JWT_EXPIRATION", "1h");
  }

  async create(userData: CreateUserDto): Promise<User> {
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }
    return this.usersRepository.create(userData);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = this.configService.get<number>("BCRYPT_SALT_ROUNDS", 10);
    try {
      const hashedPassword = await bcrypt.hash(password, Number(saltRounds));
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      throw new UnauthorizedException("Password hashing failed.");
    }
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    if (userData.password) {
      userData.password = await this.hashPassword(userData.password);
    }
    await this.usersRepository.update(id, userData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const userExists = await this.usersRepository.findOne(id);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.usersRepository.remove(id);
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException("Invalid email or password");
  }

  generateToken(user: User): string {
    const payload = { id: user.id, email: user.email };
    return this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: this.jwtExpiration,
    });
  }

  private async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }
}
