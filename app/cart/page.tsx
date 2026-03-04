"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Package,
  Truck,
  Shield,
  Tag,
  X,
  Heart,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/slider";
import { ProductCard } from "@/components/product";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { products as allProducts } from "@/lib/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const [couponCode, setCouponCode] = React.useState("");
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  const { items, removeItem, updateQuantity, clearCart, getSubtotal, getTotalItems } =
    useCartStore();
  const { toggleProduct, isInWishlist } = useWishlistStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use default values until mounted to avoid hydration mismatch
  const cartItems = mounted ? items : [];
  const subtotal = mounted ? getSubtotal() : 0;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const discount = appliedCoupon ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + tax - discount;

  const freeShippingProgress = Math.min((subtotal / 100) * 100, 100);
  const freeShippingRemaining = Math.max(100 - subtotal, 0);

  // Get recommended products
  const cartCategories = [...new Set(cartItems.map((i) => i.product.category))];
  const recommendedProducts = allProducts
    .filter(
      (p) =>
        cartCategories.includes(p.category) &&
        !cartItems.some((i) => i.product.id === p.id)
    )
    .slice(0, 4);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success("Coupon applied! 10% off");
    } else {
      toast.error("Invalid coupon code");
    }
    setCouponCode("");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added anything to your cart yet. Start shopping
              and discover amazing products!
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {getTotalItems()} item{getTotalItems() !== 1 && "s"} in your cart
          </p>
        </div>

        {/* Free Shipping Progress */}
        {freeShippingRemaining > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-sm">
                Add <strong>${freeShippingRemaining.toFixed(2)}</strong> more to get{" "}
                <strong>FREE shipping!</strong>
              </span>
            </div>
            <Progress value={freeShippingProgress} showLabel={false} />
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4">
                    <div className="flex gap-4">
                      <Link href={`/products/${item.product.id}`}>
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase">
                              {item.product.brand}
                            </p>
                            <Link href={`/products/${item.product.id}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                                {item.product.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="font-bold text-primary">
                                ${item.product.price.toLocaleString('en-US')}
                              </span>
                              {item.product.compareAtPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.product.compareAtPrice.toLocaleString('en-US')}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => {
                              removeItem(item.product.id);
                              toast.info("Removed from cart");
                            }}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  Math.min(item.product.stock, item.quantity + 1)
                                )
                              }
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              className={cn(
                                "p-2 rounded-lg transition-colors",
                                isInWishlist(item.product.id)
                                  ? "text-rose-500"
                                  : "text-muted-foreground hover:text-rose-500"
                              )}
                              onClick={() => {
                                toggleProduct(item.product.id);
                                toast.success(
                                  isInWishlist(item.product.id)
                                    ? "Removed from wishlist"
                                    : "Added to wishlist"
                                );
                              }}
                            >
                              <Heart
                                className={cn(
                                  "h-5 w-5",
                                  isInWishlist(item.product.id) && "fill-current"
                                )}
                              />
                            </button>
                            <span className="font-bold text-lg">
                              ${(item.product.price * item.quantity).toLocaleString('en-US')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => {
                  clearCart();
                  toast.info("Cart cleared");
                }}
              >
                <Trash2 className="h-4 w-4" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
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
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-emerald-500">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>{appliedCoupon}</span>
                      <button
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setAppliedCoupon(null)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Coupon */}
              {!appliedCoupon && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={!couponCode}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Try &quot;SAVE10&quot; for 10% off
                  </p>
                </div>
              )}

              {/* Total */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                size="lg"
                className="w-full mt-6 gap-2"
                onClick={() => router.push("/checkout")}
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Easy returns within 30 days</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>Fast worldwide shipping</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">You Might Also Like</h2>
              <Link href="/products">
                <Button variant="ghost" className="gap-2">
                  View More
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
