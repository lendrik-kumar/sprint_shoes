import { Request, Response } from 'express';
import { cartService } from './cart.service';
import { success, ok } from '@utils/response';

export class CartController {
  public getCart = async (req: Request, res: Response) => {
    const cart = await cartService.getCart(req.email!);
    res.json(success(cart));
  };

  public addItem = async (req: Request, res: Response) => {
    const { productId, sizeId, quantity } = req.body;
    const cart = await cartService.addItem(req.email!, productId, sizeId, quantity);
    res.json(success(cart, 'Item added to cart'));
  };

  public updateItem = async (req: Request, res: Response) => {
    const { quantity } = req.body;
    const cart = await cartService.updateItem(req.email!, req.params.id, quantity);
    res.json(success(cart, 'Cart updated'));
  };

  public removeItem = async (req: Request, res: Response) => {
    await cartService.removeItem(req.email!, req.params.id);
    res.json(ok('Item removed from cart'));
  };

  public clearCart = async (req: Request, res: Response) => {
    await cartService.clearCart(req.email!);
    res.json(ok('Cart cleared'));
  };
}

export const cartController = new CartController();
