import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample transaction data
const transactionData = [
  {
    type: 'stake',
    token: 'ETH',
    amount: 1.5,
    status: 'Pending',
    description: 'Stake 1.5 ETH',
    userId: '1',
  },
  {
    type: 'borrow',
    token: 'USDT',
    amount: 1000,
    status: 'Pending',
    description: 'Borrow 1000 USDT',
    userId: '2',
  },
  {
    type: 'lend',
    token: 'BTC',
    amount: 0.1,
    status: 'Pending',
    description: 'Lend 0.1 BTC',
    userId: '1',
  },
  {
    type: 'stake',
    token: 'SOL',
    amount: 50,
    status: 'Pending',
    description: 'Stake 50 SOL',
    userId: '2',
  },
  {
    type: 'borrow',
    token: 'ETH',
    amount: 2.0,
    status: 'Pending',
    description: 'Borrow 2.0 ETH',
    userId: '1',
  }
]

const userData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@doe.com',
    password: 'password',
    role: 'Admin',
    balance: 1000,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@smith.com',
    password: 'password',
    role: 'User',
    balance: 1000,
  }
]
export async function main() {
  console.log('Start seeding...')
  
  try {
    // Create users in parallel using Promise.all
    const userPromises = userData.map(user => 
      prisma.users.create({
        data: user
      })
    );
    
    // Wait for all users to be created
    const createdUsers = await Promise.all(userPromises);
    console.log(`Created ${createdUsers.length} users`);

    // Create transactions in batches of 100
    const batchSize = 100;
    for (let i = 0; i < transactionData.length; i += batchSize) {
      const batch = transactionData.slice(i, i + batchSize);
      const transactionPromises = batch.map(transaction =>
        prisma.transactions.create({
          data: transaction
        })
      );
      
      // Wait for current batch to complete
      const createdTransactions = await Promise.all(transactionPromises);
      console.log(`Created ${createdTransactions.length} transactions in batch`);
    }

    console.log('Seeding finished successfully.')
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error; // Re-throw to be caught by the outer catch block
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })