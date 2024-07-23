import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { randomInt } from 'crypto';

import * as bcrypt from 'bcrypt';

import { User } from '../../common/entities/user.entity';
import { Role } from '../../common/entities/role.entity';
import { UserSession } from '../../common/entities/user-session.entity';
import { DeviceToken } from '../../common/entities/device-token.entity';

import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

import { JwtService } from '@nestjs/jwt';
import { Cache } from '@nestjs/cache-manager';

import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { CreateAdminAuthDto } from './dto/create-admin-auth.dto';
import { create } from 'domain';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSession)
    private readonly userSessionRepository: Repository<UserSession>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly cacheService: Cache,
    private readonly configService: ConfigService,
    @InjectRepository(DeviceToken)
    private readonly deviceTokenRepository: Repository<DeviceToken>,
  ) {}

  async findUserByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'r')
      .where('u.email = :email', { email })
      .limit(1)
      .getOne();
  }

  async loginAdmin(createAdminAuthDto: CreateAdminAuthDto): Promise<{status: string, message: string, accessToken?: string}> {
    const {email, password} = createAdminAuthDto;
    const user = await this.findUserByEmail(email);

    if (!user || user.role_id !== 2) {
      throw new UnauthorizedException('Unauthorized Access: Admin credentials required');
    }

    const isPassWordValid = await bcrypt.compare(password, user.password);
    console.log('Password provided:', password);
    console.log('Hashed password in DB:', user.password);
    console.log('Password comparison result:', isPassWordValid);

    if (!isPassWordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }
    const accessToken = this.generateAccessToken(user);
    await this.saveUserSession(user, accessToken);
    return { status: 'success', message: 'Login successful', accessToken };

  }

  async sendOtp(
    createAuthDto: CreateAuthDto,
  ): Promise<{ status: string; message: string }> {
    const { phone } = createAuthDto;
    this.validatePhone(phone);

    const user = await this.userRepository.findOne({ where: { phone } });
    this.validateUserExistence(user);

    const otp = this.generateOtp();
    await this.cacheService.set(phone, otp, 30);

    return { status: 'success', message: `OTP: ${otp}` };
  }

  async verifyOtp(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ status: string; message: string; accessToken?: string }> {
    const { phone, otp } = verifyOtpDto;
    this.validatePhone(phone);
    this.validateOtp(otp);

    const user = await this.userRepository.findOne({
      where: { phone },
      relations: ['role'],
    });
    this.validateUserExistence(user);

    const storedOtp = await this.cacheService.get<string>(phone);
    this.validateOtpMatch(storedOtp, otp);

    await this.cacheService.del(phone);

    const accessToken = this.generateAccessToken(user);
    await this.saveUserSession(user, accessToken);

    return { status: 'success', message: 'Mã OTP hợp lệ', accessToken };
  }

  async getProfile(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['students'],
    });
    this.validateUserExistence(user);
    return user;
  }

  async saveDeviceToken(
    userId: number,
    token: string,
    deviceType: string,
  ): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    this.validateUserExistence(user);

    const deviceToken = new DeviceToken();
    deviceToken.token = token;
    deviceToken.device_type = deviceType;
    deviceToken.user_id = userId;

    await this.deviceTokenRepository.save(deviceToken);

    return 'Device token được lưu thành công';
  }

  public decodeToken(token: string): { userId: number } | null {
    try {
      return this.jwtService.decode(token) as { userId: number };
    } catch (error) {
      return null;
    }
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: payload.userId },
    });
    this.validateUserExistence(user);
    return user;
  }

  async findRoleNameById(id: number): Promise<string | null> {
    const role = await this.roleRepository.findOne({ where: { id } });
    return role ? role.name : null;
  }

  private validatePhone(phone: string): void {
    if (!phone) {
      throw new BadRequestException('Số điện thoại là bắt buộc');
    }
  }

  private validateUserExistence(user: User): void {
    if (!user) {
      throw new BadRequestException(
        'Số điện thoại không hợp lệ hoặc người dùng không tồn tại',
      );
    }
  }

  private generateOtp(): string {
    return randomInt(100000, 999999).toString();
  }

  private validateOtp(otp: string): void {
    if (!otp) {
      throw new BadRequestException('Mã OTP là bắt buộc');
    }
  }

  private validateOtpMatch(storedOtp: string, otp: string): void {
    if (storedOtp !== otp) {
      throw new BadRequestException('Mã OTP không hợp lệ');
    }
  }

  private generateAccessToken(user: User): string {
    const accessTokenPayload: JwtPayload = {
      userId: user.id,
      roleId: user.role.id,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() +
          parseInt(this.configService.get<string>('JWT_EXPIRATION_TIME')) *
            1000,
      ).toISOString(),
    };
    return this.jwtService.sign(accessTokenPayload);
  }

  private async saveUserSession(
    user: User,
    accessToken: string,
  ): Promise<void> {
    const userSession = new UserSession();
    userSession.access_token = accessToken;
    userSession.user = user;
    userSession.access_token_expiration_time = new Date(
      Date.now() +
        parseInt(this.configService.get<string>('JWT_EXPIRATION_TIME')) * 1000,
    );
    await this.userSessionRepository.save(userSession);
  }

  public extractUserIdFromToken(authHeader: string): number {
    const accessToken = authHeader?.split(' ')[1];
    const decodedToken = this.jwtService.decode(accessToken) as {
      userId: number;
    };
    return decodedToken?.userId;
  }

  private validateUserId(userId: number): void {
    if (!userId) {
      throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
