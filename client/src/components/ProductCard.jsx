import React from "react";
import { Link } from "../hooks/useRouter.jsx";
import { Star, Heart, ShoppingBag, Eye } from "lucide-react";

/**
 * ProductCard Component
 * Displays a single product in a grid/list view
 * Props are structured for easy backend integration
 */
const ProductCard = ({
  id,
  name,
  brand,
  price,
  originalPrice,
  rating,
  reviewCount,
  thumbnail,
  images = [],
  isNew,
  isBestseller,
  inStock,
  colors = [],
  className = "",
  index = 0,
}) => {
  const discount = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : null;
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    // TODO: Integrate with backend favorites API
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Integrate with backend cart API
  };

  return (
    <Link href={`/product/${id}`} className="block group">
      <article
        className={`relative rounded-2xl bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden animate-fade-in ${className}`}
        style={{
          animationDelay: `${index * 100}ms`,
          animationFillMode: "backwards",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {/* Main Image */}
          <img
            src={thumbnail}
            alt={name}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
              isHovered && images.length > 1
                ? "opacity-0 scale-110"
                : "opacity-100 scale-100"
            }`}
          />

          {/* Hover Image */}
          {images.length > 1 && (
            <img
              src={images[1]}
              alt={`${name} alternate view`}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
            />
          )}

          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="px-3 py-1.5 text-xs font-bold bg-neutral-900 text-white rounded-full shadow-lg animate-bounce-in">
                NEW
              </span>
            )}
            {isBestseller && (
              <span className="px-3 py-1.5 text-xs font-bold bg-neutral-900 text-white rounded-full shadow-lg">
                🔥 BESTSELLER
              </span>
            )}
            {discount && (
              <span className="px-3 py-1.5 text-xs font-bold bg-rose-500 text-white rounded-full shadow-lg">
                -{discount}%
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 ${
              isHovered || isFavorite
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={`h-5 w-5 transition-all duration-300 ${
                isFavorite
                  ? "fill-rose-500 text-rose-500 scale-110"
                  : "text-neutral-600 hover:text-rose-500"
              }`}
            />
          </button>

          {/* Out of Stock Overlay */}
          {!inStock && (
            <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-sm flex items-center justify-center">
              <span className="px-6 py-3 bg-white text-neutral-900 font-bold text-sm rounded-full">
                OUT OF STOCK
              </span>
            </div>
          )}

          {/* Quick Actions - Shows on Hover */}
          <div
            className={`absolute bottom-4 left-4 right-4 flex gap-2 transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-400 text-black font-bold text-sm rounded-xl hover:bg-yellow-500 transition-colors shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              className="p-3 bg-white text-neutral-700 rounded-xl hover:bg-neutral-100 transition-colors shadow-lg"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Brand */}
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
            {brand}
          </p>

          {/* Name */}
          <h3 className="text-base font-bold text-neutral-900 line-clamp-2 group-hover:text-amber-600 transition-colors mb-2">
            {name}
          </h3>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-neutral-200 text-neutral-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-neutral-500">
                ({reviewCount})
              </span>
            </div>
          )}

          {/* Price Row */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold text-neutral-900">
              ₹{price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-neutral-400 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
            {discount && (
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                Save ₹{(originalPrice - price).toFixed(0)}
              </span>
            )}
          </div>

          {/* Color Options */}
          {colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Colors:</span>
              <div className="flex items-center gap-1.5">
                {colors.slice(0, 5).map((color, index) => (
                  <span
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-md transition-transform hover:scale-125"
                    style={{ backgroundColor: getColorHex(color) }}
                    title={color}
                  />
                ))}
                {colors.length > 5 && (
                  <span className="text-xs font-medium text-neutral-500 ml-1">
                    +{colors.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

// Helper function to convert color names to hex
function getColorHex(colorName) {
  const colorMap = {
    black: "#1a1a1a",
    white: "#FFFFFF",
    navy: "#1a365d",
    red: "#dc2626",
    blue: "#2563eb",
    green: "#16a34a",
    brown: "#78350f",
    pink: "#ec4899",
    beige: "#d4b896",
    coral: "#ff7f50",
    mint: "#98ff98",
    "neon-yellow": "#ccff00",
    lavender: "#e6e6fa",
    cream: "#fffdd0",
    grey: "#6b7280",
    gray: "#6b7280",
    sage: "#9dc183",
    blush: "#de5d83",
    charcoal: "#36454f",
    burgundy: "#800020",
    "black-gold": "#1a1a1a",
    "white-red": "#FFFFFF",
    canvas: "#f5f5dc",
  };
  return colorMap[colorName.toLowerCase()] || "#cccccc";
}

export default ProductCard;
