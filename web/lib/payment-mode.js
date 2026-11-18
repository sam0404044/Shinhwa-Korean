export function isTestCheckout() {
  return process.env.PAYMENT_PROVIDER === 'mock' && process.env.ALLOW_MOCK_PAYMENTS === 'true';
}
