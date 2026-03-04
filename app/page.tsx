"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  Globe,
  Shield,
  BarChart2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product";
import { AnimatedCounter } from "@/components/ui/slider";
import {
  categories,
  featuredProducts,
  dealProducts,
  newArrivals,
  topRated,
} from "@/lib/data";

// Animated particles background - using fixed positions to avoid hydration mismatch
const PARTICLE_POSITIONS = [
  { left: 12, top: 8 }, { left: 85, top: 15 }, { left: 45, top: 22 }, { left: 67, top: 35 },
  { left: 23, top: 42 }, { left: 91, top: 55 }, { left: 34, top: 68 }, { left: 78, top: 75 },
  { left: 56, top: 82 }, { left: 19, top: 91 }, { left: 72, top: 12 }, { left: 38, top: 28 },
  { left: 95, top: 45 }, { left: 8, top: 58 }, { left: 61, top: 71 }, { left: 44, top: 88 },
  { left: 82, top: 38 }, { left: 15, top: 65 }, { left: 53, top: 48 }, { left: 29, top: 18 },
];

function ParticlesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLE_POSITIONS.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-primary/30"
          style={{
            left: `${pos.left}%`,
            top: `${pos.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <ParticlesBackground />
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-sky-500/10 rounded-full blur-[80px]" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="glow" className="mb-6 gap-2">
                <Sparkles className="h-3 w-3" />
                The Future of Shopping is Here
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Buy. Sell. Compare.{" "}
              <span className="gradient-text glow-text">Globally.</span>
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              The world&apos;s leading marketplace with smart product comparison,
              real-time tracking, and millions of products from trusted sellers
              worldwide.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/products">
                <Button size="xl" className="gap-2 glow">
                  Start Shopping
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sell">
                <Button size="xl" variant="outline" className="gap-2">
                  Become a Seller
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary">
                  <AnimatedCounter value={10} suffix="M+" />
                </p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary">
                  <AnimatedCounter value={5} suffix="M+" />
                </p>
                <p className="text-sm text-muted-foreground">Happy Users</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-3xl font-bold text-primary">
                  <AnimatedCounter value={180} suffix="+" />
                </p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="absolute -top-10 -left-10 w-64"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="p-4 rounded-2xl glass border border-border/50 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Sales Up!</p>
                      <p className="text-xs text-emerald-500">+127% this month</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-10 -right-10 w-64"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              >
                <div className="p-4 rounded-2xl glass border border-border/50 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Star className="h-5 w-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Top Rated</p>
                      <p className="text-xs text-amber-500">4.9/5 Average</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="rounded-3xl overflow-hidden border border-border/50 shadow-2xl shadow-primary/10">
                <div className="aspect-square bg-gradient-to-br from-primary/20 via-background to-sky-900/20 p-8 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    {featuredProducts.slice(0, 4).map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="rounded-xl overflow-hidden border border-border/50 bg-card"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full aspect-square object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-2xl font-bold mb-2">Browse Categories</h2>
            <p className="text-muted-foreground">
              Explore millions of products across all categories
            </p>
          </div>
          <Link href="/products">
            <Button variant="ghost" className="gap-2">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/products?category=${category.slug}`}>
                <motion.div
                  className="group flex flex-col items-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <span className="text-4xl mb-3">{category.icon}</span>
                  <h3 className="font-medium text-sm text-center group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.productCount.toLocaleString('en-US')}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  viewAllLink,
  badge,
  badgeVariant = "default",
}: {
  title: string;
  subtitle: string;
  products: typeof featuredProducts;
  viewAllLink: string;
  badge?: string;
  badgeVariant?: "default" | "destructive" | "success" | "warning";
}) {
  return (
    <section className="py-16">
      <div className="container">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4">
            {badge && (
              <Badge variant={badgeVariant} className="gap-1">
                <Zap className="h-3 w-3" />
                {badge}
              </Badge>
            )}
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <Link href={viewAllLink}>
            <Button variant="outline" className="gap-2">
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Marketplace",
      description: "Buy and sell from anywhere in the world with secure international shipping.",
    },
    {
      icon: <BarChart2 className="h-8 w-8" />,
      title: "Smart Comparison",
      description: "Compare products by price, features, ratings, and more to make informed decisions.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure Payments",
      description: "Your payments are protected with bank-level security and buyer protection.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-time Tracking",
      description: "Track your orders in real-time from purchase to delivery at your doorstep.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="outline" className="mb-4">Why WebMart?</Badge>
          <h2 className="text-3xl font-bold mb-4">
            Everything You Need for Smart Shopping
          </h2>
          <p className="text-muted-foreground">
            Experience the future of e-commerce with our powerful features designed to make buying and selling effortless.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all h-full"
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20">
      <div className="container">
        <motion.div
          className="relative rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-sky-500 to-primary" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Selling?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Join millions of sellers worldwide. List your products, reach global customers, and grow your business with WebMart.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sell">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2">
                    Start Selling Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductSection
        title="Featured Products"
        subtitle="Handpicked products just for you"
        products={featuredProducts}
        viewAllLink="/products?sort=featured"
        badge="Featured"
        badgeVariant="default"
      />
      <ProductSection
        title="Flash Deals"
        subtitle="Limited time offers - Don't miss out!"
        products={dealProducts}
        viewAllLink="/products?deals=true"
        badge="Hot Deals"
        badgeVariant="destructive"
      />
      <FeaturesSection />
      <ProductSection
        title="New Arrivals"
        subtitle="Be the first to discover new products"
        products={newArrivals}
        viewAllLink="/products?sort=newest"
        badge="New"
        badgeVariant="success"
      />
      <ProductSection
        title="Top Rated"
        subtitle="Products our customers love"
        products={topRated}
        viewAllLink="/products?sort=rating"
        badge="⭐ Best"
        badgeVariant="warning"
      />
      <CTASection />
    </>
  );
}
