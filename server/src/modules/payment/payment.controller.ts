import { Request, Response } from 'express';
import { paymentService } from './payment.service';
import { success, ok } from '@utils/response';

export class PaymentController {
  public createIntent = async (req: Request, res: Response) => {
    const { amount, currency } = req.body;
    const scenario = req.headers['x-mock-payment-scenario'] as string;
    const intent = await paymentService.createIntent(amount, currency, scenario);
    res.json(success(intent));
  };

  public confirmPayment = async (req: Request, res: Response) => {
    const { intentId } = req.body;
    const isConfirmed = await paymentService.confirmPayment(intentId);
    res.json(success({ confirmed: isConfirmed }, isConfirmed ? 'Payment confirmed' : 'Payment failed'));
  };

  public processWebhook = async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    const result = await paymentService.processWebhook(req.body, signature || 'mock_sig');
    res.json(ok('Webhook processed'));
  };

  public getStatus = async (req: Request, res: Response) => {
    const status = await paymentService.getStatus(req.params.id);
    res.json(success({ status }));
  };
}

export const paymentController = new PaymentController();
