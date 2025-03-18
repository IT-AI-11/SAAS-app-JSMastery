

"use client";




// to app/(root)/credits/page.tsx ==> CreditPage.tsx


import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";

//import { useToast } from "@/components/ui/use-toast";  original
import { checkoutCredits } from "@/lib/actions/transaction.action";

import { Button } from "../ui/button";



// to app/(root)/credits/page.tsx ==> CreditPage.tsx
const Checkout = ({
  plan,
  amount,
  credits,
  buyerId,
}: {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}) => {

  //const { toast } = useToast();  original

  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }, []);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
    
    // original    
    //   toast({
    //     title: "Order placed!",
    //     description: "You will receive an email confirmation",
    //     duration: 5000,
    //     className: "success-toast",
    //   });

      console.log("payment success !!! huraaaaaa")// my
    }

    if (query.get("canceled")) {

      // original  
    //   toast({
    //     title: "Order canceled!",
    //     description: "Continue to shop around and checkout when you're ready",
    //     duration: 5000,
    //     className: "error-toast",
    //   });

      console.log("error 404 for payment 666666666")// my
    }
  }, []);

  const onCheckout = async () => {
    const transaction = {
      plan,
      amount,
      credits,
      buyerId,
    };

    await checkoutCredits(transaction);
  };

  return (
    <form action={onCheckout} method="POST">
      <section>
        <Button
          type="submit"
          role="link"
          className="w-full rounded-full bg-purple-gradient bg-cover"
        >
          Buy Credit
        </Button>
      </section>
    </form>
  );
};

export default Checkout;