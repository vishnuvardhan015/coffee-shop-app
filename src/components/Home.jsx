import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Bell, Home as HomeIcon, Heart, ShoppingBag, ChevronDown, X, Check } from 'lucide-react';
import { categories, coffees, navItems } from '../constants/coffee';

const navIcons = [HomeIcon, Heart, ShoppingBag, Bell];

const Home = ({ onNavigate, onSelectCoffee }) => {
  const [activeCategory, setActiveCategory] = useState('All Coffee');
  const [activeNav, setActiveNav] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [cart, setCart] = useState([]);
  const [showCartToast, setShowCartToast] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Filter & search coffees
  const filteredCoffees = useMemo(() => {
    let result = coffees;

    // Category filter
    if (activeCategory !== 'All Coffee') {
      const categoryMap = {
        'Machiatto': ['Caramel Macchiato'],
        'Latte': ['Velvet Latte', 'Matcha Latte', 'Flat White'],
        'Americano': ['Iced Americano', 'Amber Cold Brew'],
      };
      const names = categoryMap[activeCategory] || [];
      result = result.filter(c => names.includes(c.name));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || c.tone.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    setCart(prev => {
      const exists = prev.find(c => c.name === item.name);
      if (exists) return prev.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    setShowCartToast(item.name);
    setTimeout(() => setShowCartToast(null), 1500);
    onNavigate?.('order', { coffee: item, size: 'M', quantity: 1 });
  };

  const toggleFavorite = (e, item) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(item.name) 
        ? prev.filter(n => n !== item.name) 
        : [...prev, item.name]
    );
  };

  const totalCartItems = cart.reduce((sum, c) => sum + c.qty, 0);

  // View based on active nav
  const renderContent = () => {
    if (activeNav === 1) {
      // Favorites
      const favCoffees = coffees.filter(c => favorites.includes(c.name));
      return (
        <div className="px-6 relative z-10">
          <h2 className="text-[20px] font-bold text-[#2F2D2C] mb-4">Your Favorites</h2>
          {favCoffees.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="text-[#EAEAEA] mx-auto mb-4" />
              <p className="text-[#9B9B9B] text-[15px]">No favorites yet</p>
              <p className="text-[#9B9B9B] text-[13px] mt-1">Tap the ♡ on any coffee to add it here</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {favCoffees.map((item, index) => renderCoffeeCard(item, index))}
            </div>
          )}
        </div>
      );
    }

    if (activeNav === 2) {
      // Cart / Bag
      return (
        <div className="px-6 relative z-10">
          <h2 className="text-[20px] font-bold text-[#2F2D2C] mb-4">Your Bag</h2>
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="text-[#EAEAEA] mx-auto mb-4" />
              <p className="text-[#9B9B9B] text-[15px]">Your bag is empty</p>
              <p className="text-[#9B9B9B] text-[13px] mt-1">Tap + to add items</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.name} className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[15px]">{item.name}</h3>
                    <p className="text-[#9B9B9B] text-[12px]">{item.tone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCart(prev => prev.map(c => c.name === item.name ? { ...c, qty: Math.max(0, c.qty - 1) } : c).filter(c => c.qty > 0))}
                      className="w-6 h-6 rounded-full border border-[#EAEAEA] flex items-center justify-center text-[12px] hover:bg-gray-50 active:scale-90 transition-all"
                    >
                      −
                    </button>
                    <span className="text-[14px] font-bold w-4 text-center">{item.qty}</span>
                    <button
                      onClick={() => setCart(prev => prev.map(c => c.name === item.name ? { ...c, qty: c.qty + 1 } : c))}
                      className="w-6 h-6 rounded-full border border-[#EAEAEA] flex items-center justify-center text-[12px] hover:bg-gray-50 active:scale-90 transition-all"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-[14px] text-[#C67C4E] w-14 text-right">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-[#EAEAEA] mt-4">
                <span className="text-[16px] font-bold">Total</span>
                <span className="text-[18px] font-bold text-[#C67C4E]">$ {cart.reduce((s, c) => s + c.price * c.qty, 0).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeNav === 3) {
      // Notifications
      return (
        <div className="px-6 relative z-10">
          <h2 className="text-[20px] font-bold text-[#2F2D2C] mb-4">Notifications</h2>
          <div className="space-y-3">
            {[
              { title: 'Welcome! 🎉', msg: 'Enjoy 10% off your first order with code FIRSTORDER.', time: 'Just now' },
              { title: 'Flash Sale ⚡', msg: 'Buy one get one free on all lattes this weekend!', time: '2h ago' },
              { title: 'New Arrival ☕', msg: 'Try our new Matcha Latte — crafted with premium green tea.', time: '1d ago' },
            ].map((notif, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[14px] text-[#2F2D2C]">{notif.title}</h3>
                  <span className="text-[11px] text-[#9B9B9B]">{notif.time}</span>
                </div>
                <p className="text-[13px] text-[#9B9B9B] mt-1 leading-[1.5]">{notif.msg}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Default: Home view (nav 0)
    return (
      <>
        {/* Promo Card */}
        <div className="px-6 mb-8 mt-2 relative z-10">
          <div className="relative w-full h-[140px] rounded-[16px] bg-[#9C6D52] overflow-hidden shadow-lg shadow-black/5">
            <svg width="60" height="15" viewBox="0 0 60 15" className="absolute top-2 left-[50%] opacity-20 -translate-x-1/2">
              <path d="M0,7 Q5,0 10,7 T20,7 T30,7 T40,7 T50,7 T60,7" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute top-3 right-[35%] w-5 h-5 rounded-full border border-white/20"></div>
            <div className="absolute left-1 top-1/2 -translate-y-1/2 text-white/10 text-[6px] tracking-[3px] -rotate-90">
              ||||||||||
            </div>
            <svg viewBox="0 0 24 24" fill="#BB8560" className="absolute top-3 left-[45%] w-5 h-5 -rotate-12 opacity-90 drop-shadow-sm">
               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               <circle cx="12" cy="10" r="2.5" fill="white" />
            </svg>
            <svg viewBox="0 0 24 24" fill="#BB8560" className="absolute bottom-2 left-[52%] w-6 h-6 rotate-[60deg] opacity-90 drop-shadow-sm z-20">
               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               <circle cx="12" cy="10" r="2.5" fill="white" />
            </svg>
            <div className="absolute top-[-30px] right-[-20px] w-[180px] h-[200px] rounded-[50px] overflow-hidden border-[6px] border-[#81553A] z-0">
              <img 
                src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80" 
                alt="Promo Coffee" 
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div className="absolute inset-0 pl-4 py-3 flex flex-col justify-center items-start z-10">
              <span className="bg-[#ED5151] text-white text-[12px] font-bold px-2 py-0.5 rounded-[6px] mb-2 shadow-sm relative z-10">Promo</span>
              <div className="flex flex-col items-start gap-[2px] relative z-10 mt-1">
                <span className="bg-[#212121] text-white font-bold text-[28px] px-2 pt-1 pb-0.5 leading-none tracking-tight rounded-sm shadow-md">
                  Buy one get
                </span>
                <span className="bg-[#212121] text-white font-bold text-[28px] px-2 pt-1 pb-0.5 leading-none tracking-tight rounded-sm shadow-md">
                  one FREE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="pl-6 mb-6 overflow-x-auto no-scrollbar relative z-10">
          <div className="flex gap-3 pr-6 w-max items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-[10px] text-[14px] font-medium transition-all active:scale-95 ${
                  activeCategory === cat 
                    ? 'bg-[#C67C4E] text-white font-semibold shadow-md shadow-[#C67C4E]/30' 
                    : 'bg-[#F3F3F3] text-[#2F2D2C] hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Coffee Grid */}
        <div className="px-6 grid grid-cols-2 gap-4 relative z-10">
          {filteredCoffees.length === 0 ? (
            <div className="col-span-2 text-center py-16">
              <Search size={40} className="text-[#EAEAEA] mx-auto mb-3" />
              <p className="text-[#9B9B9B] text-[15px]">No coffees found</p>
              <p className="text-[#9B9B9B] text-[13px] mt-1">Try a different search or category</p>
            </div>
          ) : (
            filteredCoffees.map((item, index) => renderCoffeeCard(item, index))
          )}
        </div>
      </>
    );
  };

  const renderCoffeeCard = (item, index) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      key={item.name}
      onClick={() => onSelectCoffee && onSelectCoffee(item)}
      className="bg-white rounded-2xl p-2 flex flex-col hover:-translate-y-1 transition-transform duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] cursor-pointer"
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="text-[#C67C4E] text-[10px]">★</span>
          <span className="text-white text-[10px] font-semibold">{item.rating}</span>
        </div>
        {/* Favorite button on card */}
        <button
          onClick={(e) => toggleFavorite(e, item)}
          className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 active:scale-90 transition-all"
        >
          <Heart size={14} className={favorites.includes(item.name) ? 'fill-[#ED5151] text-[#ED5151]' : 'text-white'} />
        </button>
      </div>
      <h3 className="font-semibold text-[16px] mb-1 px-1">{item.name}</h3>
      <p className="text-[#9B9B9B] text-[12px] mb-3 px-1">{item.tone}</p>
      
      <div className="flex justify-between items-center mt-auto px-1 pb-1">
        <div className="font-semibold text-[18px]">
          <span className="font-bold mr-1 text-[#2F2D2C]">$</span>
          {item.price}
        </div>
        <button 
          onClick={(e) => handleAddToCart(e, item)}
          className="bg-[#C67C4E] w-[32px] h-[32px] rounded-xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all text-white font-bold text-lg leading-none"
        >
          +
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-screen flex flex-col bg-[#F9F9F9] relative text-[#2F2D2C]"
    >
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative pb-32">
        
        {/* Dark Background Top Half */}
        <div className="absolute top-0 left-0 w-full h-[260px] bg-[#131313] z-0"></div>
        
        {/* Header/Navbar */}
        <div className="sticky top-0 z-40 bg-[#131313]">
          <div className="px-6 pt-2 pb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[#B7B7B7] text-[12px] mb-1 font-medium">Location</p>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-white text-[14px]">Beggur-koppa Road, Banglore</span>
                  <ChevronDown size={16} className="text-[#B7B7B7]" />
                </div>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
                  alt="Profile" 
                  className="w-11 h-11 rounded-xl object-cover"
                />
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 bg-[#313131] rounded-2xl flex items-center px-4 py-3 focus-within:ring-1 focus-within:ring-[#C67C4E] transition-all">
                <Search size={20} className="text-[#F9F9F9] mr-3" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search coffee" 
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-[#989898] text-[15px]"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="ml-2 hover:opacity-70">
                    <X size={16} className="text-[#989898]" />
                  </button>
                )}
              </div>
              <button 
                onClick={() => setShowFilter(!showFilter)}
                className={`w-[48px] h-[48px] rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                  showFilter ? 'bg-[#b06f48] ring-2 ring-white/20' : 'bg-[#C67C4E] hover:bg-[#b06f48]'
                }`}
              >
                <SlidersHorizontal size={20} className="text-white" />
              </button>
            </div>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {showFilter && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 bg-[#252525] rounded-2xl p-3 space-y-2">
                    <p className="text-[#9B9B9B] text-[12px] font-semibold uppercase tracking-wider mb-1">Sort by</p>
                    {[
                      { key: 'default', label: 'Default' },
                      { key: 'price-low', label: 'Price: Low to High' },
                      { key: 'price-high', label: 'Price: High to Low' },
                      { key: 'rating', label: 'Highest Rated' },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => { setSortBy(opt.key); setShowFilter(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[14px] transition-all ${
                          sortBy === opt.key
                            ? 'bg-[#C67C4E] text-white font-semibold'
                            : 'text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {opt.label}
                        {sortBy === opt.key && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 w-full bg-white z-50 rounded-t-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="px-8 py-5 flex justify-between items-center">
          {navItems.map((item, index) => {
            const Icon = navIcons[index];
            const isActive = index === activeNav;
            return (
              <button 
                key={item}
                onClick={() => {
                  if (index === 2) {
                    onNavigate?.('order');
                    return;
                  }
                  setActiveNav(index);
                }}
                className={`flex flex-col items-center gap-1 relative active:scale-90 transition-all ${isActive ? 'text-[#C67C4E]' : 'text-[#A3A3A3] hover:text-[#C67C4E]'}`}
              >
                <div className="relative">
                  <Icon size={24} fill={isActive ? "currentColor" : "none"} />
                  {/* Cart badge */}
                  {index === 2 && totalCartItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ED5151] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    >
                      {totalCartItems}
                    </motion.span>
                  )}
                </div>
                <span className="text-[11px] font-semibold">{item}</span>
                {isActive && (
                  <motion.div layoutId="nav-dot" className="w-1 h-1 bg-[#C67C4E] rounded-full absolute -bottom-2" />
                )}
              </button>
            );
          })}
        </div>
        {/* Bottom Home Indicator */}
        <div className="pb-2 flex justify-center w-full">
          <div className="w-[130px] h-[5px] bg-[#111111] rounded-full"></div>
        </div>
      </div>

      {/* Add to Cart Toast */}
      <AnimatePresence>
        {showCartToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-[#2F2D2C] text-white text-[13px] font-medium px-5 py-3 rounded-2xl shadow-lg z-[100] whitespace-nowrap"
          >
            ✅ {showCartToast} added to bag!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
