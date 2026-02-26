import { Request, Response } from 'express';
import { orderService } from './order.service';
import { success, created } from '@utils/response';

export class OrderController {
  public checkout = async (req: Request, res: Response) => {
    const { addressId, paymentIntentId } = req.body;
    const order = await orderService.checkout(req.userId!, addressId, paymentIntentId);
    res.status(201).json(created(order, 'Order placed successfully'));
  };

  public getOrders = async (req: Request, res: Response) => {
    const result = await orderService.getOrders(req.userId!, req.query);
    res.json(success(result));
  };

  public getOrderById = async (req: Request, res: Response) => {
    const order = await orderService.getOrderById(req.userId!, req.params.id);
    res.json(success(order));
  };

  public cancelOrder = async (req: Request, res: Response) => {
    const order = await orderService.cancelOrder(req.userId!, req.params.id, req.body.reason);
    res.json(success(order, 'Order cancelled successfully'));
  };

  public returnOrder = async (req: Request, res: Response) => {
    const order = await orderService.returnOrder(req.userId!, req.params.id, req.body.reason);
    res.json(success(order, 'Return requested successfully'));
  };
}

export const orderController = new OrderController();
