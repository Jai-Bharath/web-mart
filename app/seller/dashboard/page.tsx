"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  BarChart3,
  ArrowUpRight,
  ChevronRight,
  Settings,
  Bell,
  Store,
  Layers,
  Tag,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input, SearchInput } from "@/components/ui/input";
import { Progress } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock data for seller dashboard
const stats = [
  {
    title: "Total Revenue",
    value: "$124,567.89",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Orders",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "56",
    change: "+3 new",
    trend: "up",
    icon: Package,
  },
  {
    title: "Customers",
    value: "892",
    change: "+15.3%",
    trend: "up",
    icon: Users,
  },
];

const recentOrders = [
  {
    id: "WM-ORD001",
    customer: "John Smith",
    product: "iPhone 15 Pro",
    amount: 1199.99,
    status: "delivered",
    date: "2024-01-20",
  },
  {
    id: "WM-ORD002",
    customer: "Sarah Johnson",
    product: "MacBook Air M2",
    amount: 1299.99,
    status: "shipped",
    date: "2024-01-20",
  },
  {
    id: "WM-ORD003",
    customer: "Mike Davis",
    product: "AirPods Pro 2",
    amount: 249.99,
    status: "processing",
    date: "2024-01-19",
  },
  {
    id: "WM-ORD004",
    customer: "Emily Brown",
    product: "iPad Pro 12.9",
    amount: 1099.99,
    status: "pending",
    date: "2024-01-19",
  },
  {
    id: "WM-ORD005",
    customer: "Chris Wilson",
    product: "Apple Watch Ultra",
    amount: 799.99,
    status: "cancelled",
    date: "2024-01-18",
  },
];

const myProducts = [
  {
    id: "1",
    title: "iPhone 15 Pro Max",
    price: 1199.99,
    stock: 45,
    sold: 234,
    rating: 4.9,
    status: "active",
    image: "https://images.unsplash.com/photo-1696446702183-cbd13d78e1e7?w=200",
  },
  {
    id: "2",
    title: "MacBook Pro 16\" M3",
    price: 2499.99,
    stock: 12,
    sold: 89,
    rating: 4.8,
    status: "active",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200",
  },
  {
    id: "3",
    title: "AirPods Pro 2nd Gen",
    price: 249.99,
    stock: 0,
    sold: 456,
    rating: 4.7,
    status: "out-of-stock",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=200",
  },
  {
    id: "4",
    title: "Apple Watch Series 9",
    price: 399.99,
    stock: 78,
    sold: 167,
    rating: 4.6,
    status: "active",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=200",
  },
];

const topProducts = [
  { name: "iPhone 15 Pro Max", sales: 234, revenue: 280566 },
  { name: "MacBook Pro 16\"", sales: 89, revenue: 222491 },
  { name: "AirPods Pro 2", sales: 456, revenue: 113996 },
  { name: "Apple Watch Series 9", sales: 167, revenue: 66799 },
  { name: "iPad Pro 12.9\"", sales: 78, revenue: 85799 },
];

export default function SellerDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "default";
      case "processing":
        return "warning";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return CheckCircle2;
      case "shipped":
        return Truck;
      case "processing":
        return Clock;
      case "pending":
        return Clock;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              Seller Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s your store overview.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button className="gap-2" onClick={() => router.push("/seller/add-product")}>
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm mt-2",
                        stat.trend === "up" ? "text-emerald-500" : "text-red-500"
                      )}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Orders & Products */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                    Recent Orders
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-muted-foreground border-b border-border">
                        <th className="pb-3 font-medium">Order ID</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium hidden sm:table-cell">Product</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        return (
                          <tr
                            key={order.id}
                            className="border-b border-border/50 last:border-0"
                          >
                            <td className="py-4">
                              <span className="font-medium">{order.id}</span>
                            </td>
                            <td className="py-4">{order.customer}</td>
                            <td className="py-4 hidden sm:table-cell text-muted-foreground">
                              {order.product}
                            </td>
                            <td className="py-4 font-medium">
                              ${order.amount.toFixed(2)}
                            </td>
                            <td className="py-4">
                              <Badge variant={getStatusColor(order.status)} className="gap-1">
                                <StatusIcon className="h-3 w-3" />
                                {order.status}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* My Products */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    My Products
                  </CardTitle>
                  <div className="flex gap-2">
                    <SearchInput placeholder="Search products..." className="w-48" />
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">{product.title}</h4>
                          <Badge
                            variant={
                              product.status === "active" ? "success" : "warning"
                            }
                          >
                            {product.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            ${product.price}
                          </span>
                          <span>Stock: {product.stock}</span>
                          <span>Sold: {product.sold}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            {product.rating}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full gap-2" onClick={() => router.push("/seller/add-product")}>
                  <Plus className="h-4 w-4" />
                  Add New Product
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Analytics */}
          <div className="space-y-6">
            {/* Sales Chart */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Sales Overview
                </h3>
                <Button variant="ghost" size="sm">
                  This Week
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              {/* Simple Chart Visualization */}
              <div className="space-y-4">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day, index) => {
                    const height = [65, 45, 80, 55, 90, 75, 60][index];
                    return (
                      <div key={day} className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-8">
                          {day}
                        </span>
                        <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${height}%` }}
                            transition={{ delay: index * 0.1 }}
                          />
                        </div>
                        <span className="text-sm font-medium w-16 text-right">
                          ${(height * 150).toLocaleString('en-US')}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </Card>

            {/* Top Products */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Top Products
              </h3>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-3">
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                        index === 0
                          ? "bg-amber-500/20 text-amber-500"
                          : index === 1
                          ? "bg-slate-400/20 text-slate-400"
                          : index === 2
                          ? "bg-amber-700/20 text-amber-700"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sales} sold
                      </p>
                    </div>
                    <span className="font-medium text-primary">
                      ${product.revenue.toLocaleString('en-US')}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto flex-col gap-2 py-4" onClick={() => router.push("/seller/add-product")}>
                  <Package className="h-5 w-5" />
                  <span className="text-sm">Add Product</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Tag className="h-5 w-5" />
                  <span className="text-sm">Create Sale</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Layers className="h-5 w-5" />
                  <span className="text-sm">Manage Stock</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">Analytics</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
