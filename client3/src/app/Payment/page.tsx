// payment-page.tsx
"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
export default function PaymentPage() {
  const router = useRouter();

//   const handlePlanSelect = async (plan: string) => {
//     try {
//       const response = await fetch("http://localhost:5000/api/payment/checkout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           plan,
//         }),
//       });

//       const data = await response.json();
//       if (data?.url) {
//         window.location.href = data.url;
//       } else {
//         alert("Failed to redirect to payment page. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error during checkout:", err);
//     }
//   };

  const handleCheckout = async (plan: string) => {
    try {
      let planDetails = {
        price: 0,
        name: "",
        taskLimit: 0
      };

      switch (plan) {
        case "free":
          planDetails = { price: 0, name: "Free Plan", taskLimit: 3 };
          break;
        case "pro":
          planDetails = { price: 199, name: "Pro Plan", taskLimit: 10 };
          break;
        case "premium":
          planDetails = { price: 299, name: "Premium Plan", taskLimit: 50 };
          break;
      }

      // Don't proceed with checkout for free plan
      if (plan === "free") {
        // You might want to handle free plan registration differently
        alert("Free plan selected!");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/tasks/checkout",
        {
          items: [
            {
              id: plan === "pro" ? 2 : 1, // Different IDs for different plans
              quantity: 1,
              price: planDetails.price,
              name: planDetails.name,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const { url } = response.data;
      window.location.href = url;
    } catch (err) {
      console.error("Error during checkout:", err);
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto py-10">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Choose Your Plan</CardTitle>
          <CardDescription>Select a plan that suits your needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <Card className="border p-4">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>
                  Basic features
                  <ul className="mt-2 text-sm">
                    <li>Up to 3 tasks</li>
                    <li>Basic support</li>
                  </ul>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => handleCheckout("free")} variant="outline">
                  Select Free
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="border p-4">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>
                  Extended features
                  <ul className="mt-2 text-sm">
                    <li>Up to 10 tasks</li>
                    <li>Priority support</li>
                  </ul>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => handleCheckout("pro")}>
                  Select Pro - ₹199
                </Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="border p-4">
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>
                  All features unlocked
                  <ul className="mt-2 text-sm">
                    <li>Up to 50 tasks</li>
                    <li>24/7 support</li>
                  </ul>
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => handleCheckout("premium")} variant="destructive">
                  Select Premium - ₹299
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Update CreateTaskForm.tsx to redirect
