




//#region [rgba(2, 196, 15, 0.2)]
//TODO                                           This file is for Stripe payment
//TODO          это Server Actions функции как GET, POST, PUT, DELETE endpoints получают request от client браузера и бизнес логика 
//#endregion



"use server";


import { redirect } from 'next/navigation'
import { handleError } from '../utils';
import { connectToDatabase } from '../database/mongoose';
import Transaction from '../database/models/transaction.model';
import { updateCredits } from './user.actions';


import Stripe from "stripe";




// эта функция для обработки платежа
export async function checkoutCredits(transaction: CheckoutTransactionParams) {// CheckoutTransactionParams from types/index.d.ts типизация TypeScript
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = Number(transaction.amount) * 100;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          }
        },
        quantity: 1
      }
    ],
    metadata: {
      plan: transaction.plan,
      credits: transaction.credits,
      buyerId: transaction.buyerId,
    },
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
  })

  redirect(session.url!)
}


// эта функция для MongoDB, новая transaction в Базе Данных
// эта функция сохраняет запись платежа в Базе Данных MongoDB
// дополнительно Stripe + его Webhook, те из Stripe отправится в MongoDB по платежу
export async function createTransaction(transaction: CreateTransactionParams) {// CreateTransactionParams from types/index.d.ts типизация TypeScript
  try {

    // connect to MongoDB
    await connectToDatabase();

    // Create a new transaction with a buyerId
    // покупка по id покупателя
    const newTransaction = await Transaction.create({
      ...transaction, buyer: transaction.buyerId
    })

    await updateCredits(transaction.buyerId, transaction.credits);

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error)
  }
}