




//region [rgba(241, 196, 15, 0.2)]

// это server functions, они работают как GET, POST, UPDATE, DELETE

//endregion


"use server";



import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";



// together-1 =================================================================

// from Clerk webhook
// const user555 = {
//     clerkId: id,
//     email: email_addresses[0].email_address,
//     username: username!, 
//     firstName: first_name!,
//     lastName: last_name!,
//     photo: image_url,
//   };

// from types/index.d.ts for TypeScript
//   declare type CreateUserParams = {
//     clerkId: string;
//     email: string;
//     username: string;
//     firstName: string;
//     lastName: string;
//     photo: string;
//   };
  
// CREATE
// POST создать пользователя
// to app/api/webhooks/clerk/route.ts
export async function createUser(user555: CreateUserParams) {// CreateUserParams это type для TyprScript, from types/index.d.ts
    console.log("CreateUserParams данные в type =============>", user555)
  try {
    await connectToDatabase();

    const newUser = await User.create(user555);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);// from lib/utils.ts
  }
}
// together-1 =================================================================










// READ
// GET получить пользователя по id
// to AddTransformationTypePage() ==> app/(root)/transformations/add/[type]/page.tsx
export async function getUserById(userId: string) {// string это type для TyprScript
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);// from lib/utils.ts
  }
}



// together-2 =================================================================

// from Clerk webhook
//     const user = {
//       firstName: first_name,
//       lastName: last_name,
//       username: username!,
//       photo: image_url,
//     };

// from types/index.d.ts for TypeScript
//   declare type UpdateUserParams = {
//     firstName: string;
//     lastName: string;
//     username: string;
//     photo: string;
//   };

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {// UpdateUserParams это type для TyprScript, from types/index.d.ts
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);// from lib/utils.ts
  }
}
// together-2 =================================================================










// DELETE
export async function deleteUser(clerkId: string) {// string это type для TyprScript
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);// from lib/utils.ts
  }
}



// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {// string и number это type для TyprScript
  try {
    await connectToDatabase();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee }},
      { new: true }
    )

    if(!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);// from lib/utils.ts
  }
}