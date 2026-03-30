
import React, { useState, useRef } from 'react';
import { Star, Camera, Send, X, User } from 'lucide-react';
import { Language, Review } from './types';
import { TRANSLATIONS, MOCK_REVIEWS } from './constants';

interface ReviewsSectionProps {
  lang: Language;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang] as any;
  const isRtl = lang === Language.AR;
  
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert(isRtl ? "الرجاء اختيار تقييم بالنجوم" : "Please select a star rating.");
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      userName: isRtl ? "عميل مجهول" : "Verified Customer",
      rating,
      comment,
      image: imagePreview || undefined,
      date: t.justNow || (isRtl ? "الآن" : "Just now")
    };

    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment('');
    setImagePreview(null);
  };

  const renderStars = (count: number, interactive = false) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const starValue = i + 1;
      const isActive = interactive 
        ? (hoverRating || rating) >= starValue 
        : count >= starValue;

      return (
        <Star
          key={i}
          size={interactive ? 28 : 16}
          fill={isActive ? "#d4af37" : "transparent"}
          className={`cursor-pointer transition-all duration-300 ${isActive ? 'text-[#d4af37]' : 'text-gray-600'}`}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && setRating(starValue)}
        />
      );
    });
  };

  return (
    <section id="reviews" className="py-24 px-6 bg-[#050505] border-y border-gold-text/10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gold-text uppercase tracking-widest">
            {t.reviewsTitle}
          </h2>
          <div className="h-1 w-24 gold-bg mx-auto rounded-full opacity-50"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* نموذج إضافة تقييم */}
          <div className="lg:col-span-1">
            <div className="glass gold-border p-8 rounded-[40px] sticky top-32 shadow-2xl bg-black/40">
              <h3 className="text-xl font-bold mb-8 gold-text uppercase tracking-wider flex items-center gap-2">
                <Send size={20} className={isRtl ? 'rotate-180' : ''} />
                {t.addReview}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center gap-2 mb-4 bg-white/5 py-4 rounded-2xl border border-white/5">
                  {renderStars(0, true)}
                </div>
                
                <div className="relative">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.writeComment}
                    className="w-full h-40 bg-black/60 border border-white/10 rounded-2xl p-5 text-white focus:border-gold-text outline-none resize-none transition-all placeholder:text-gray-600"
                    required
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold-text hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl"
                  >
                    <Camera size={16} /> {t.uploadPhoto}
                  </button>
                  
                  {imagePreview && (
                    <div className="w-16 h-16 rounded-xl border border-gold-text/30 overflow-hidden relative group">
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                      <button 
                        type="button" 
                        onClick={() => setImagePreview(null)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                </div>

                <button
                  type="submit"
                  className="w-full py-5 gold-bg text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-gold uppercase text-xs tracking-[0.2em]"
                >
                  {t.sendReview}
                </button>
              </form>
            </div>
          </div>

          {/* قائمة التقييمات */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="glass gold-border p-8 rounded-[40px] flex flex-col hover:bg-white/5 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gold-text/10 flex items-center justify-center text-gold-text">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:gold-text transition-colors">
                          {review.userName}
                        </h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 italic flex-grow">
                    "{review.comment}"
                  </p>

                  {review.image && (
                    <div className="mt-4 w-full aspect-video rounded-3xl overflow-hidden border border-white/5 group-hover:border-gold-text/20 transition-colors">
                      <img 
                        src={review.image} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                        alt="Customer photo" 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
