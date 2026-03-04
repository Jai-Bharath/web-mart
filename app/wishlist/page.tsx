"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  X,
  Star,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product";
import { useWishlistStore, useCartStore, useComparisonStore } from "@/lib/store";
import { getProductsByIds, products as allProducts } from "@/lib/data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function WishlistPage() {
  const [mounted, setMounted] = React.useState(false);
  const { productIds, removeProduct, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { addProduct: addToComparison } = useComparisonStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const wishlistIds = mounted ? productIds : [];
  const wishlistProducts = getProductsByIds(wishlistIds);

  // Recommended products based on wishlist categories
  const wishlistCategories = [...new Set(wishlistProducts.map((p) => p.category))];
  const recommendedProducts = allProducts
    .filter(
      (p) =>
        wishlistCategories.includes(p.category) &&
        !wishlistIds.includes(p.id)
    )
    .slice(0, 4);

  const handleAddToCart = (productId: string) => {
    const product = wishlistProducts.find((p) => p.id === productId);
    if (product) {
      addItem(product);
      toast.success("Added to cart!");
    }
  };

  const handleAddAllToCart = () => {
    wishlistProducts.forEach((product) => {
      if (product.stock > 0) {
        addItem(product);
      }
    });
    toast.success(`Added ${wishlistProducts.filter((p) => p.stock > 0).length} items to cart!`);
  };

  const handleRemove = (productId: string) => {
    removeProduct(productId);
    toast.info("Removed from wishlist");
  };

  const handleAddToComparison = (productId: string) => {
    const success = addToComparison(productId);
    if (success) {
      toast.success("Added to comparison!");
    } else {
      toast.error("Comparison list is full (max 4)");
    }
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-rose-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Save items you love to your wishlist. Review them anytime and easily
              move them to your cart.
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Suggestions */}
          {allProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold mb-6 text-center">Trending Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allProducts
                  .filter((p) => p.rating >= 4.7)
                  .slice(0, 4)
                  .map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6 text-rose-500" />
              My Wishlist
            </h1>
            <p className="text-muted-foreground">
              {wishlistProducts.length} item{wishlistProducts.length !== 1 && "s"} saved
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleAddAllToCart}
            >
              <ShoppingCart className="h-4 w-4" />
              Add All to Cart
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-destructive hover:text-destructive"
              onClick={() => {
                clearWishlist();
                toast.info("Wishlist cleared");
              }}
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          <AnimatePresence>
            {wishlistProducts.map((product, index) => {
              const discount = product.compareAtPrice
                ? Math.round(
                    ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
                  )
                : 0;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link href={`/products/${product.id}`} className="shrink-0">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                              {product.brand}
                            </p>
                            <Link href={`/products/${product.id}`}>
                              <h3 className="font-semibold hover:text-primary transition-colors line-clamp-2">
                                {product.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-3.5 w-3.5",
                                      i < Math.floor(product.rating)
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-muted fill-muted"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                ({product.reviewCount.toLocaleString("en-US")})
                              </span>
                            </div>
                          </div>
                          <button
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => handleRemove(product.id)}
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              ${product.price.toLocaleString("en-US")}
                            </span>
                            {product.compareAtPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.compareAtPrice.toLocaleString("en-US")}
                              </span>
                            )}
                            {discount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                -{discount}%
                              </Badge>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => handleAddToComparison(product.id)}
                            >
                              <BarChart2 className="h-3.5 w-3.5" />
                              Compare
                            </Button>
                            <Button
                              size="sm"
                              className="gap-1"
                              onClick={() => handleAddToCart(product.id)}
                              disabled={product.stock === 0}
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                            </Button>
                          </div>
                        </div>

                        {/* Stock Status */}
                        <div className="mt-2">
                          {product.stock === 0 ? (
                            <span className="text-xs text-destructive">Out of Stock</span>
                          ) : product.stock < 10 ? (
                            <span className="text-xs text-amber-500">Only {product.stock} left!</span>
                          ) : (
                            <span className="text-xs text-emerald-500">In Stock</span>
                          )}
                          {product.freeShipping && (
                            <span className="text-xs text-muted-foreground ml-3">
                              Free Shipping
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
