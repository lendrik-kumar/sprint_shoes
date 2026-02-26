import { prisma } from '@config/database';
import { NotFoundError } from '@utils/errors';

export class CartService {
  async getCart(userEmail: string) {
    let cart = await prisma.cart.findUnique({
      where: { userEmail },
      include: { items: { include: { product: true, size: true } } }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userEmail },
        include: { items: { include: { product: true, size: true } } }
      });
    }

    return cart;
  }

  async addItem(userEmail: string, productId: string, sizeId: string, quantity: number) {
    const cart = await this.getCart(userEmail);
    // Scaffold: check stock, add item or update quantity
    return { ...cart, items: [{ productId, sizeId, quantity }] };
  }

  async updateItem(userEmail: string, itemId: string, quantity: number) {
    // Scaffold: check stock, update quantity
    return { id: 'cart_123', items: [{ id: itemId, quantity }] };
  }

  async removeItem(userEmail: string, itemId: string) {
    // Scaffold
    return true;
  }

  async clearCart(userEmail: string) {
    // Scaffold
    return true;
  }
}

export const cartService = new CartService();
