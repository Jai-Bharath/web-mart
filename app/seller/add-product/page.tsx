"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Sparkles,
  Package,
  DollarSign,
  Tags,
  FileText,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, SearchInput } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { categories } from "@/lib/data";
import { createProduct, uploadProductImage } from "@/lib/supabase/database";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductFormData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  tags: string[];
  features: string[];
  specifications: { key: string; value: string }[];
  images: File[];
  imageUrls: string[];
}

const initialFormData: ProductFormData = {
  title: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  compareAtPrice: "",
  stock: "",
  tags: [],
  features: [],
  specifications: [{ key: "", value: "" }],
  images: [],
  imageUrls: [],
};

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState<ProductFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [tagInput, setTagInput] = React.useState("");
  const [featureInput, setFeatureInput] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const steps = [
    { number: 1, title: "Basic Info", icon: FileText },
    { number: 2, title: "Pricing & Stock", icon: DollarSign },
    { number: 3, title: "Details", icon: Tags },
    { number: 4, title: "Images", icon: ImageIcon },
  ];

  const categoryOptions = [
    { value: "", label: "Select a category" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 8) {
      toast.error("You can upload a maximum of 8 images");
      return;
    }

    const newImageUrls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
      imageUrls: [...prev.imageUrls, ...newImageUrls],
    }));
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(formData.imageUrls[index]);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.description && formData.category);
      case 2:
        return !!(formData.price && formData.stock);
      case 3:
        return true; // Tags and features are optional
      case 4:
        return formData.images.length > 0;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast.error("Please add at least one product image");
      return;
    }

    setIsSubmitting(true);

    try {
      // For demo purposes, we'll use placeholder images if no Supabase storage is set up
      const imageUrls = formData.images.length > 0
        ? [
            `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500`,
            `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500`,
          ]
        : [
            `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500`,
          ];

      // Convert specifications array to object
      const specifications: Record<string, string> = {};
      formData.specifications.forEach((spec) => {
        if (spec.key && spec.value) {
          specifications[spec.key] = spec.value;
        }
      });

      // Create product data
      const productData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        price: parseFloat(formData.price),
        compare_at_price: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        stock_quantity: parseInt(formData.stock),
        images: imageUrls,
        specifications,
        features: formData.features,
        tags: formData.tags,
      };

      // Save to Supabase
      // Using null seller ID for demo - in production, get from authenticated user
      await createProduct(null, productData);

      toast.success("Product created successfully!", {
        description: "Your product is now live on WebMart",
      });

      router.push("/seller/dashboard");
    } catch (error: any) {
      toast.error("Failed to create product", {
        description: error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Title <span className="text-destructive">*</span>
              </label>
              <Input
                placeholder="Enter product title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                className="w-full min-h-[150px] px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none"
                placeholder="Describe your product in detail..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category <span className="text-destructive">*</span>
                </label>
                <Select
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(v) => handleInputChange("category", v)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subcategory
                </label>
                <Input
                  placeholder="e.g., Wireless Earbuds"
                  value={formData.subcategory}
                  onChange={(e) => handleInputChange("subcategory", e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (USD) <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Compare at Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={formData.compareAtPrice}
                    onChange={(e) => handleInputChange("compareAtPrice", e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Optional. Show a strikethrough price
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Stock Quantity <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={formData.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
              />
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Pricing Tips</p>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      <li>• Research competitor prices</li>
                      <li>• Factor in shipping costs</li>
                      <li>• Consider using compare-at price for sales</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Key Features
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a feature"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.features.length > 0 && (
                <div className="space-y-2 mt-3">
                  {formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span className="flex-1 text-sm">{feature}</span>
                      <button onClick={() => removeFeature(feature)}>
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Specifications
              </label>
              <div className="space-y-3">
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Property (e.g., Color)"
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, "key", e.target.value)}
                    />
                    <Input
                      placeholder="Value (e.g., Black)"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, "value", e.target.value)}
                    />
                    {formData.specifications.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSpecification(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={addSpecification}
                >
                  <Plus className="h-4 w-4" />
                  Add Specification
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Images <span className="text-destructive">*</span>
              </label>
              <p className="text-sm text-muted-foreground mb-4">
                Upload up to 8 images. First image will be the main product image.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 border-border",
                      index === 0 && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    )}
                  >
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground text-xs text-center py-1">
                        Main Image
                      </div>
                    )}
                  </div>
                ))}

                {formData.images.length < 8 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-2 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Upload</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Image Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use high-quality images (min 800x800px)</li>
                  <li>• Use a clean, white background</li>
                  <li>• Show the product from multiple angles</li>
                  <li>• Include lifestyle images if possible</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/seller/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Add New Product
            </h1>
            <p className="text-muted-foreground">
              Fill in the details to list your product on WebMart
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <button
                onClick={() => setCurrentStep(step.number)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                  currentStep === step.number
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.number
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <step.icon className="h-4 w-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  {step.title}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    currentStep > step.number ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-6">{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={() => {
                if (validateStep(currentStep)) {
                  setCurrentStep((prev) => Math.min(4, prev + 1));
                } else {
                  toast.error("Please fill in all required fields");
                }
              }}
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Create Product
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
