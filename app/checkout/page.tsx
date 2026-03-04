"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  CreditCard,
  MapPin,
  ShoppingBag,
  Truck,
  Shield,
  Package,
  Lock,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Toggle } from "@/components/ui/tabs";
import { useCartStore, useCheckoutStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Address", icon: MapPin },
  { id: 2, title: "Payment", icon: CreditCard },
  { id: 3, title: "Review", icon: ShoppingBag },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [orderComplete, setOrderComplete] = React.useState(false);
  const [orderId, setOrderId] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  const { items, getSubtotal, getTotalItems, clearCart } = useCartStore();
  const {
    shippingAddress,
    billingAddress,
    paymentMethod,
    sameAsShipping,
    setShippingAddress,
    setBillingAddress,
    setPaymentMethod,
    setSameAsShipping,
    reset,
  } = useCheckoutStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use default values until mounted to avoid hydration mismatch
  const cartItems = mounted ? items : [];
  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Redirect if cart is empty
  React.useEffect(() => {
    if (mounted && cartItems.length === 0 && !orderComplete) {
      router.push("/cart");
    }
  }, [mounted, cartItems.length, orderComplete, router]);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    const newOrderId = `WM-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);
    setOrderComplete(true);
    clearCart();
    reset();
    setIsProcessing(false);
    toast.success("Order placed successfully!");
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return !!(
        shippingAddress.firstName &&
        shippingAddress.lastName &&
        shippingAddress.address &&
        shippingAddress.city &&
        shippingAddress.state &&
        shippingAddress.zipCode &&
        shippingAddress.phone
      );
    }
    if (step === 2) {
      return !!(
        paymentMethod.cardNumber &&
        paymentMethod.cardHolder &&
        paymentMethod.expiry &&
        paymentMethod.cvv
      );
    }
    return true;
  };

  const countries = [
    { value: "US", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "IN", label: "India" },
  ];

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6"
            >
              <PartyPopper className="h-10 w-10 text-emerald-500" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            <p className="text-lg font-medium text-primary mb-8">
              Order ID: {orderId}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/track">
                <Button size="lg" className="gap-2 w-full">
                  <Truck className="h-4 w-4" />
                  Track Order
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="gap-2 w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={cn(
                    "flex items-center gap-2 cursor-pointer transition-colors",
                    currentStep >= step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={() => {
                    if (currentStep > step.id) {
                      setCurrentStep(step.id);
                    }
                  }}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      currentStep > step.id
                        ? "bg-emerald-500 text-white"
                        : currentStep === step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-16 sm:w-24 transition-colors",
                      currentStep > step.id ? "bg-emerald-500" : "bg-muted"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Shipping Address
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        placeholder="John"
                        value={shippingAddress.firstName}
                        onChange={(e) =>
                          setShippingAddress({ firstName: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="Last Name"
                        placeholder="Doe"
                        value={shippingAddress.lastName}
                        onChange={(e) =>
                          setShippingAddress({ lastName: e.target.value })
                        }
                        required
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="Address"
                          placeholder="123 Main Street"
                          value={shippingAddress.address}
                          onChange={(e) =>
                            setShippingAddress({ address: e.target.value })
                          }
                          required
                        />
                      </div>
                      <Input
                        label="City"
                        placeholder="New York"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ city: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="State/Province"
                        placeholder="NY"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ state: e.target.value })
                        }
                        required
                      />
                      <Input
                        label="ZIP Code"
                        placeholder="10001"
                        value={shippingAddress.zipCode}
                        onChange={(e) =>
                          setShippingAddress({ zipCode: e.target.value })
                        }
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Country
                        </label>
                        <Select
                          options={countries}
                          value={shippingAddress.country}
                          onChange={(v) => setShippingAddress({ country: v })}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Input
                          label="Phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={shippingAddress.phone}
                          onChange={(e) =>
                            setShippingAddress({ phone: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Method
                    </h2>

                    {/* Card Icons */}
                    <div className="flex gap-2 mb-6">
                      <div className="px-3 py-2 rounded-lg border border-border bg-muted">
                        <span className="font-bold text-blue-500">VISA</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg border border-border bg-muted">
                        <span className="font-bold text-red-500">MC</span>
                      </div>
                      <div className="px-3 py-2 rounded-lg border border-border bg-muted">
                        <span className="font-bold text-blue-400">AMEX</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Input
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        value={paymentMethod.cardNumber}
                        onChange={(e) =>
                          setPaymentMethod({
                            cardNumber: e.target.value.replace(/\D/g, "").slice(0, 16),
                          })
                        }
                        leftIcon={<CreditCard className="h-4 w-4" />}
                        required
                      />
                      <Input
                        label="Card Holder Name"
                        placeholder="JOHN DOE"
                        value={paymentMethod.cardHolder}
                        onChange={(e) =>
                          setPaymentMethod({
                            cardHolder: e.target.value.toUpperCase(),
                          })
                        }
                        required
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Expiry Date"
                          placeholder="MM/YY"
                          value={paymentMethod.expiry}
                          onChange={(e) =>
                            setPaymentMethod({
                              expiry: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 4)
                                .replace(/(\d{2})(\d)/, "$1/$2"),
                            })
                          }
                          required
                        />
                        <Input
                          label="CVV"
                          placeholder="123"
                          type="password"
                          value={paymentMethod.cvv}
                          onChange={(e) =>
                            setPaymentMethod({
                              cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-6 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <Lock className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-emerald-500">
                        Your payment information is secure and encrypted
                      </span>
                    </div>
                  </Card>

                  {/* Billing Address */}
                  <Card className="p-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Billing Address</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Same as shipping</span>
                        <Toggle
                          checked={sameAsShipping}
                          onChange={setSameAsShipping}
                        />
                      </div>
                    </div>

                    {!sameAsShipping && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          placeholder="John"
                          value={billingAddress.firstName}
                          onChange={(e) =>
                            setBillingAddress({ firstName: e.target.value })
                          }
                        />
                        <Input
                          label="Last Name"
                          placeholder="Doe"
                          value={billingAddress.lastName}
                          onChange={(e) =>
                            setBillingAddress({ lastName: e.target.value })
                          }
                        />
                        <div className="sm:col-span-2">
                          <Input
                            label="Address"
                            placeholder="123 Main Street"
                            value={billingAddress.address}
                            onChange={(e) =>
                              setBillingAddress({ address: e.target.value })
                            }
                          />
                        </div>
                        <Input
                          label="City"
                          placeholder="New York"
                          value={billingAddress.city}
                          onChange={(e) =>
                            setBillingAddress({ city: e.target.value })
                          }
                        />
                        <Input
                          label="ZIP Code"
                          placeholder="10001"
                          value={billingAddress.zipCode}
                          onChange={(e) =>
                            setBillingAddress({ zipCode: e.target.value })
                          }
                        />
                      </div>
                    )}
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-4"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium line-clamp-1">
                              {item.product.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-medium">
                            ${(item.product.price * item.quantity).toLocaleString('en-US')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-primary" />
                        Shipping Address
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {shippingAddress.firstName} {shippingAddress.lastName}
                        <br />
                        {shippingAddress.address}
                        <br />
                        {shippingAddress.city}, {shippingAddress.state}{" "}
                        {shippingAddress.zipCode}
                        <br />
                        {shippingAddress.country}
                        <br />
                        {shippingAddress.phone}
                      </p>
                    </Card>
                    <Card className="p-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Payment Method
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Card ending in{" "}
                        {paymentMethod.cardNumber.slice(-4) || "****"}
                        <br />
                        {paymentMethod.cardHolder || "Card Holder"}
                        <br />
                        Expires: {paymentMethod.expiry || "MM/YY"}
                      </p>
                    </Card>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              {currentStep < 3 ? (
                <Button
                  className="gap-2"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!validateStep(currentStep)}
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="gap-2"
                  onClick={handlePlaceOrder}
                  loading={isProcessing}
                  disabled={isProcessing}
                >
                  <Lock className="h-4 w-4" />
                  Place Order - ${total.toFixed(2)}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Items ({getTotalItems()})
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-500 font-medium">FREE</span>
                  ) : (
                    <span>${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Buyer Protection</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Package className="h-5 w-5 text-primary" />
                  <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Lock className="h-5 w-5 text-primary" />
                  <span>Secure Payment</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
