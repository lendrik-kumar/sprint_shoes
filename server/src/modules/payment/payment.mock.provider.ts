import { IPaymentProvider, PaymentIntent } from './payment.provider.interface';
import { PaymentScenario } from '@types';

export class MockPaymentProvider implements IPaymentProvider {
  private simulateDelay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async createIntent(amount: number, currency = 'INR', metadata?: any): Promise<PaymentIntent> {
    const scenario = metadata?.scenario || PaymentScenario.SUCCESS;
    return {
      id: `pi_mock_${Date.now()}`,
      amount,
      currency,
      status: 'requires_payment_method',
      clientSecret: `secret_${scenario}_mock_${Date.now()}`
    };
  }

  async confirmPayment(intentId: string): Promise<boolean> {
    if (intentId.includes(PaymentScenario.FAILURE)) return false;
    if (intentId.includes(PaymentScenario.TIMEOUT)) {
      await this.simulateDelay(5000);
      throw new Error('Payment timeout');
    }
    return true; // SUCCESS or default
  }

  async processWebhook(payload: any, signature: string): Promise<any> {
    // Mock webhook payload verification
    return { valid: true, event: payload.type || 'payment_intent.succeeded' };
  }

  async getStatus(intentId: string): Promise<string> {
    if (intentId.includes(PaymentScenario.FAILURE)) return 'failed';
    return 'succeeded';
  }
}
