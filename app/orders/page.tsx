"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Eye,
  RotateCcw,
  Star,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Demo orders data
const demoOrders = [
  {
    id: "WM-ABC123XYZ",
    date: "2026-02-28",
    total: 1249.98,
    status: "delivered",
    items: [
      {
        name: "Apple iPhone 15 Pro Max 256GB",
        quantity: 1,
        price: 1199.99,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200",
      },
      {
        name: "Premium Silicone Case",
        quantity: 1,
        price: 49.99,
        image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200",
      },
    ],
    deliveredDate: "Mar 2, 2026",
  },
  {
    id: "WM-DEF456UVW",
    date: "2026-03-01",
    total: 3499.00,
    status: "in-transit",
    items: [
      {
        name: "MacBook Pro 16\" M3 Max",
        quantity: 1,
        price: 3499.00,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
      },
    ],
    estimatedDelivery: "Mar 7, 2026",
  },
  {
    id: "WM-GHI789RST",
    date: "2026-03-03",
    total: 428.00,
    status: "processing",
    items: [
      {
        name: "Sony WH-1000XM5 Headphones",
        quantity: 1,
        price: 349.00,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcf?w=200",
      },
      {
        name: "Levi's 501 Original Fit Jeans",
        quantity: 1,
        price: 79.00,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200",
      },
    ],
    estimatedDelivery: "Mar 10, 2026",
  },
  {
    id: "WM-JKL012MNO",
    date: "2026-01-20",
    total: 180.00,
    status: "cancelled",
    items: [
      {
        name: "Nike Air Jordan 1 Retro High OG",
        quantity: 1,
        price: 180.00,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
      },
    ],
  },
  {
    id: "WM-PQR345STU",
    date: "2026-02-14",
    total: 648.00,
    status: "delivered",
    items: [
      {
        name: "Apple AirPods Pro (2nd Gen)",
        quantity: 1,
        price: 249.00,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200",
      },
      {
        name: "Bose QuietComfort Ultra",
        quantity: 1,
        price: 399.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200",
      },
    ],
    deliveredDate: "Feb 18, 2026",
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  processing: {
    label: "Processing",
    color: "bg-purple-500/10 text-purple-500 border-purple-500/30",
    icon: Clock,
  },
  "in-transit": {
    label: "In Transit",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500/10 text-red-500 border-red-500/30",
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState<string>("all");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const filteredOrders = activeTab === "all"
    ? demoOrders
    : demoOrders.filter((o) => o.status === activeTab);

  const tabs = [
    { id: "all", label: "All Orders", count: demoOrders.length },
    { id: "processing", label: "Processing", count: demoOrders.filter((o) => o.status === "processing").length },
    { id: "in-transit", label: "In Transit", count: demoOrders.filter((o) => o.status === "in-transit").length },
    { id: "delivered", label: "Delivered", count: demoOrders.filter((o) => o.status === "delivered").length },
    { id: "cancelled", label: "Cancelled", count: demoOrders.filter((o) => o.status === "cancelled").length },
  ];

  if (!mounted) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-xl mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Sign In to View Orders</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view your order history and track your deliveries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="gap-2 w-full">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" variant="outline" className="gap-2 w-full">
                  Create Account
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            My Orders
          </h1>
          <p className="text-muted-foreground">
            View and manage your order history
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs",
                    activeTab === tab.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-background"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
            <p className="text-muted-foreground mb-6">
              No orders match the selected filter.
            </p>
            <Link href="/products">
              <Button className="gap-2">
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden">
                    {/* Order Header */}
                    <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/30">
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Order: </span>
                          <span className="font-medium">{order.id}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date: </span>
                          <span>{new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total: </span>
                          <span className="font-semibold text-primary">
                            ${order.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      <Badge className={cn("gap-1.5 border", status.color)}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </Badge>
                    </div>

                    {/* Order Items */}
                    <div className="p-4">
                      <div className="space-y-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium text-sm">
                              ${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Status Info & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t border-border gap-3">
                        <div className="text-sm text-muted-foreground">
                          {order.status === "delivered" && (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              Delivered on {(order as any).deliveredDate}
                            </span>
                          )}
                          {order.status === "in-transit" && (
                            <span className="flex items-center gap-1">
                              <Truck className="h-4 w-4 text-blue-500" />
                              Est. delivery: {(order as any).estimatedDelivery}
                            </span>
                          )}
                          {order.status === "processing" && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-purple-500" />
                              Est. delivery: {(order as any).estimatedDelivery}
                            </span>
                          )}
                          {order.status === "cancelled" && (
                            <span className="flex items-center gap-1">
                              <XCircle className="h-4 w-4 text-red-500" />
                              Order was cancelled
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {(order.status === "in-transit" || order.status === "processing") && (
                            <Link href={`/track?id=${order.id}`}>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Truck className="h-3.5 w-3.5" />
                                Track
                              </Button>
                            </Link>
                          )}
                          {order.status === "delivered" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => toast.info("Review feature coming soon!")}
                              >
                                <Star className="h-3.5 w-3.5" />
                                Review
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                onClick={() => toast.info("Reorder placed!")}
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reorder
                              </Button>
                            </>
                          )}
                          {order.status === "cancelled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => toast.info("Reorder placed!")}
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
