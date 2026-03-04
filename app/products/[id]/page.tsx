"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Heart,
  Share2,
  ShoppingCart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Minus,
  Plus,
  BarChart2,
  Package,
  Clock,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StarRating, Progress } from "@/components/ui/slider";
import { ProductCard } from "@/components/product";
import { getProductById, products } from "@/lib/data";
import { useCartStore, useWishlistStore, useComparisonStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const product = getProductById(id);

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleProduct } = useWishlistStore();
  const { isInComparison, addProduct, removeProduct, productIds } = useComparisonStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button onClick={() => router.push("/products")}>Back to Products</Button>
      </div>
    );
  }

  const inWishlist = mounted ? isInWishlist(product.id) : false;
  const inComparison = mounted ? isInComparison(product.id) : false;
  const comparisonCount = mounted ? productIds.length : 0;
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  // Get related products
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.brand === product.brand)
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      addItem(product, quantity);
      setIsAddingToCart(false);
      toast.success("Added to cart!", {
        description: `${product.title} x${quantity}`,
      });
    }, 500);
  };

  const handleToggleComparison = () => {
    if (inComparison) {
      removeProduct(product.id);
      toast.info("Removed from comparison");
    } else if (productIds.length < 4) {
      addProduct(product.id);
      toast.success("Added to comparison", {
        description: "Go to Compare page to see comparison",
        action: {
          label: "Compare",
          onClick: () => router.push("/compare"),
        },
      });
    } else {
      toast.error("Maximum 4 products for comparison");
    }
  };

  // Mock reviews
  const reviews = [
    {
      id: 1,
      user: "John D.",
      rating: 5,
      title: "Excellent product!",
      comment: "Exceeded my expectations. The quality is outstanding.",
      date: "2 days ago",
      helpful: 24,
    },
    {
      id: 2,
      user: "Sarah M.",
      rating: 4,
      title: "Great value",
      comment: "Good product for the price. Fast shipping too.",
      date: "1 week ago",
      helpful: 12,
    },
    {
      id: 3,
      user: "Mike R.",
      rating: 5,
      title: "Highly recommend",
      comment: "Best purchase I've made this year. Works perfectly.",
      date: "2 weeks ago",
      helpful: 45,
    },
  ];

  const ratingBreakdown = [
    { stars: 5, percentage: 75 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 6 },
    { stars: 2, percentage: 3 },
    { stars: 1, percentage: 1 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/products?category=${product.category.toLowerCase()}`}
            className="hover:text-primary"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    -{discount}% OFF
                  </Badge>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <Badge variant="warning">Only {product.stock} left!</Badge>
                )}
              </div>

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage === 0
                          ? product.images.length - 1
                          : selectedImage - 1
                      )
                    }
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage === product.images.length - 1
                          ? 0
                          : selectedImage + 1
                      )
                    }
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0",
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    )}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {product.brand}
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold mb-3">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < Math.floor(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviewCount.toLocaleString('en-US')} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                ${product.price.toLocaleString('en-US')}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.compareAtPrice.toLocaleString('en-US')}
                  </span>
                  <Badge variant="destructive">Save ${(product.compareAtPrice - product.price).toLocaleString('en-US')}</Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground">{product.description}</p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-emerald-500 font-medium">In Stock</span>
                  <span className="text-muted-foreground">({product.stock} available)</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-red-500 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                loading={isAddingToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <Button
                variant={inWishlist ? "default" : "outline"}
                className={cn("flex-1 gap-2", inWishlist && "bg-rose-500 hover:bg-rose-600")}
                onClick={() => {
                  toggleProduct(product.id);
                  toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
                }}
              >
                <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
                {inWishlist ? "In Wishlist" : "Add to Wishlist"}
              </Button>
              <Button
                variant={inComparison ? "default" : "outline"}
                className="flex-1 gap-2"
                onClick={handleToggleComparison}
              >
                <BarChart2 className="h-4 w-4" />
                {inComparison ? "In Compare" : "Add to Compare"}
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {product.freeShipping ? "Free Shipping" : "Fast Shipping"}
                  </p>
                  <p className="text-xs text-muted-foreground">{product.shippingTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Buyer Protection</p>
                  <p className="text-xs text-muted-foreground">Full refund if damaged</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">24/7 Support</p>
                  <p className="text-xs text-muted-foreground">Dedicated help</p>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{product.sellerName}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span>{product.sellerRating}</span>
                    <span className="text-muted-foreground">• Verified Seller</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Visit Store
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="specifications" className="mb-16">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="specifications">
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div
                    key={key}
                    className={cn(
                      "flex justify-between p-4",
                      index % 2 === 0 ? "bg-muted/30" : "bg-card"
                    )}
                  >
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="features">
            <div className="grid md:grid-cols-2 gap-4">
              {product.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Rating Summary */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <div className="text-center mb-6">
                  <p className="text-5xl font-bold text-primary">{product.rating}</p>
                  <div className="flex justify-center my-2">
                    <StarRating value={product.rating} readonly size="lg" />
                  </div>
                  <p className="text-muted-foreground">
                    Based on {product.reviewCount.toLocaleString('en-US')} reviews
                  </p>
                </div>
                <div className="space-y-3">
                  {ratingBreakdown.map((item) => (
                    <div key={item.stars} className="flex items-center gap-3">
                      <span className="text-sm w-12">{item.stars} star</span>
                      <Progress value={item.percentage} className="flex-1" />
                      <span className="text-sm text-muted-foreground w-10">
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 rounded-xl bg-card border border-border"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium">{review.user[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium">{review.user}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <StarRating value={review.rating} readonly size="sm" />
                    </div>
                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-muted-foreground mb-4">{review.comment}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        👍 Helpful ({review.helpful})
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Link href={`/products?category=${product.category.toLowerCase()}`}>
                <Button variant="ghost" className="gap-2">
                  View More
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
