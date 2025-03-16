



// import { Webhook } from 'svix'
// import { headers } from 'next/headers'
// import { WebhookEvent } from '@clerk/nextjs/server'

// //import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";


// export async function POST(req: Request) {
    
//   const SIGNING_SECRET = process.env.SIGNING_SECRET

//   if (!SIGNING_SECRET) {
//     throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
//   }

//   // Create new Svix instance with secret
//   const wh = new Webhook(SIGNING_SECRET)

//   // Get headers
//   const headerPayload = await headers()
//   const svix_id = headerPayload.get('svix-id')
//   const svix_timestamp = headerPayload.get('svix-timestamp')
//   const svix_signature = headerPayload.get('svix-signature')

//   // If there are no headers, error out
//   if (!svix_id || !svix_timestamp || !svix_signature) {
//     return new Response('Error: Missing Svix headers', {
//       status: 400,
//     })
//   }

//   // Get body
//   const payload = await req.json()
//   const body = JSON.stringify(payload)

//   let evt: WebhookEvent

//   // Verify payload with headers
//   try {
//     evt = wh.verify(body, {
//       'svix-id': svix_id,
//       'svix-timestamp': svix_timestamp,
//       'svix-signature': svix_signature,
//     }) as WebhookEvent
//   } catch (err) {
//     console.error('Error: Could not verify webhook:', err)
//     return new Response('Error: Verification error', {
//       status: 400,
//     })
//   }

//   // Do something with payload
//   // For this guide, log payload to console
//   //const { id } = evt.data
//   //const eventType = evt.type
// //   console.log(`Received webhook with ID ${id} and event type of ${eventType}`)    original
// //   console.log('Webhook payload:', body)   original

//   return new Response('Webhook received', { status: 200 })
// }









/* eslint-disable camelcase */
//import { clerkClient } from "@clerk/nextjs";     original
import { clerkClient } from "@clerk/nextjs/server"; //  new  теперь clerkClient асинхронный async/await
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  // const headerPayload = headers();     original
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;



  // CREATE
  // ЗАПРОС НА endpoint/request
  if (eventType === "user.created") {
    // получаем все данные пользователя/user из Clerk
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
    // вытаскиваем данные пользователя(из строки сверху)  const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
    // и ложим эти данные в новый обьект    const user = {}
    const user555 = {
      clerkId: id,
      email: email_addresses[0].email_address,
      username: username!, 
      firstName: first_name!,
      lastName: last_name!,
      photo: image_url,
    };
    // вызываем функцию endpoint ==> createUser(user) чтобы создать нового пользователя
    const newUser = await createUser(user555);


    const client = await clerkClient();// теперь clerkClient асинхронный нужно await
    // Set public metadata
    if (newUser) {
    //   await clerkClient.users.updateUserMetadata(id, {   original  with error
        await client.users.updateUserMetadata(id, { //new no-error
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }

    return NextResponse.json({ message: "OK", user: newUser });
  }








  // UPDATE user
//   if (eventType === "user.updated") {
//     const { id, image_url, first_name, last_name, username } = evt.data;

//     const user = {
//       firstName: first_name,
//       lastName: last_name,
//       username: username!,
//       photo: image_url,
//     };

//     const updatedUser = await updateUser(id, user);

//     return NextResponse.json({ message: "OK", user: updatedUser });
//   }









  // DELETE user
//   if (eventType === "user.deleted") {
//     const { id } = evt.data;

//     const deletedUser = await deleteUser(id!);

//     return NextResponse.json({ message: "OK", user: deletedUser });
//   }

//   console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
//   console.log("Webhook body:", body);

//   return new Response("", { status: 200 });



 }