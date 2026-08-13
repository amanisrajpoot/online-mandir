import { config } from 'dotenv'
config({ path: '.env.local' })

import { cashfree } from "./src/lib/cashfree";

async function checkCashfree() {
  try {
    const order = await cashfree.PGFetchOrder("order_a6639c43d7904ec1bd9f6cd9e85501fb");
    console.log(order.data.customer_details);
  } catch (error: any) {
    console.error(error.message);
  }
}

checkCashfree()
