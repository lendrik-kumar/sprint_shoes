import { IPaymentProvider } from './payment.provider.interface';
import { MockPaymentProvider } from './payment.mock.provider';

export class PaymentService {
  private provider: IPaymentProvider;

  constructor() {
    this.provider = new MockPaymentProvider();
  }

  async createIntent(amount: number, currency: string, scenario?: string) {
    return this.provider.createIntent(amount, currency, { scenario });
  }

  async confirmPayment(intentId: string) {
    // Scaffold: update DB status
    return this.provider.confirmPayment(intentId);
  }

  async processWebhook(payload: any, signature: string) {
    return this.provider.processWebhook(payload, signature);
  }

  async getStatus(intentId: string) {
    return this.provider.getStatus(intentId);
  }
}

export const paymentService = new PaymentService();
