import { z } from 'zod';

const processPaymentSchema = z.object({
  appointmentId: z.string().length(24, 'Invalid appointment ID'),
  amount: z.number().min(0.01, 'Amount must be positive'),
  transactionId: z.string().min(4, 'Transaction ID is required'),
  method: z.enum(['esewa', 'khalti', 'stripe', 'cash']).optional(), // Optional, can add more methods
});

export default { processPaymentSchema };
