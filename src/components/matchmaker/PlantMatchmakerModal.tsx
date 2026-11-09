import React, { useMemo } from 'react';
import { X, Sparkles, ArrowLeft, RotateCcw, Sun, Droplets, Home, PawPrint, Heart, ShoppingBag, Eye } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ALL_PRODUCTS } from '../../data/products';

interface QuestionOption {
  label: string;
  description: string;
  value: string;
  icon: any;
}

interface MatchmakerQuestion {
  id: string;
  key: 'light' | 'maintenance' | 'environment' | 'petSafe' | 'purpose';
  title: string;
  subtitle: string;
  options: QuestionOption[];
}

const QUESTIONS: MatchmakerQuestion[] = [
  {
    id: 'q1',
    key: 'light',
    title: 'What lighting conditions exist in your space?',
    subtitle: 'Lighting is the #1 predictor of plant vitality. Select your primary room light.',
    options: [
      {
        label: 'Direct Sunlight',
        description: 'Sunny south/west-facing window receiving 4-6+ hours of intense unfiltered rays.',
        value: 'Direct Sunlight',
        icon: Sun
      },
      {
        label: 'Bright Indirect',
        description: 'Bright daylight room filtered by sheer curtains or near large east windows.',
        value: 'Bright Indirect',
        icon: Sparkles
      },
      {
        label: 'Medium Ambient',
        description: 'Gentle natural light in center of rooms, offices with modest windows.',
        value: 'Medium Light',
        icon: Home
      },
      {
        label: 'Low / Ambient Glow',
        description: 'Hallways, cozy bedrooms, basements, or rooms relying on artificial lamps.',
        value: 'Low Light',
        icon: Droplets
      }
    ]
  },
  {
    id: 'q2',
    key: 'maintenance',
    title: 'How much care effort do you wish to invest?',
    subtitle: 'Be honest! We have options that survive weeks without water to botanical obsessions.',
    options: [
      {
        label: 'Ultra Low (Forgetful-Friendly)',
        description: 'Water every 2-3 weeks; handles frequent travel, neglect, and dry air.',
        value: 'Low',
        icon: Droplets
      },
      {
        label: 'Moderate (Weekend Ritual)',
        description: 'Weekly watering and light misting. Perfect for regular weekend plant parents.',
        value: 'Moderate',
        icon: Heart
      },
      {
        label: 'Enthusiast / High Care',
        description: 'Willing to monitor humidity, pruning, and precision organic feeding.',
        value: 'High',
        icon: Sparkles
      }
    ]
  },
  {
    id: 'q3',
    key: 'environment',
    title: 'Where will your new botanical specimen reside?',
    subtitle: 'Different zones require specific humidity and thermal tolerances.',
    options: [
      {
        label: 'Indoor Living or Bedroom',
        description: 'Climate-controlled living room, study, or bedside sanctuary.',
        value: 'Indoor',
        icon: Home
      },
      {
        label: 'Balcony or Covered Porch',
        description: 'Outdoor fresh air, container planters, sheltered from torrential storms.',
        value: 'Balcony/Patio',
        icon: Sun
      },
      {
        label: 'Full Outdoor Garden Bed',
        description: 'Open soil beds, sunny yards, vegetable plots, or exterior landscaping.',
        value: 'Outdoor',
        icon: Sparkles
      }
    ]
  },
  {
    id: 'q4',
    key: 'petSafe',
    title: 'Do curious pets share your living space?',
    subtitle: 'We curate certified ASPCA non-toxic houseplants safe for cats and dogs.',
    options: [
      {
        label: 'Must Be 100% Pet-Safe',
        description: 'Strict non-toxic flora only. Safe if nibbled by cats, dogs, or toddlers.',
        value: 'safe',
        icon: PawPrint
      },
      {
        label: 'Any Variety (No Pet Concerns)',
        description: 'I do not have curious pets or plants will be kept out of reach on high shelves.',
        value: 'any',
        icon: Sparkles
      }
    ]
  },
  {
    id: 'q5',
    key: 'purpose',
    title: 'What is your primary botanical aspiration?',
    subtitle: 'Select the primary aesthetic or practical goal for your new greenery.',
    options: [
      {
        label: 'Air Purification & Wellness',
        description: 'NASA-studied species that absorb indoor toxins and emit fresh oxygen.',
        value: 'Air Purifier',
        icon: Sparkles
      },
      {
        label: 'Lush Architectural Foliage',
        description: 'Big tropical split-leaves, deep variegation, and statement living decor.',
        value: 'Lush Foliage',
        icon: Home
      },
      {
        label: 'Flowering Blooms & Fragrance',
        description: 'Spectacular colors, floral petals, and intoxicating evening aromas.',
        value: 'Flowering Bloom',
        icon: Heart
      },
      {
        label: 'Edible Kitchen Herbs & Produce',
        description: 'Fresh basil, vine tomatoes, sweet peppers, and culinary herbs.',
        value: 'Edible/Herb',
        icon: Sun
      }
    ]
  }
];

