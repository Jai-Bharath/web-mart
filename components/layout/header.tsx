"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  BarChart2,
  Package,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCartStore, useWishlistStore, useComparisonStore, useUIStore } from "@/lib/store";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Header() {
  const { totalItems, toggleCart } = useCartStore();
  const { productIds: wishlistIds } = useWishlistStore();
  const { productIds: comparisonIds, toggleComparison } = useComparisonStore();
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showCategories, setShowCategories] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  // Only access store values after mount to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? totalItems() : 0;
  const wishlistCount = mounted ? wishlistIds.length : 0;
  const comparisonCount = mounted ? comparisonIds.length : 0;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        {/* Top Bar */}
        <div className="hidden lg:block border-b border-border/30">
          <div className="container flex items-center justify-between h-10 text-xs">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>🌍 Free worldwide shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sell" className="text-muted-foreground hover:text-primary transition-colors">
                Become a Seller
              </Link>
              <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <motion.div
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="text-white font-bold text-lg">W</span>
                <div className="absolute inset-0 rounded-xl bg-sky-400/30 blur-lg -z-10" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold gradient-text">WebMart</h1>
                <p className="text-[10px] text-muted-foreground -mt-1">Global Marketplace</p>
              </div>
            </Link>

            {/* Categories Dropdown */}
            <div
              className="hidden lg:block relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <Button variant="ghost" className="gap-2">
                <Menu className="h-4 w-4" />
                Categories
                <ChevronDown className="h-3 w-3" />
              </Button>
              <AnimatePresence>
                {showCategories && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                  >
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                      >
                        <span className="text-xl">{category.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium">{category.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {category.productCount.toLocaleString('en-US')} products
                          </p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <form
                className="w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
                  }
                }}
              >
                <SearchInput
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Mobile Search */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>

              {/* Comparison */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={toggleComparison}
                >
                  <BarChart2 className="h-5 w-5" />
                  {comparisonCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                      {comparisonCount}
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Wishlist */}
              <Link href="/wishlist">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {wishlistCount}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </Link>

              {/* Cart */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={toggleCart}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* User Menu */}
              <div
                className="relative"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-border">
                        <p className="text-sm font-medium">Welcome to WebMart</p>
                        <p className="text-xs text-muted-foreground">Sign in for best experience</p>
                      </div>
                      <div className="py-2">
                        <Link href="/auth/login" className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors">
                          <User className="h-4 w-4" />
                          <span>Sign In</span>
                        </Link>
                        <Link href="/auth/register" className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors">
                          <User className="h-4 w-4" />
                          <span>Create Account</span>
                        </Link>
                        <div className="border-t border-border my-2" />
                        <Link href="/orders" className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors">
                          <Package className="h-4 w-4" />
                          <span>My Orders</span>
                        </Link>
                        <Link href="/seller/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors">
                          <Store className="h-4 w-4" />
                          <span>Seller Dashboard</span>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-card border-r border-border overflow-y-auto lg:hidden"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Menu</h2>
                <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Mobile Search */}
              <div className="p-4">
                <SearchInput
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div className="border-t border-border">
                <p className="px-4 py-3 text-sm text-muted-foreground font-medium">Categories</p>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                    onClick={closeMobileMenu}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>

              {/* Quick Links */}
              <div className="border-t border-border py-4">
                <Link
                  href="/sell"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                  onClick={closeMobileMenu}
                >
                  <Store className="h-5 w-5" />
                  <span>Become a Seller</span>
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors"
                  onClick={closeMobileMenu}
                >
                  <Package className="h-5 w-5" />
                  <span>Track Orders</span>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
