/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Check, User, Filter, AlertCircle } from 'lucide-react';
import { Review } from '../types';
import { INITIAL_REVIEWS, COFFEE_BEANS } from '../data';

interface ReviewsListProps {
  reviews: Review[];
  onAddReview: (review: Review) => void;
}

export default function ReviewsList({ reviews, onAddReview }: ReviewsListProps) {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [selectedCoffee, setSelectedCoffee] = useState<string>('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  // Custom user review input form state
  const [newReviewer, setNewReviewer] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTargetCoffee, setNewTargetCoffee] = useState(COFFEE_BEANS[0].id);
  const [newRoastTag, setNewRoastTag] = useState('Light Roast');
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredReviews = reviews.filter(rev => {
    const matchesRating = filterRating === 'all' || rev.rating === filterRating;
    const matchesCoffee = selectedCoffee === 'all' || rev.coffeeId === selectedCoffee;
    return matchesRating && matchesCoffee;
  });

  const handleReviewSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewer || !newTitle || !newContent) return;

    const submitted: Review = {
      id: `rev-${Date.now()}`,
      coffeeId: newTargetCoffee,
      reviewerName: newReviewer,
      rating: newRating,
      date: 'Today',
      title: newTitle,
      content: newContent,
      roastTag: `${newRoastTag} / Standard Filter`,
      verifiedPurchase: true
    };

    onAddReview(submitted);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setShowReviewForm(false);
      // Reset inputs
      setNewReviewer('');
      setNewTitle('');
      setNewContent('');
      setNewRating(5);
    }, 1800);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 5;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
  };

  return (
    <section id="reviews" className="py-24 bg-[#080808] border-t border-[#262626]/20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0 text-left">
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-[#C5A880] tracking-[0.4em] uppercase block">COMMUNITY CHRONICLES</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F5F5F3] tracking-wide">
              Reviews & <span className="italic">Authenticity</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light max-w-lg leading-relaxed">
              Transparent sensory evaluations contributed by verified physical bar observers and direct subscription alliances in California.
            </p>
          </div>

          {/* Average Rating Stats summary */}
          <div className="bg-[#121212] border border-[#262626]/60 p-5 rounded-none shrink-0 text-left flex items-center space-x-6">
            <div>
              <span className="font-mono text-[9px] text-[#A3A3A3] tracking-widest block uppercase">AVERAGE RATING</span>
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="font-serif text-2xl font-bold text-[#F5F5F3]">{calculateAverageRating()}</span>
                <span className="text-zinc-600 font-sans text-xs">/ 5.0</span>
              </div>
            </div>
            
            <div className="h-10 w-[1px] bg-[#262626]" />

            <div>
              <span className="font-mono text-[9px] text-[#A3A3A3] tracking-widest block uppercase">CRITICAL RESPONSES</span>
              <span className="font-serif text-2xl font-light text-[#C5A880] block mt-1">{reviews.length} Feedbacks</span>
            </div>
          </div>
        </div>

        {/* Filters and action row */}
        <div className="bg-[#121212] border border-[#262626]/40 p-5 rounded-none mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Filter by rating select */}
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase">STARS:</span>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="bg-[#080808] border border-[#262626] font-mono text-[10px] py-1.5 px-3 text-[#A3A3A3] focus:outline-none focus:border-[#C5A880]"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
              </select>
            </div>

            {/* Filter by target coffee */}
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase">COFFEE DROP:</span>
              <select
                value={selectedCoffee}
                onChange={(e) => setSelectedCoffee(e.target.value)}
                className="bg-[#080808] border border-[#262626] font-mono text-[10px] py-1.5 px-3 text-[#A3A3A3] focus:outline-none focus:border-[#C5A880] max-w-[200px]"
              >
                <option value="all">All Varieties</option>
                {COFFEE_BEANS.map(bean => (
                  <option key={bean.id} value={bean.id}>{bean.name}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Leave a review button */}
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="w-full md:w-auto bg-transparent hover:bg-[#C5A880] hover:text-[#080808] text-[#C5A880] border border-[#C5A880]/30 hover:border-[#C5A880] font-mono text-[10px] font-semibold tracking-widest px-6 py-2.5 transition-colors uppercase flex items-center justify-center space-x-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>SUBMIT FEEDBACK</span>
          </button>

        </div>

        {/* Dynamic Review Submission Form sliding dropdown */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-[#121212]/90 border border-[#262626] p-6 md:p-8 rounded-none">
                
                {isSuccess ? (
                  <div className="py-8 text-center space-y-3 flex flex-col items-center">
                    <Check className="w-12 h-12 text-[#C5A880]" />
                    <h5 className="font-serif text-lg text-[#F5F5F3]">Review Logged.</h5>
                    <p className="font-mono text-[10px] text-[#A3A3A3] uppercase">INTEGRATING TO COMMUNITY GRIDS...</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmission} className="space-y-6 text-left">
                    <h4 className="font-serif text-lg text-[#F5F5F3]">Record Your Sensory Evaluation</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">GUEST HANDLE / NAME</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Elena G."
                          value={newReviewer}
                          onChange={(e) => setNewReviewer(e.target.value)}
                          className="w-full bg-[#080808] border border-[#262626] font-sans text-xs p-2.5 focus:outline-none text-[#F5F5F3] focus:border-[#C5A880]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">COFFEE REASSESSED</label>
                        <select
                          value={newTargetCoffee}
                          onChange={(e) => setNewTargetCoffee(e.target.value)}
                          className="w-full bg-[#080808] border border-[#262626] font-mono text-xs p-2.5 focus:outline-none text-[#F5F5F3] focus:border-[#C5A880]"
                        >
                          {COFFEE_BEANS.map(bean => (
                            <option key={bean.id} value={bean.id}>{bean.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">SENSORY SCORE RATING</label>
                        <select
                          value={newRating}
                          onChange={(e) => setNewRating(parseInt(e.target.value))}
                          className="w-full bg-[#080808] border border-[#262626] font-mono text-xs p-2.5 focus:outline-none text-[#F5F5F3] focus:border-[#C5A880]"
                        >
                          <option value="5">95+ pts (Excellent 5-Star)</option>
                          <option value="4">90+ pts (Highly Commendable 4-Star)</option>
                          <option value="3">85+ pts (Above Average 3-Star)</option>
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">CRITICAL FEEDBACK TITLE</label>
                        <input
                          required
                          type="text"
                          placeholder="An absolute floral blast..."
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full bg-[#080808] border border-[#262626] font-sans text-xs p-2.5 focus:outline-none text-[#F5F5F3] focus:border-[#C5A880]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">BREWING DEV METHOD</label>
                        <input
                          type="text"
                          placeholder="e.g. Origami Dripper / V60 Drip"
                          value={newRoastTag}
                          onChange={(e) => setNewRoastTag(e.target.value)}
                          className="w-full bg-[#080808] border border-[#262626] font-sans text-xs p-2.5 focus:outline-none text-[#F5F5F3] focus:border-[#C5A880]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">DETAILED CRITIQUE CONTENT</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Detail the acidic density, citric microtones, floral fragrance, or development duration..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full bg-[#080808] border border-[#262626] font-sans text-xs p-3.5 focus:outline-none text-[#F5F5F3] focus:border-[#C5A880] resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex md:justify-end">
                      <button
                        type="submit"
                        className="bg-[#C5A880] text-[#080808] font-mono text-[10px] font-bold tracking-widest px-8 py-3.5 uppercase cursor-pointer"
                      >
                        ENCRYPT & DISPATCH TESTIMONIAL
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews Editorial Masonry / Slate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredReviews.length === 0 ? (
              <div className="col-span-full py-12 text-center border border-dashed border-[#262626]/80 text-[#A3A3A3] font-sans text-xs">
                No reviews match selection parameters. Try adjusting filters above.
              </div>
            ) : (
              filteredReviews.map((rev) => {
                const associatedCoffee = COFFEE_BEANS.find(bean => bean.id === rev.coffeeId) || COFFEE_BEANS[0];
                
                return (
                  <motion.div
                    key={rev.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#121212] border border-[#262626]/60 p-6 md:p-8 rounded-none text-left space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3.5">
                      
                      {/* Top Author Meta */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-serif text-[#F5F5F3] font-semibold text-sm block">{rev.reviewerName}</span>
                          <span className="font-mono text-[8.5px] text-[#C5A880] tracking-widest uppercase block mt-0.5">
                            {rev.roastTag}
                          </span>
                        </div>

                        {/* Stars output */}
                        <div className="flex space-x-1 text-[#C5A880]">
                          {Array.from({ length: rev.rating }).map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <div className="h-[1px] bg-[#262626]/40" />

                      {/* Content */}
                      <div className="space-y-1.5">
                        <h4 className="font-serif text-base text-[#F5F5F3] italic font-light">“{rev.title}”</h4>
                        <p className="font-sans text-xs text-[#A3A3A3] font-light leading-relaxed">
                          {rev.content}
                        </p>
                      </div>

                    </div>

                    {/* Bottom stamp */}
                    <div className="border-t border-[#262626]/40 pt-4 flex justify-between items-center bg-[#121212] mt-4">
                      
                      <div className="flex items-center space-x-1.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                        </div>
                        <span className="font-mono text-[8px] text-zinc-500 tracking-wider">VERIFIED ALLIANCE</span>
                      </div>

                      <span className="font-mono text-[8px] text-[#A3A3A3]/50">{rev.date}</span>
                    </div>

                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
