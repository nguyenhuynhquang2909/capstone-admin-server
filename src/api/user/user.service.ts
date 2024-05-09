import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../common/entities/user.entity';
import { Role } from '../../common/entities/role.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { role_id, ...userData } = createUserDto;

    const role = await this.roleRepository.findOne({
      where: { id: role_id },
    });
    if (!role) {
      throw new NotFoundException(`Không tìm thấy vai trò với ID ${role_id}`);
    }

    // Check if the user with the provided phone number or email already exists
    if (userData.phone) {
      const existingUser = await this.userRepository.findOne({
        where: { phone: userData.phone },
      });
      if (existingUser) {
        throw new BadRequestException(
          'Người dùng với số điện thoại này đã tồn tại',
        );
      }
    }
    if (userData.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });
      if (existingUser) {
        throw new BadRequestException('Người dùng với email này đã tồn tại');
      }
    }

    // Create a new user
    const user = plainToClass(User, userData);
    user.role = role;
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .select(['user', 'role.name'])
      .getMany();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID ${id}`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const updatedUser = plainToClass(User, updateUserDto);

    // If role_id is updated, fetch the new role object and assign it to user.role
    if (updatedUser.role_id !== user.role.id) {
      const newRole = await this.roleRepository.findOne({
        where: { id: updatedUser.role_id },
      });
      if (!newRole) {
        throw new NotFoundException(
          `Không tìm thấy vai trò với mã số ${updatedUser.role_id}`,
        );
      }
      user.role = newRole;
    }

    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
