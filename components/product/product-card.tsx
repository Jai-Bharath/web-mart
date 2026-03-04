"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, BarChart2, Star, Truck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore, useWishlistStore, useComparisonStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
  showQuickActions?: boolean;
}

export function ProductCard({ product, index = 0, showQuickActions = true }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isInWishlist, toggleProduct } = useWishlistStore();
  const { isInComparison, addProduct, removeProduct, productIds } = useComparisonStore();
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [addedToCart, setAddedToCart] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const inWishlist = mounted ? isInWishlist(product.id) : false;
  const inComparison = mounted ? isInComparison(product.id) : false;
  const comparisonCount = mounted ? productIds.length : 0;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleProduct(product.id);
  };

  const handleToggleComparison = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inComparison) {
      removeProduct(product.id);
    } else if (productIds.length < 4) {
      addProduct(product.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}

            {/* Product Image */}
            <motion.img
              src={product.images[0]}
              alt={product.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                isHovered && "scale-110"
              )}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <Badge variant="destructive" className="font-semibold">
                  -{discount}%
                </Badge>
              )}
              {product.freeShipping && (
                <Badge variant="success" className="gap-1">
                  <Truck className="h-3 w-3" />
                  Free Ship
                </Badge>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="warning">Low Stock</Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="outline">Out of Stock</Badge>
              )}
            </div>

            {/* Quick Actions */}
            {showQuickActions && (
              <motion.div
                className="absolute top-3 right-3 flex flex-col gap-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant={inWishlist ? "default" : "glass"}
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-full shadow-lg",
                    inWishlist && "bg-rose-500 hover:bg-rose-600"
                  )}
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={cn("h-4 w-4", inWishlist && "fill-current")}
                  />
                </Button>
                <Button
                  variant={inComparison ? "default" : "glass"}
                  size="icon"
                  className="h-9 w-9 rounded-full shadow-lg"
                  onClick={handleToggleComparison}
                  disabled={!inComparison && comparisonCount >= 4}
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="glass"
                  size="icon"
                  className="h-9 w-9 rounded-full shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/products/${product.id}`;
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Add to Cart Overlay */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                className={cn(
                  "w-full gap-2 shadow-lg",
                  addedToCart && "bg-emerald-500 hover:bg-emerald-600"
                )}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {addedToCart ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      ✓ Added to Cart
                    </motion.div>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Brand & Category */}
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-xs text-muted-foreground">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
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
                ({product.reviewCount.toLocaleString('en-US')})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  ${product.price.toLocaleString('en-US')}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.compareAtPrice.toLocaleString('en-US')}
                  </span>
                )}
              </div>
              {product.freeShipping && (
                <span className="text-xs text-emerald-500 font-medium">
                  Free Shipping
                </span>
              )}
            </div>

            {/* Seller */}
            <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground truncate">
                by {product.sellerName}
              </span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-medium">{product.sellerRating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-12 bg-muted rounded" />
        </div>
        <div className="h-4 w-full bg-muted rounded" />
        <div className="h-4 w-3/4 bg-muted rounded" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 bg-muted rounded" />
          ))}
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

// Compact Product Card
export function ProductCardCompact({ product }: { product: Product }) {
  const { addItem } = useCartStore();

  return (
    <div className="flex gap-4 p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all">
      <Link href={`/products/${product.id}`} className="shrink-0">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${product.id}`}>
          <h4 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h4>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
          <span className="text-xs">{product.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold text-primary">
            ${product.price.toLocaleString('en-US')}
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-7"
            onClick={() => addItem(product)}
          >
            <ShoppingCart className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
