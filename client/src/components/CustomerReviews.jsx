import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Star, BadgeCheck } from "lucide-react";

/**
 * CustomerReviews Component
 * Carousel displaying customer testimonials with images
 */
const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Vineet P",
      verified: true,
      rating: 5,
      title: "Comfort that stands out",
      review:
        "Not gonna lie, these shoes stole the spotlight more than the view. Crazy comfy, easy to style, and they've been my go-to ever since I got them.",
      image: "/assets/images/review-1.jpg",
    },
    {
      id: 2,
      name: "Rahul K",
      verified: true,
      rating: 5,
      title: "Best purchase this year",
      review:
        "The quality is unmatched. I've worn these on hikes, city walks, and even casual outings. They hold up great and look amazing.",
      image: "/assets/images/review-2.jpg",
    },
    {
      id: 3,
      name: "Priya M",
      verified: true,
      rating: 5,
      title: "Stylish and durable",
      review:
        "I was skeptical at first but these exceeded all my expectations. The cushioning is perfect and they pair well with everything.",
      image: "/assets/images/review-3.jpg",
    },
  ];

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-12 uppercase tracking-tight">
          What're they saying?
        </h2>

        {/* Reviews Carousel */}
        <div className="relative">
          <div className="flex items-stretch gap-4">
            {/* Previous Review Preview (partial) */}
            <div className="hidden lg:block w-24 flex-shrink-0 overflow-hidden opacity-50">
              <div className="h-full bg-neutral-100 rounded-lg">
                <img
                  src={reviews[(currentIndex - 1 + reviews.length) % reviews.length].image}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Main Review Card */}
            <div className="flex-1 border-2 border-blue-600 rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
                {/* Image */}
                <div className="relative h-64 md:h-auto">
                  <img
                    src={currentReview.image}
                    alt={`Review by ${currentReview.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center p-8 md:p-12 bg-white">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(currentReview.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-neutral-900 text-neutral-900"
                      />
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 uppercase mb-4">
                    "{currentReview.title}"
                  </h3>

                  {/* Review Text */}
                  <p className="text-neutral-600 leading-relaxed mb-6">
                    {currentReview.review}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-8">
                    <span className="font-semibold text-neutral-900 uppercase tracking-wide">
                      {currentReview.name}
                    </span>
                    {currentReview.verified && (
                      <BadgeCheck className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3">
                    <button
                      onClick={prevReview}
                      className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="w-5 h-5 text-neutral-600" />
                    </button>
                    <button
                      onClick={nextReview}
                      className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                      aria-label="Next review"
                    >
                      <ChevronRight className="w-5 h-5 text-neutral-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Review Preview (partial) */}
            <div className="hidden lg:block w-24 flex-shrink-0 overflow-hidden opacity-50">
              <div className="h-full bg-neutral-100 rounded-lg">
                <img
                  src={reviews[(currentIndex + 1) % reviews.length].image}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
