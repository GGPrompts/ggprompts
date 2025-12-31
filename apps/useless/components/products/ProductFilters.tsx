"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@ggprompts/ui";
import { RadioGroup, RadioGroupItem } from "@ggprompts/ui";
import { Checkbox } from "@ggprompts/ui";
import { Slider } from "@ggprompts/ui";
import { Switch } from "@ggprompts/ui";
import { Button } from "@ggprompts/ui";
import { Star, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@ggprompts/ui";

export interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  maxPrice?: number;
}

export function ProductFilters({ categories, brands, maxPrice = 1000 }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get("brands")?.split(",").filter(Boolean) || []
  );
  const [priceRange, setPriceRange] = useState<number[]>([
    parseFloat(searchParams.get("minPrice") || "0"),
    parseFloat(searchParams.get("maxPrice") || maxPrice.toString()),
  ]);
  const [minRating, setMinRating] = useState<number>(
    parseFloat(searchParams.get("minRating") || "0")
  );
  const [inStockOnly, setInStockOnly] = useState(searchParams.get("inStock") === "true");

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }

    if (selectedBrands.length > 0) {
      params.set("brands", selectedBrands.join(","));
    }

    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString());
    }

    if (priceRange[1] < maxPrice) {
      params.set("maxPrice", priceRange[1].toString());
    }

    if (minRating > 0) {
      params.set("minRating", minRating.toString());
    }

    if (inStockOnly) {
      params.set("inStock", "true");
    }

    const search = params.toString();
    router.push(search ? `/products?${search}` : "/products");
  }, [selectedCategory, selectedBrands, priceRange, minRating, inStockOnly, maxPrice, router]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSelectedBrands([]);
    setPriceRange([0, maxPrice]);
    setMinRating(0);
    setInStockOnly(false);
    router.push("/products");
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    minRating > 0 ||
    inStockOnly;

  return (
    <div className="glass rounded-lg p-6 space-y-6 sticky top-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold terminal-glow">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Category</Label>
        <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="cat-all" />
            <Label htmlFor="cat-all" className="cursor-pointer font-normal">
              All Categories
            </Label>
          </div>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <RadioGroupItem value={category} id={`cat-${category}`} />
              <Label htmlFor={`cat-${category}`} className="cursor-pointer font-normal capitalize">
                {category.replace(/-/g, " ")}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Brand</Label>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
                />
                <Label htmlFor={`brand-${brand}`} className="cursor-pointer font-normal">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Label>
        <Slider
          min={0}
          max={maxPrice}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-2"
        />
      </div>

      {/* Rating Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Minimum Rating</Label>
        <div className="space-y-2">
          {[4, 3, 2, 1, 0].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(rating)}
              className={cn(
                "flex items-center gap-2 w-full p-2 rounded-md transition-colors",
                minRating === rating
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-muted/50 text-muted-foreground"
              )}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < rating ? "fill-primary text-primary" : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
              {rating > 0 ? `${rating}+ Stars` : "All Ratings"}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Filter */}
      <div className="flex items-center justify-between">
        <Label htmlFor="in-stock" className="text-sm font-medium">
          In Stock Only
        </Label>
        <Switch id="in-stock" checked={inStockOnly} onCheckedChange={setInStockOnly} />
      </div>
    </div>
  );
}
