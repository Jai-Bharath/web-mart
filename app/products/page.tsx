"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, MultiSelect } from "@/components/ui/select";
import { RangeSlider, StarRating } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/tabs";
import { ProductCard, ProductCardSkeleton } from "@/components/product";
import { categories, brands, filterProducts, products } from "@/lib/data";
import { useFilterStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    search,
    category,
    brands: selectedBrands,
    priceRange,
    rating,
    freeShipping,
    inStock,
    sortBy,
    setSearch,
    setCategory,
    setBrands,
    setPriceRange,
    setRating,
    setFreeShipping,
    setInStock,
    setSortBy,
    resetFilters,
  } = useFilterStore();

  // Initialize from URL params
  React.useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");
    const urlSort = searchParams.get("sort");

    if (urlCategory) setCategory(urlCategory);
    if (urlSearch) setSearch(urlSearch);
    if (urlSort) setSortBy(urlSort as any);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  }, [searchParams, setCategory, setSearch, setSortBy]);

  // Filter products
  const filteredProducts = React.useMemo(() => {
    return filterProducts({
      search,
      category,
      brands: selectedBrands,
      priceRange,
      rating,
      freeShipping,
      inStock,
      sortBy,
    });
  }, [search, category, selectedBrands, priceRange, rating, freeShipping, inStock, sortBy]);

  const activeFiltersCount = [
    category,
    selectedBrands.length > 0,
    priceRange[0] > 0 || priceRange[1] < 100000,
    rating > 0,
    freeShipping,
    inStock,
  ].filter(Boolean).length;

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
    { value: "bestselling", label: "Best Selling" },
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: c.slug, label: c.name, icon: <span>{c.icon}</span> })),
  ];

  const brandOptions = brands.map((b) => ({ value: b, label: b }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {category
                  ? categories.find((c) => c.slug === category)?.name || "Products"
                  : search
                  ? `Results for "${search}"`
                  : "All Products"}
              </h1>
              <p className="text-muted-foreground">
                {filteredProducts.length.toLocaleString('en-US')} products found
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-muted">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={(v) => setSortBy(v as any)}
                className="w-44"
              />

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                className="lg:hidden gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="default" className="h-5 w-5 p-0 justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="text-sm text-muted-foreground">Active filters:</span>
              
              {category && (
                <Badge variant="secondary" className="gap-1">
                  {categories.find((c) => c.slug === category)?.name}
                  <button onClick={() => setCategory("")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {selectedBrands.map((brand) => (
                <Badge key={brand} variant="secondary" className="gap-1">
                  {brand}
                  <button onClick={() => setBrands(selectedBrands.filter((b) => b !== brand))}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                <Badge variant="secondary" className="gap-1">
                  ${priceRange[0].toLocaleString('en-US')} - ${priceRange[1].toLocaleString('en-US')}
                  <button onClick={() => setPriceRange([0, 10000])}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {rating > 0 && (
                <Badge variant="secondary" className="gap-1">
                  {rating}+ Stars
                  <button onClick={() => setRating(0)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {freeShipping && (
                <Badge variant="secondary" className="gap-1">
                  Free Shipping
                  <button onClick={() => setFreeShipping(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {inStock && (
                <Badge variant="secondary" className="gap-1">
                  In Stock
                  <button onClick={() => setInStock(false)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={resetFilters}
              >
                Clear All
              </Button>
            </motion.div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ opacity: 0, x: -20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -20, width: 0 }}
                className="hidden lg:block w-64 shrink-0"
              >
                <div className="sticky top-24 space-y-6">
                  {/* Search */}
                  <div>
                    <h3 className="font-medium mb-3">Search</h3>
                    <SearchInput
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <h3 className="font-medium mb-3">Category</h3>
                    <Select
                      options={categoryOptions}
                      value={category}
                      onChange={setCategory}
                    />
                  </div>

                  {/* Brands */}
                  <div>
                    <h3 className="font-medium mb-3">Brands</h3>
                    <MultiSelect
                      options={brandOptions}
                      value={selectedBrands}
                      onChange={setBrands}
                      placeholder="Select brands..."
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <RangeSlider
                      min={0}
                      max={10000}
                      value={priceRange}
                      onChange={setPriceRange}
                      step={50}
                      formatLabel={(v) => `$${v.toLocaleString('en-US')}`}
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="font-medium mb-3">Minimum Rating</h3>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((r) => (
                        <button
                          key={r}
                          className={cn(
                            "flex items-center gap-2 w-full p-2 rounded-lg transition-colors",
                            rating === r ? "bg-primary/10 text-primary" : "hover:bg-muted"
                          )}
                          onClick={() => setRating(rating === r ? 0 : r)}
                        >
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < r ? "text-amber-400 fill-amber-400" : "text-muted"
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm">& Up</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Free Shipping</span>
                      <Toggle checked={freeShipping} onChange={setFreeShipping} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">In Stock Only</span>
                      <Toggle checked={inStock} onChange={setInStock} />
                    </div>
                  </div>

                  {/* Reset */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                  <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Try adjusting your filters or search query to find what you&apos;re looking for.
                </p>
                <Button onClick={resetFilters}>Clear All Filters</Button>
              </motion.div>
            ) : (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {filteredProducts.slice(0, 60).map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredProducts.length > 60 && (
              <div className="flex justify-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
