"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  X,
  Plus,
  Star,
  Check,
  Minus,
  ShoppingCart,
  Heart,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Trophy,
  Zap,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/input";
import { getProductById, products as allProducts } from "@/lib/data";
import { useComparisonStore, useCartStore, useWishlistStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

export default function ComparePage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [addingSlot, setAddingSlot] = React.useState<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  const { productIds, addProduct, removeProduct, clearAll } = useComparisonStore();
  const { addItem } = useCartStore();
  const { toggleProduct, isInWishlist } = useWishlistStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Use empty array until mounted to avoid hydration mismatch
  const comparisonProductIds = mounted ? productIds : [];

  const comparedProducts = comparisonProductIds
    .map((id) => getProductById(id))
    .filter(Boolean) as Product[];

  const filteredProducts = allProducts.filter(
    (p) =>
      !comparisonProductIds.includes(p.id) &&
      (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddProduct = (product: Product) => {
    if (productIds.length < 4) {
      addProduct(product.id);
      setShowAddModal(false);
      setSearchQuery("");
      toast.success(`Added ${product.title} to comparison`);
    }
  };

  // Get all unique specification keys from compared products
  const allSpecKeys = React.useMemo(() => {
    const keys = new Set<string>();
    comparedProducts.forEach((p) => {
      Object.keys(p.specifications).forEach((k) => keys.add(k));
    });
    return Array.from(keys);
  }, [comparedProducts]);

  // Find best values for comparisons
  const getBestValue = (key: string): string | null => {
    if (comparedProducts.length < 2) return null;

    const values = comparedProducts
      .map((p) => ({ id: p.id, value: p.specifications[key] }))
      .filter((v) => v.value);

    if (values.length === 0) return null;

    // For price, lower is better
    if (key.toLowerCase() === "price") {
      const numericValues = values.map((v) => ({
        id: v.id,
        num: parseFloat(v.value.toString().replace(/[^0-9.]/g, "")),
      }));
      const min = Math.min(...numericValues.map((v) => v.num));
      return numericValues.find((v) => v.num === min)?.id || null;
    }

    // For ratings, higher is better
    if (key.toLowerCase().includes("rating")) {
      const numericValues = values.map((v) => ({
        id: v.id,
        num: parseFloat(v.value.toString()),
      }));
      const max = Math.max(...numericValues.map((v) => v.num));
      return numericValues.find((v) => v.num === max)?.id || null;
    }

    return null;
  };

  // Calculate winner
  const winner = React.useMemo(() => {
    if (comparedProducts.length < 2) return null;

    const scores: Record<string, number> = {};
    comparedProducts.forEach((p) => (scores[p.id] = 0));

    // Score based on rating
    const ratingArr = comparedProducts.map((p) => ({ id: p.id, rating: p.rating }));
    const maxRating = Math.max(...ratingArr.map((r) => r.rating));
    ratingArr.forEach((r) => {
      if (r.rating === maxRating) scores[r.id] += 2;
    });

    // Score based on price (lower is better)
    const priceArr = comparedProducts.map((p) => ({ id: p.id, price: p.price }));
    const minPrice = Math.min(...priceArr.map((p) => p.price));
    priceArr.forEach((p) => {
      if (p.price === minPrice) scores[p.id] += 2;
    });

    // Score based on reviews
    const reviewArr = comparedProducts.map((p) => ({ id: p.id, reviews: p.reviewCount }));
    const maxReviews = Math.max(...reviewArr.map((r) => r.reviews));
    reviewArr.forEach((r) => {
      if (r.reviews === maxReviews) scores[r.id] += 1;
    });

    const winnerId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    return comparedProducts.find((p) => p.id === winnerId) || null;
  }, [comparedProducts]);

  if (comparedProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <BarChart2 className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Compare Products</h1>
            <p className="text-muted-foreground mb-8">
              Add products to compare their features, specifications, and prices side by
              side. Make smarter shopping decisions!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setShowAddModal(true)} className="gap-2">
                <Plus className="h-5 w-5" />
                Add Products to Compare
              </Button>
              <Link href="/products">
                <Button size="lg" variant="outline" className="gap-2 w-full">
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Product Comparison</h1>
            <p className="text-muted-foreground">
              Comparing {comparedProducts.length} products
            </p>
          </div>
          <div className="flex gap-3">
            {productIds.length < 4 && (
              <Button variant="outline" className="gap-2" onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            )}
            <Button variant="outline" className="gap-2" onClick={clearAll}>
              <X className="h-4 w-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Winner Banner */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/10 border border-amber-500/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-amber-500">AI Recommendation</p>
                <p className="text-sm text-muted-foreground">
                  Based on specs, price, and reviews, <strong>{winner.title}</strong> is our
                  top pick!
                </p>
              </div>
              <Button
                className="gap-2"
                onClick={() => {
                  addItem(winner, 1);
                  toast.success("Added to cart!");
                }}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        )}

        {/* Comparison Table */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[800px]">
            {/* Product Cards Row */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${Math.max(comparedProducts.length, 2)}, 1fr)` }}>
              <div /> {/* Empty cell */}
              {comparedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "p-4 relative",
                    winner?.id === product.id && "ring-2 ring-amber-500"
                  )}>
                    {winner?.id === product.id && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-amber-950 gap-1">
                        <Trophy className="h-3 w-3" /> Best Pick
                      </Badge>
                    )}
                    <button
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-destructive hover:text-white transition-colors"
                      onClick={() => removeProduct(product.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <Link href={`/products/${product.id}`}>
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    </Link>
                    <p className="text-xs text-muted-foreground uppercase">{product.brand}</p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="font-medium">{product.rating}</span>
                      <span className="text-muted-foreground text-sm">
                        ({product.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => {
                          addItem(product, 1);
                          toast.success("Added to cart!");
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant={isInWishlist(product.id) ? "default" : "outline"}
                        className={cn(isInWishlist(product.id) && "bg-rose-500 hover:bg-rose-600")}
                        onClick={() => {
                          toggleProduct(product.id);
                          toast.success(
                            isInWishlist(product.id)
                              ? "Removed from wishlist"
                              : "Added to wishlist"
                          );
                        }}
                      >
                        <Heart className={cn("h-4 w-4", isInWishlist(product.id) && "fill-current")} />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
              {/* Empty slots */}
              {[...Array(4 - comparedProducts.length)].map((_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (comparedProducts.length + i) * 0.1 }}
                >
                  <Card
                    className="p-4 h-full min-h-[280px] border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    onClick={() => {
                      setAddingSlot(i);
                      setShowAddModal(true);
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">Add Product</p>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Specifications Table */}
            <div className="mt-6 rounded-xl border border-border overflow-hidden">
              {/* Price Row */}
              <div className="grid bg-muted/50" style={{ gridTemplateColumns: `200px repeat(${Math.max(comparedProducts.length, 2)}, 1fr)` }}>
                <div className="p-4 font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Price
                </div>
                {comparedProducts.map((product) => (
                  <div key={product.id} className="p-4 text-center">
                    <span className="text-xl font-bold text-primary">
                      ${product.price.toLocaleString('en-US')}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        ${product.compareAtPrice.toLocaleString('en-US')}
                      </span>
                    )}
                  </div>
                ))}
                {[...Array(Math.max(0, 2 - comparedProducts.length))].map((_, i) => (
                  <div key={`empty-price-${i}`} className="p-4 text-center text-muted-foreground">
                    —
                  </div>
                ))}
              </div>

              {/* Rating Row */}
              <div className="grid" style={{ gridTemplateColumns: `200px repeat(${Math.max(comparedProducts.length, 2)}, 1fr)` }}>
                <div className="p-4 font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-primary" />
                  Rating
                </div>
                {comparedProducts.map((product) => {
                  const isHighest =
                    comparedProducts.length > 1 &&
                    product.rating === Math.max(...comparedProducts.map((p) => p.rating));
                  return (
                    <div
                      key={product.id}
                      className={cn(
                        "p-4 text-center",
                        isHighest && "bg-emerald-500/10"
                      )}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < Math.floor(product.rating)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-muted"
                              )}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{product.rating}</span>
                        {isHighest && <Badge variant="success" className="text-xs">Best</Badge>}
                      </div>
                    </div>
                  );
                })}
                {[...Array(Math.max(0, 2 - comparedProducts.length))].map((_, i) => (
                  <div key={`empty-rating-${i}`} className="p-4 text-center text-muted-foreground">
                    —
                  </div>
                ))}
              </div>

              {/* Shipping Row */}
              <div className="grid bg-muted/50" style={{ gridTemplateColumns: `200px repeat(${Math.max(comparedProducts.length, 2)}, 1fr)` }}>
                <div className="p-4 font-medium flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  Shipping
                </div>
                {comparedProducts.map((product) => (
                  <div key={product.id} className="p-4 text-center">
                    <Badge variant={product.freeShipping ? "success" : "outline"}>
                      {product.freeShipping ? "Free Shipping" : "Paid Shipping"}
                    </Badge>
                  </div>
                ))}
                {[...Array(Math.max(0, 2 - comparedProducts.length))].map((_, i) => (
                  <div key={`empty-ship-${i}`} className="p-4 text-center text-muted-foreground">
                    —
                  </div>
                ))}
              </div>

              {/* Stock Row */}
              <div className="grid" style={{ gridTemplateColumns: `200px repeat(${Math.max(comparedProducts.length, 2)}, 1fr)` }}>
                <div className="p-4 font-medium">Stock</div>
                {comparedProducts.map((product) => (
                  <div key={product.id} className="p-4 text-center">
                    {product.stock > 0 ? (
                      <span className="text-emerald-500 font-medium">
                        {product.stock} available
                      </span>
                    ) : (
                      <span className="text-red-500 font-medium">Out of stock</span>
                    )}
                  </div>
                ))}
                {[...Array(Math.max(0, 2 - comparedProducts.length))].map((_, i) => (
                  <div key={`empty-stock-${i}`} className="p-4 text-center text-muted-foreground">
                    —
                  </div>
                ))}
              </div>

              {/* Specifications */}
              {allSpecKeys.map((key, index) => (
                <div
                  key={key}
                  className={cn("grid", index % 2 === 0 && "bg-muted/50")}
                  style={{ gridTemplateColumns: `200px repeat(${Math.max(comparedProducts.length, 2)}, 1fr)` }}
                >
                  <div className="p-4 font-medium">{key}</div>
                  {comparedProducts.map((product) => {
                    const value = product.specifications[key];
                    const best = getBestValue(key);
                    return (
                      <div
                        key={product.id}
                        className={cn(
                          "p-4 text-center",
                          best === product.id && "bg-emerald-500/10"
                        )}
                      >
                        {value || <span className="text-muted-foreground">—</span>}
                      </div>
                    );
                  })}
                  {[...Array(Math.max(0, 2 - comparedProducts.length))].map((_, i) => (
                    <div key={`empty-${key}-${i}`} className="p-4 text-center text-muted-foreground">
                      —
                    </div>
                  ))}
                </div>
              ))}

              {/* Features */}
              <div className="grid bg-muted/50" style={{ gridTemplateColumns: `200px repeat(${Math.max(comparedProducts.length, 2)}, 1fr)` }}>
                <div className="p-4 font-medium flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Key Features
                </div>
                {comparedProducts.map((product) => (
                  <div key={product.id} className="p-4">
                    <ul className="space-y-2">
                      {product.features.slice(0, 5).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {[...Array(Math.max(0, 2 - comparedProducts.length))].map((_, i) => (
                  <div key={`empty-feat-${i}`} className="p-4 text-center text-muted-foreground">
                    —
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl max-h-[80vh] bg-background rounded-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Add Product to Compare</h2>
                  <button
                    className="p-2 hover:bg-muted rounded-lg"
                    onClick={() => setShowAddModal(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <SearchInput
                  placeholder="Search by name, brand, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredProducts.slice(0, 20).map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors"
                      onClick={() => handleAddProduct(product)}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                        <p className="font-medium line-clamp-2">{product.title}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-primary">
                            ${product.price.toLocaleString('en-US')}
                          </span>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            {product.rating}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">
                    No products found matching your search.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
