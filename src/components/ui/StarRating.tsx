import React from "react";
import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  className?: string;
  showText?: boolean;
  totalReviews?: number;
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 16,
  className = "",
  showText = false,
  totalReviews,
}: StarRatingProps) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < maxStars; i++) {
    if (i < fullStars) {
      stars.push(
        <Star
          key={i}
          size={size}
          className="fill-[var(--color-saffron-500)] text-[var(--color-saffron-500)]"
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star size={size} className="text-gray-300 dark:text-gray-600" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={size} className="fill-[var(--color-saffron-500)] text-[var(--color-saffron-500)]" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star
          key={i}
          size={size}
          className="text-gray-300 dark:text-gray-600"
        />
      );
    }
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex">{stars}</div>
      {showText && (
        <span className="text-sm font-medium text-[var(--color-mandir-text-muted)] mt-0.5">
          {rating.toFixed(1)} {totalReviews !== undefined && `(${totalReviews} reviews)`}
        </span>
      )}
    </div>
  );
}
