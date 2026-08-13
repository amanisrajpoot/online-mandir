import { sendEmail } from './src/lib/notifications';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function test() {
  const result = await sendEmail({
    to: 'test@example.com', // Using a dummy email
    subject: 'Test Email',
    html: '<p>Test</p>'
  });
  console.log('Result:', result);
}
test();
