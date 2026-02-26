import { prisma } from '@config/database';
import { NotFoundError } from '@utils/errors';

export class UserService {
  async getProfile(userId: string) {
    const profile = await prisma.userProfile.findUnique({
      where: { email: (await this.getUserEmail(userId)) },
      include: { addresses: true }
    });
    
    if (!profile) throw new NotFoundError('User Profile');
    return profile;
  }

  async updateProfile(userId: string, data: Partial<any>) {
    // Scaffold
    return { id: userId, ...data };
  }

  async deleteAccount(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false }
    });
  }

  async getAddresses(userId: string) {
    // Scaffold
    return [];
  }

  async addAddress(userId: string, data: any) {
    // Scaffold
    return { id: 'addr_123', ...data };
  }

  async updateAddress(userId: string, addressId: string, data: any) {
    // Scaffold
    return { id: addressId, ...data };
  }

  async deleteAddress(userId: string, addressId: string) {
    // Scaffold
    return true;
  }
  
  private async getUserEmail(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { id: userId }});
    if (!user) throw new NotFoundError('User');
    return user.email;
  }
}

export const userService = new UserService();