export const PlantMatchmakerModal: React.FC = () => {
  const isMatchmakerOpen = useStore((state) => state.isMatchmakerOpen);
  const setIsMatchmakerOpen = useStore((state) => state.setIsMatchmakerOpen);
  const matchmakerStep = useStore((state) => state.matchmakerStep);
  const setMatchmakerStep = useStore((state) => state.setMatchmakerStep);
  const matchmakerAnswers = useStore((state) => state.matchmakerAnswers);
  const setMatchmakerAnswer = useStore((state) => state.setMatchmakerAnswer);
  const resetMatchmaker = useStore((state) => state.resetMatchmaker);
  const addToCart = useStore((state) => state.addToCart);
  const setQuickViewProduct = useStore((state) => state.setQuickViewProduct);

  const currentQuestion = QUESTIONS[matchmakerStep - 1];

  // Dynamic recommendation scoring engine
  const matchedProducts = useMemo(() => {
    if (matchmakerStep <= QUESTIONS.length) return [];

    return ALL_PRODUCTS.map((product) => {
      let score = 0;

      // 1. Light Match
      if (product.light === matchmakerAnswers.light) {
        score += 30;
      } else if (
        (matchmakerAnswers.light === 'Bright Indirect' && product.light === 'Medium Light') ||
        (matchmakerAnswers.light === 'Low Light' && product.light === 'Medium Light')
      ) {
        score += 15;
      }

      // 2. Maintenance Match
      if (product.maintenance === matchmakerAnswers.maintenance) {
        score += 25;
      } else if (product.maintenance === 'Low') {
        score += 15;
      }

      // 3. Environment Match
      if (product.environment === matchmakerAnswers.environment || product.environment === 'Both') {
        score += 20;
      }

      // 4. Pet Safety
      if (matchmakerAnswers.petSafe === 'safe') {
        if (product.petFriendly) score += 30;
        else score -= 60;
      } else {
        score += 10;
      }

      // 5. Purpose Match
      if (product.purpose === matchmakerAnswers.purpose) {
        score += 35;
      }

      return { product, score };
    })
      .filter((item) => item.score > 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map((item) => item.product);
  }, [matchmakerStep, matchmakerAnswers]);

  if (!isMatchmakerOpen) return null;

  const handleSelectOption = (value: string) => {
    if (!currentQuestion) return;
    setMatchmakerAnswer(currentQuestion.key, value);

    if (matchmakerStep < QUESTIONS.length) {
      setMatchmakerStep(matchmakerStep + 1);
    } else {
      setMatchmakerStep(QUESTIONS.length + 1);
    }
  };

  const progressPercent = Math.min(100, Math.round(((matchmakerStep - 1) / QUESTIONS.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => setIsMatchmakerOpen(false)}
        className="fixed inset-0 bg-black/85 backdrop-blur-2xl transition-opacity animate-in fade-in"
      />

      {/* Modal Container in Obsidian Evergreen (#0A1C13) */}
      <div className="relative w-full max-w-3xl bg-[#0A1C13] border border-[#C59B27]/40 rounded-3xl overflow-hidden shadow-2xl z-10 p-6 sm:p-10 animate-in zoom-in-95 duration-300 text-[#F8F6F0]">
        {/* Header with Close & Restart */}
        <div className="flex items-center justify-between pb-6 border-b border-[#1A4D34]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#05130D] border border-[#C59B27]/40 flex items-center justify-center text-[#DFB847]">
              <Sparkles className="w-4 h-4 text-[#DFB847]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">Botanical Matchmaker</h2>
              <span className="text-[11px] font-mono text-[#C59B27] uppercase tracking-widest font-bold">
                Dynamic Specimen Recommendation
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetMatchmaker}
              className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-[#1A4D34] transition-colors"
              title="Restart Questionnaire"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMatchmakerOpen(false)}
              className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-[#1A4D34] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="my-6">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-300 mb-2 font-bold">
            <span>
              {matchmakerStep <= QUESTIONS.length
                ? `Question ${matchmakerStep} of ${QUESTIONS.length}`
                : 'Scoring Complete • Top Recommendations'}
            </span>
            <span className="text-[#DFB847]">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#05130D] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C59B27] via-[#DFB847] to-[#C59B27] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Dynamic Question Step Screen */}
        {matchmakerStep <= QUESTIONS.length && currentQuestion && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {currentQuestion.title}
              </h3>
              <p className="text-sm text-emerald-100/70 font-light">
                {currentQuestion.subtitle}
              </p>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {currentQuestion.options.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = matchmakerAnswers[currentQuestion.key] === opt.value;

                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    className={`p-4 rounded-2xl text-left border transition-all duration-300 group flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#1A4D34]/60 border-[#DFB847] shadow-glow-gold'
                        : 'bg-[#05130D] hover:bg-[#0E2D20] border-[#C59B27]/25 hover:border-[#DFB847]/60'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#0A1C13] border border-[#C59B27]/30 group-hover:border-[#DFB847] flex items-center justify-center text-[#DFB847] shrink-0 transition-colors">
                      <IconComponent className="w-4 h-4 text-[#DFB847]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white group-hover:text-[#DFB847] transition-colors mb-1">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-emerald-100/70 leading-relaxed font-light">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            {matchmakerStep > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-[#1A4D34]/50">
                <button
                  onClick={() => setMatchmakerStep(matchmakerStep - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-2 hover:bg-[#1A4D34] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous Question
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Screen */}
        {matchmakerStep > QUESTIONS.length && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono tracking-widest uppercase bg-[#C59B27]/20 text-[#DFB847] border border-[#C59B27]/40 font-bold">
                Curated Recommendations
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Your Ideal Living Cultivars
              </h3>
              <p className="text-sm text-emerald-100/70 max-w-lg mx-auto font-light">
                Based on your light, care regimen, and space, these specimens are scientifically primed to thrive under your care.
              </p>
            </div>

            {/* Matched Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {matchedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 rounded-2xl bg-[#05130D] border border-[#C59B27]/30 hover:border-[#DFB847] transition-all flex gap-4 group"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#0F2E1E] relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-sm text-white group-hover:text-[#DFB847] transition-colors line-clamp-1">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#4B6E4A] italic font-serif line-clamp-1 mb-1 font-semibold">
                        {product.scientificName || product.categoryName}
                      </p>
                      <p className="text-xs font-mono font-bold text-[#DFB847]">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          addToCart(product, 1);
                          setIsMatchmakerOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] flex items-center gap-1 shadow-sm transition-all"
                      >
                        <ShoppingBag className="w-3 h-3" /> Select
                      </button>
                      <button
                        onClick={() => {
                          setQuickViewProduct(product);
                          setIsMatchmakerOpen(false);
                        }}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-[#1A4D34] hover:bg-[#256647] text-white flex items-center gap-1 transition-all"
                      >
                        <Eye className="w-3 h-3" /> Inspect
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Restart or Browse All */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[#1A4D34]/50">
              <button
                onClick={resetMatchmaker}
                className="text-xs text-[#DFB847] hover:text-white flex items-center gap-1.5 transition-colors font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Questionnaire
              </button>
              <button
                onClick={() => setIsMatchmakerOpen(false)}
                className="px-6 py-2.5 rounded-full bg-[#C59B27] hover:bg-[#DFB847] text-[#0F2E1E] text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
              >
                Browse Full 46-Item Catalog
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
