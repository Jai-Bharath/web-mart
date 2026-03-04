"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  Clock,
  Search,
  ChevronRight,
  Box,
  Building,
  Plane,
  Home,
  PartyPopper,
  RefreshCw,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, SearchInput } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock order data
const mockOrders = [
  {
    id: "WM-ABC123XYZ",
    date: "2024-01-15",
    total: 1299.99,
    status: "delivered",
    items: [
      { name: "iPhone 15 Pro", quantity: 1, price: 1199.99, image: "https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=200" },
      { name: "Premium Case", quantity: 1, price: 49.99, image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200" },
    ],
    tracking: [
      { status: "Order Placed", date: "Jan 15, 2024 10:30 AM", location: "Online", completed: true, icon: Box },
      { status: "Order Confirmed", date: "Jan 15, 2024 11:00 AM", location: "WebMart Warehouse", completed: true, icon: CheckCircle2 },
      { status: "Shipped", date: "Jan 16, 2024 2:00 PM", location: "Los Angeles, CA", completed: true, icon: Building },
      { status: "In Transit", date: "Jan 17, 2024 8:00 AM", location: "Phoenix, AZ", completed: true, icon: Truck },
      { status: "Out for Delivery", date: "Jan 18, 2024 6:00 AM", location: "Local Facility", completed: true, icon: Plane },
      { status: "Delivered", date: "Jan 18, 2024 2:30 PM", location: "Your Address", completed: true, icon: Home },
    ],
  },
  {
    id: "WM-DEF456UVW",
    date: "2024-01-20",
    total: 599.99,
    status: "in-transit",
    items: [
      { name: 'MacBook Air M2 13"', quantity: 1, price: 599.99, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200" },
    ],
    tracking: [
      { status: "Order Placed", date: "Jan 20, 2024 3:15 PM", location: "Online", completed: true, icon: Box },
      { status: "Order Confirmed", date: "Jan 20, 2024 4:00 PM", location: "WebMart Warehouse", completed: true, icon: CheckCircle2 },
      { status: "Shipped", date: "Jan 21, 2024 10:00 AM", location: "San Francisco, CA", completed: true, icon: Building },
      { status: "In Transit", date: "Jan 22, 2024 9:00 AM", location: "Denver, CO", completed: true, current: true, icon: Truck },
      { status: "Out for Delivery", date: "Estimated", location: "Pending", completed: false, icon: Plane },
      { status: "Delivered", date: "Estimated Jan 24", location: "Your Address", completed: false, icon: Home },
    ],
  },
];

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TrackPageContent />
    </Suspense>
  );
}

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [trackedOrder, setTrackedOrder] = React.useState<(typeof mockOrders)[0] | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);

  // Auto-search if order ID is in URL
  React.useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId) {
      setSearchQuery(urlId.toUpperCase());
      const order = mockOrders.find(
        (o) => o.id.toLowerCase() === urlId.toLowerCase()
      );
      if (order) {
        setTrackedOrder(order);
      }
    }
  }, [searchParams]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter an order ID");
      return;
    }

    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const order = mockOrders.find(
      (o) => o.id.toLowerCase() === searchQuery.toLowerCase()
    );
    
    if (order) {
      setTrackedOrder(order);
      toast.success("Order found!");
    } else {
      toast.error("Order not found. Try: WM-ABC123XYZ or WM-DEF456UVW");
      setTrackedOrder(null);
    }
    setIsSearching(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "in-transit":
        return "bg-blue-500/10 text-blue-500 border-blue-500/30";
      case "shipped":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "processing":
        return "bg-purple-500/10 text-purple-500 border-purple-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "in-transit":
        return "In Transit";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      default:
        return status;
    }
  };

  const copyOrderId = () => {
    if (trackedOrder) {
      navigator.clipboard.writeText(trackedOrder.id);
      toast.success("Order ID copied!");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter your order ID to track your shipment in real-time.
            </p>
          </motion.div>
        </div>

        {/* Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto mb-12"
        >
          <Card className="p-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Enter Order ID (e.g., WM-ABC123XYZ)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  leftIcon={<Package className="h-4 w-4" />}
                  className="text-lg"
                />
              </div>
              <Button
                size="lg"
                onClick={handleSearch}
                loading={isSearching}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Track
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Demo IDs: <code className="text-primary">WM-ABC123XYZ</code>,{" "}
              <code className="text-primary">WM-DEF456UVW</code>
            </p>
          </Card>
        </motion.div>

        {/* Order Details */}
        {trackedOrder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Order Header */}
            <Card className="p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold">{trackedOrder.id}</h2>
                    <button
                      onClick={copyOrderId}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <Badge className={getStatusColor(trackedOrder.status)}>
                      {getStatusLabel(trackedOrder.status)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Ordered on {new Date(trackedOrder.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Order Total</p>
                  <p className="text-2xl font-bold text-primary">
                    ${trackedOrder.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid lg:grid-cols-5 gap-6">
              {/* Tracking Timeline */}
              <div className="lg:col-span-3">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Tracking History
                    </h3>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  </div>

                  <div className="relative">
                    {trackedOrder.tracking.map((step, index) => (
                      <div
                        key={index}
                        className="flex gap-4 pb-8 last:pb-0"
                      >
                        {/* Timeline Line */}
                        <div className="relative">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center z-10 relative",
                              step.completed
                                ? step.current
                                  ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                                  : "bg-emerald-500 text-white"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {step.completed && !step.current ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              <step.icon className="h-5 w-5" />
                            )}
                          </div>
                          {index < trackedOrder.tracking.length - 1 && (
                            <div
                              className={cn(
                                "absolute left-1/2 top-10 w-0.5 h-full -translate-x-1/2",
                                trackedOrder.tracking[index + 1].completed
                                  ? "bg-emerald-500"
                                  : "bg-muted"
                              )}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p
                                className={cn(
                                  "font-medium",
                                  step.current && "text-primary"
                                )}
                              >
                                {step.status}
                                {step.current && (
                                  <Badge className="ml-2 bg-primary/10 text-primary">
                                    Current
                                  </Badge>
                                )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {step.location}
                              </p>
                            </div>
                            <p
                              className={cn(
                                "text-sm",
                                step.completed
                                  ? "text-muted-foreground"
                                  : "text-muted-foreground/50"
                              )}
                            >
                              {step.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Order Items */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Order Items
                  </h3>

                  <div className="space-y-4">
                    {trackedOrder.items.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                          <p className="font-medium text-primary">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border mt-4 pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${(trackedOrder.total * 0.92).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-emerald-500">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>${(trackedOrder.total * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-3 pt-3 border-t border-border">
                      <span>Total</span>
                      <span className="text-primary">${trackedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>

                {/* Delivery Info */}
                {trackedOrder.status === "delivered" && (
                  <Card className="p-6 mt-4 bg-emerald-500/5 border-emerald-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <PartyPopper className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-500">Delivered!</p>
                        <p className="text-sm text-muted-foreground">
                          Your order has been delivered successfully.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Actions */}
                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Invoice
                  </Button>
                  <Link href="/products" className="block">
                    <Button variant="ghost" className="w-full gap-2">
                      Continue Shopping
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Orders (if no search) */}
        {!trackedOrder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-xl font-semibold mb-4">Demo Orders</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {mockOrders.map((order) => (
                <Card
                  key={order.id}
                  className="p-4 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => {
                    setSearchQuery(order.id);
                    setTrackedOrder(order);
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{order.id}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <img
                        key={i}
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                    <span className="font-medium">${order.total.toFixed(2)}</span>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
