import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Heart, Star } from 'lucide-react';

const ScooterIcon = ({ className, size = 20 }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="7" cy="17" r="3"/>
    <circle cx="17" cy="17" r="3"/>
    <path d="M7 17h10M17 14v-4l-4-4H5a2 2 0 0 0-2 2v6M13 6v8M5 14h2"/>
  </svg>
);

const BeanIcon = ({ className, size = 20 }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 6c-3 0-5 2-5 5 0 5 5 10 10 10 5 0 10-5 10-10 0-3-2-5-5-5-3 0-5 1.5-5 3v-3c0-1.5-2-3-5-3z" />
    <path d="M10 13c1.5-1.5 3.5-1.5 5 0" />
  </svg>
);

const MilkIcon = ({ className, size = 20 }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 10h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10z"/>
    <path d="M6 10l3-6h6l3 6"/>
    <path d="M10 4v6M14 4v6"/>
  </svg>
);

const fullDescription = `A cappuccino is an approximately 150 ml (5 oz) beverage, with 25 ml of espresso coffee and 85ml of fresh milk. The foam on top is an essential part of the drink and is created by aerating the milk during the steaming process. The result is a rich, creamy, and well-balanced coffee experience with a smooth texture and a delightful aroma that lingers after every sip.`;

const Detail = ({ coffee, onBack, onNavigate }) => {
  const [selectedSize, setSelectedSize] = useState('M');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeInfoIcon, setActiveInfoIcon] = useState(null);
  const sizes = ['S', 'M', 'L'];

  // Price adjustment based on size
  const sizeMultiplier = selectedSize === 'S' ? 0.85 : selectedSize === 'L' ? 1.2 : 1;
  const adjustedPrice = (coffee.price * sizeMultiplier).toFixed(2);

  const infoIcons = [
    { Icon: ScooterIcon, key: 'delivery', label: 'Free delivery on orders above $10' },
    { Icon: BeanIcon, key: 'bean', label: '100% Arabica single-origin beans' },
    { Icon: MilkIcon, key: 'milk', label: 'Fresh whole milk, oat milk option available' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full h-screen flex flex-col bg-[#F9F9F9] relative text-[#2F2D2C]"
    >
      {/* Header */}
      <div className="pt-12 pb-4 px-6 flex justify-between items-center bg-[#F9F9F9] z-10 sticky top-0">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-start hover:opacity-70 active:scale-90 transition-all">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-[18px] font-semibold text-[#2F2D2C]">Detail</h1>
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="w-10 h-10 flex items-center justify-end hover:opacity-70 active:scale-90 transition-all"
        >
          <motion.div
            key={isFavorite ? 'filled' : 'outline'}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Heart 
              size={24} 
              className={isFavorite ? 'fill-[#ED5151] text-[#ED5151]' : 'text-[#2F2D2C]'} 
            />
          </motion.div>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-[120px] px-6">
        {/* Product Image */}
        <div className="w-full h-[220px] rounded-3xl overflow-hidden mb-5 shadow-sm">
          <img 
            src={coffee.image} 
            alt={coffee.name} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title and Icons */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-[22px] font-bold text-[#2F2D2C] mb-1">{coffee.name}</h2>
            <p className="text-[#9B9B9B] text-[13px]">{coffee.tone}</p>
          </div>
          <div className="flex gap-3 relative">
            {infoIcons.map(({ Icon, key, label }) => (
              <div key={key} className="relative">
                <button
                  onClick={() => setActiveInfoIcon(activeInfoIcon === key ? null : key)}
                  className={`w-[44px] h-[44px] rounded-[14px] flex items-center justify-center transition-all active:scale-90 cursor-pointer ${
                    activeInfoIcon === key 
                      ? 'bg-[#FFF5EE] ring-2 ring-[#C67C4E]/30' 
                      : 'bg-[#F5F5F5] hover:scale-105'
                  }`}
                >
                  <Icon size={20} className="text-[#C67C4E]" />
                </button>
                <AnimatePresence>
                  {activeInfoIcon === key && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      className="absolute right-0 top-[52px] w-[200px] bg-[#2F2D2C] text-white text-[12px] leading-[1.5] px-3.5 py-2.5 rounded-xl shadow-lg z-50"
                    >
                      {label}
                      <div className="absolute -top-1.5 right-4 w-3 h-3 bg-[#2F2D2C] rotate-45 rounded-sm" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2 mb-4">
          <Star size={20} className="fill-[#FBBE21] text-[#FBBE21]" />
          <span className="text-[16px] font-bold text-[#2F2D2C]">{coffee.rating}</span>
          <span className="text-[#9B9B9B] text-[12px] ml-1">(230)</span>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-[#EAEAEA] mb-5"></div>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-[16px] font-bold text-[#2F2D2C] mb-3">Description</h3>
          <motion.div layout className="overflow-hidden">
            <p className="text-[#9B9B9B] text-[14px] leading-[1.6]">
              {showFullDesc 
                ? fullDescription
                : `${fullDescription.slice(0, 140)}... `
              }
              <button 
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-[#C67C4E] font-bold cursor-pointer hover:underline inline"
              >
                {showFullDesc ? 'Show Less' : 'Read More'}
              </button>
            </p>
          </motion.div>
        </div>

        {/* Size Selection */}
        <div className="mb-8">
          <h3 className="text-[16px] font-bold text-[#2F2D2C] mb-3">Size</h3>
          <div className="flex gap-3">
            {sizes.map((size) => (
              <motion.button
                key={size}
                onClick={() => setSelectedSize(size)}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 py-2.5 rounded-[12px] border text-[14px] font-medium transition-all ${
                  selectedSize === size
                    ? 'border-[#C67C4E] bg-[#FFF5EE] text-[#C67C4E]'
                    : 'border-[#EAEAEA] bg-white text-[#2F2D2C] hover:border-[#C67C4E]/50'
                }`}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-white rounded-t-3xl px-6 py-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex items-center justify-between z-20">
        <div className="flex flex-col justify-center">
          <p className="text-[#9B9B9B] text-[14px] mb-1">Price</p>
          <motion.p
            key={adjustedPrice}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[#C67C4E] text-[24px] font-bold leading-none"
          >
            <span className="text-[18px]">$ </span>{adjustedPrice}
          </motion.p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate && onNavigate('order', { coffee, size: selectedSize, quantity: 1 })}
          className="bg-[#C67C4E] hover:bg-[#b06f48] transition-colors text-white font-semibold text-[16px] py-4 px-[70px] rounded-[16px] shadow-lg shadow-[#C67C4E]/30"
        >
          Buy Now
        </motion.button>
      </div>
      
      {/* Safe Area Bottom */}
      <div className="absolute bottom-1.5 w-full flex justify-center z-30 pointer-events-none">
        <div className="w-[130px] h-[5px] bg-[#111111] rounded-full"></div>
      </div>

      {/* Favorite Toast */}
      <AnimatePresence>
        {isFavorite && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-24 left-1/2 -translate-x-1/2 bg-[#2F2D2C] text-white text-[13px] font-medium px-4 py-2.5 rounded-2xl shadow-lg z-50"
          >
            ❤️ Added to favorites!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Detail;
