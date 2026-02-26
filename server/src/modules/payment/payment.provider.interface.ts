export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

export interface IPaymentProvider {
  createIntent(amount: number, currency: string, metadata?: any): Promise<PaymentIntent>;
  confirmPayment(intentId: string): Promise<boolean>;
  processWebhook(payload: any, signature: string): Promise<any>;
  getStatus(intentId: string): Promise<string>;
}
