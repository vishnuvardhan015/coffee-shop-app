import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Heart,
  Home as HomeIcon,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
} from 'lucide-react';
import SplashHero from './components/SplashHero';
import CoverPage from './components/CoverPage';
import Home from './components/Home';
import Detail from './components/Detail';
import Order from './components/Order';
import Tracking from './components/Tracking';
import { categories, coffees, navItems } from './constants/coffee';

const navIcons = [HomeIcon, Heart, ShoppingBag, Bell];

const fullDescription = `A cappuccino is an approximately 150 ml (5 oz) beverage, with 25 ml of espresso coffee and 85ml of fresh milk. The foam on top is an essential part of the drink and is created by aerating the milk during the steaming process. The result is a rich, creamy, and well-balanced coffee experience with a smooth texture and a delightful aroma that lingers after every sip.`;
const coffeeSplashImage = `${import.meta.env.BASE_URL}images/coffee_splash.png`;

const OrderConfirmation = ({ order, onBack, onTrack }) => (
  <motion.main
    initial={{ opacity: 0, x: 18 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.32, ease: 'easeOut' }}
    className="min-h-[100dvh] w-full bg-[#F9F9F9] text-[#2F2D2C] flex flex-col px-6 pt-12 pb-8"
  >
    <header className="relative flex items-center justify-center mb-12">
      <button
        type="button"
        onClick={onBack}
        aria-label="Go back"
        className="absolute left-0 w-10 h-10 flex items-center justify-start active:scale-90 transition-transform"
      >
        <ChevronDown size={24} className="rotate-90" />
      </button>
      <h1 className="text-[18px] font-semibold">Order Confirmed</h1>
    </header>

    <section className="flex-1 flex flex-col items-center justify-center text-center -mt-16">
      <div className="w-24 h-24 rounded-[28px] bg-[#FFF5EE] text-[#C67C4E] flex items-center justify-center mb-7 shadow-[0_14px_30px_rgba(198,124,78,0.16)]">
        <CheckCircle2 size={52} strokeWidth={1.8} />
      </div>
      <h2 className="text-[26px] font-bold mb-3">Your coffee is confirmed</h2>
      <p className="text-[#9B9B9B] text-[14px] leading-[1.6] max-w-[280px] mb-8">
        {order?.coffee?.name} is being prepared. Track your courier live once it leaves the store.
      </p>

      <div className="w-full bg-white rounded-[20px] p-4 shadow-sm border border-[#EAEAEA]/60 text-left">
        <div className="flex items-center gap-3">
          <img src={order?.coffee?.image} alt={order?.coffee?.name} className="w-14 h-14 rounded-xl object-cover" />
          <div className="flex-1">
            <h3 className="text-[15px] font-bold">{order?.coffee?.name}</h3>
            <p className="text-[#9B9B9B] text-[12px] mt-1">{order?.size} Size - Qty {order?.quantity}</p>
          </div>
          <Check size={18} className="text-[#C67C4E]" />
        </div>
      </div>
    </section>

    <motion.button
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={onTrack}
      className="w-full bg-[#C67C4E] text-white font-semibold text-[16px] py-4 rounded-[16px] shadow-lg shadow-[#C67C4E]/30"
    >
      Track Order
    </motion.button>
  </motion.main>
);

function App() {
  const [currentPage, setCurrentPage] = useState('splash');
  const [pageStack, setPageStack] = useState(['splash']);
  const [selectedCoffee, setSelectedCoffee] = useState(coffees[0]);
  const [activeCategory, setActiveCategory] = useState('All Coffee');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [deliveryMode, setDeliveryMode] = useState('deliver');
  const [activeDesktopNav, setActiveDesktopNav] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderDraft, setOrderDraft] = useState({
    coffee: coffees[0],
    size: 'M',
    quantity: 1,
  });

  useEffect(() => {
    window.history.replaceState({ appPage: 'splash' }, '', window.location.href);

    const handleBrowserBack = () => {
      setPageStack((stack) => {
        const nextStack = stack.length > 1 ? stack.slice(0, -1) : stack;
        setCurrentPage(nextStack[nextStack.length - 1] || 'home');
        return nextStack;
      });
    };

    window.addEventListener('popstate', handleBrowserBack);
    return () => window.removeEventListener('popstate', handleBrowserBack);
  }, []);

  const navigateTo = useCallback((page, { replace = false } = {}) => {
    setPageStack((stack) => {
      const nextStack = replace ? [...stack.slice(0, -1), page] : [...stack, page];
      return nextStack.length ? nextStack : [page];
    });
    setCurrentPage(page);

    if (replace) {
      window.history.replaceState({ appPage: page }, '', window.location.href);
    } else {
      window.history.pushState({ appPage: page }, '', window.location.href);
    }
  }, []);

  const goBack = useCallback((fallbackPage = 'home') => {
    if (pageStack.length > 1) {
      window.history.back();
      return;
    }
    navigateTo(fallbackPage, { replace: true });
  }, [navigateTo, pageStack.length]);

  const handleSelectCoffee = (coffee) => {
    setSelectedCoffee(coffee);
    setSelectedSize('M');
    setQuantity(1);
    navigateTo('detail');
    setActiveDesktopNav(0);
  };

  const createOrderDraft = ({ coffee = selectedCoffee, size = selectedSize, quantity: orderQuantity = quantity } = {}) => {
    const draft = {
      coffee: coffee || coffees[0],
      size,
      quantity: Math.max(1, orderQuantity),
    };

    setSelectedCoffee(draft.coffee);
    setSelectedSize(draft.size);
    setQuantity(draft.quantity);
    setOrderDraft(draft);

    return draft;
  };

  const handleNavigate = (page, payload = {}) => {
    if (page === 'order' || page === 'confirmation' || page === 'tracking') {
      const draft = createOrderDraft(payload);
      if (page === 'order' && payload.coffee) {
        setCart((current) => {
          const exists = current.find((item) => item.name === draft.coffee.name);
          if (exists) {
            return current.map((item) =>
              item.name === draft.coffee.name
                ? { ...item, qty: Math.max(item.qty, draft.quantity), size: draft.size }
                : item
            );
          }
          return [...current, { ...draft.coffee, qty: draft.quantity, size: draft.size }];
        });
      }
      setActiveDesktopNav(2);
    }

    navigateTo(page);
  };

  const handleDesktopNav = (index) => {
    setActiveDesktopNav(index);
    if (index === 2) navigateTo('order');
    if (index !== 2) navigateTo('home');
  };

  const toggleFavorite = (coffee) => {
    setFavorites((current) =>
      current.includes(coffee.name)
        ? current.filter((name) => name !== coffee.name)
        : [...current, coffee.name]
    );
  };

  const addToCart = (coffee) => {
    setCart((current) => {
      const exists = current.find((item) => item.name === coffee.name);
      if (exists) {
        return current.map((item) =>
          item.name === coffee.name ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...current, { ...coffee, qty: 1 }];
    });
    setActiveDesktopNav(2);
    navigateTo('order');
  };

  const handleDesktopPrimaryAction = () => {
    const draft = createOrderDraft();
    setCart((current) => {
      const exists = current.find((item) => item.name === draft.coffee.name);
      if (exists) {
        return current.map((item) =>
          item.name === draft.coffee.name
            ? { ...item, qty: Math.max(item.qty, draft.quantity), size: draft.size }
            : item
        );
      }
      return [...current, { ...draft.coffee, qty: draft.quantity, size: draft.size }];
    });
    setActiveDesktopNav(2);
    navigateTo('order');
  };

  const filteredCoffees = coffees.filter((coffee) => {
    const categoryMap = {
      Machiatto: ['Caramel Macchiato'],
      Latte: ['Velvet Latte', 'Matcha Latte', 'Flat White'],
      Americano: ['Iced Americano', 'Amber Cold Brew'],
    };
    const categoryMatch =
      activeCategory === 'All Coffee' ||
      (categoryMap[activeCategory] || []).includes(coffee.name);
    const q = searchQuery.trim().toLowerCase();
    const searchMatch =
      !q ||
      coffee.name.toLowerCase().includes(q) ||
      coffee.tone.toLowerCase().includes(q);

    return categoryMatch && searchMatch;
  });

  const sizeMultiplier = selectedSize === 'S' ? 0.85 : selectedSize === 'L' ? 1.2 : 1;
  const adjustedPrice = (selectedCoffee.price * sizeMultiplier).toFixed(2);
  const subtotal = selectedCoffee.price * sizeMultiplier * quantity;
  const discountAmount = subtotal * 0.1;
  const favoriteCoffees = coffees.filter((coffee) => favorites.includes(coffee.name));
  const displayedCoffees = activeDesktopNav === 1 ? favoriteCoffees : filteredCoffees;
  const totalCartItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartDeliveryFee = cartSubtotal > 10 || cartSubtotal === 0 ? 0 : 1;
  const cartTaxes = cartSubtotal * 0.08;
  const cartDiscount = cartSubtotal * 0.1;
  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee + cartTaxes - cartDiscount);
  const freeDeliveryProgress = Math.min(100, (cartSubtotal / 10) * 100);
  const recommendedAddOns = coffees.filter((coffee) => !cart.some((item) => item.name === coffee.name)).slice(0, 3);

  const renderMobileScreen = () => (
    <div className="app-mobile-shell max-w-md mx-auto relative min-h-screen shadow-2xl shadow-brand-brown/10 bg-black overflow-x-hidden border-x border-white/5">
      {currentPage === 'splash' && <SplashHero onGetStarted={() => handleNavigate('home')} />}
      {currentPage === 'home' && <Home onNavigate={handleNavigate} onSelectCoffee={handleSelectCoffee} />}
      {currentPage === 'detail' && <Detail coffee={selectedCoffee} onBack={() => goBack('home')} onNavigate={handleNavigate} />}
      {currentPage === 'order' && (
        <Order
          coffee={orderDraft.coffee}
          initialSize={orderDraft.size}
          initialQuantity={orderDraft.quantity}
          onBack={() => goBack('detail')}
          onNavigate={handleNavigate}
        />
      )}
      {currentPage === 'confirmation' && (
        <OrderConfirmation
          order={orderDraft}
          onBack={() => goBack('order')}
          onTrack={() => handleNavigate('tracking', orderDraft)}
        />
      )}
      {currentPage === 'tracking' && <Tracking order={orderDraft} onBack={() => goBack('confirmation')} />}
    </div>
  );

  const renderDesktopScreen = () => {
    if (currentPage === 'splash') {
      return <CoverPage onGetStarted={() => handleNavigate('home')} />;
    }

    return (
    <main className={`hidden lg:grid min-h-screen w-full ${
      currentPage === 'detail'
        ? 'grid-cols-[260px_minmax(0,1fr)_390px] xl:grid-cols-[280px_minmax(0,1fr)_430px] 2xl:grid-cols-[300px_minmax(0,1fr)_460px]'
        : 'grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] 2xl:grid-cols-[300px_minmax(0,1fr)]'
    } bg-[#F9F9F9] text-[#2F2D2C]`}>
      <aside className="bg-[#131313] text-white px-6 py-7 flex flex-col">
        <div>
          <p className="text-[#B7B7B7] text-[12px] mb-1 font-medium">Location</p>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-white text-[14px]">Beggur-koppa Road, Banglore</span>
            <ChevronDown size={16} className="text-[#B7B7B7]" />
          </div>
        </div>

        <div className="mt-10 space-y-3">
          {navItems.map((item, index) => {
            const Icon = navIcons[index];
            return (
              <button
                key={item}
                onClick={() => handleDesktopNav(index)}
                className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-[14px] font-semibold transition-all ${
                  activeDesktopNav === index
                    ? 'bg-[#C67C4E] text-white shadow-md shadow-[#C67C4E]/30'
                    : 'text-[#A3A3A3] hover:text-[#C67C4E] hover:bg-white/5'
                }`}
              >
                <span className="relative">
                  <Icon size={22} fill={activeDesktopNav === index ? 'currentColor' : 'none'} />
                  {index === 2 && totalCartItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#ED5151] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {totalCartItems}
                    </span>
                  )}
                </span>
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex-1 min-h-0 rounded-[16px] bg-[#9C6D52] overflow-hidden shadow-lg shadow-black/5 flex flex-col"
        >
          <div className="relative flex-1 min-h-[360px]">
            <img
              src={coffeeSplashImage}
              alt="Coffee Splash"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none"></div>
          </div>
          <div className="p-5 bg-black">
            <h1 className="text-4xl leading-[1.2] font-semibold text-white mb-4 tracking-tight">
              Fall in Love with<br />
              Coffee in Blissful<br />
              Delight!
            </h1>
            <p className="text-[#A3A3A3] text-[15px] leading-relaxed max-w-[280px]">
              Welcome to our cozy coffee corner, where
              every cup is a delightful for you.
            </p>
          </div>
        </motion.div>
      </aside>

      {currentPage === 'tracking' ? (
        <section className="min-w-0 overflow-hidden">
          <Tracking order={orderDraft} onBack={() => goBack('confirmation')} />
        </section>
      ) : currentPage === 'confirmation' ? (
        <section className="min-w-0 overflow-hidden">
          <OrderConfirmation
            order={orderDraft}
            onBack={() => goBack('order')}
            onTrack={() => handleNavigate('tracking', orderDraft)}
          />
        </section>
      ) : (
      <>
      <section className="min-w-0 flex flex-col overflow-hidden">
        <div className="bg-[#131313] px-8 xl:px-10 pt-7 pb-8">
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
            </div>
            <button className="w-[48px] h-[48px] rounded-2xl flex items-center justify-center shrink-0 transition-colors bg-[#C67C4E] hover:bg-[#b06f48]">
              <SlidersHorizontal size={20} className="text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 xl:px-10 py-8">
          {currentPage === 'order' ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#2F2D2C]">Your Bag</h2>
                <button onClick={() => handleDesktopNav(0)} className="text-[#C67C4E] text-[14px] font-bold hover:underline">
                  Continue shopping
                </button>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_360px] 2xl:grid-cols-[minmax(0,1.35fr)_390px]">
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-[#EAEAEA]/50">
                      <ShoppingBag size={48} className="text-[#EAEAEA] mx-auto mb-4" />
                      <p className="text-[#9B9B9B] text-[15px]">Your bag is empty</p>
                      <p className="text-[#9B9B9B] text-[13px] mt-1">Tap + to add items</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.name} className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[15px]">{item.name}</h3>
                          <p className="text-[#9B9B9B] text-[12px]">{item.tone}{item.size ? ` - ${item.size}` : ''}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCart((current) => current.map((cartItem) => cartItem.name === item.name ? { ...cartItem, qty: Math.max(1, cartItem.qty - 1) } : cartItem))}
                            className="w-7 h-7 rounded-full border border-[#EAEAEA] flex items-center justify-center text-[#2F2D2C] hover:bg-gray-50 active:scale-90 transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-[14px] font-bold w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => setCart((current) => current.map((cartItem) => cartItem.name === item.name ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem))}
                            className="w-7 h-7 rounded-full border border-[#EAEAEA] flex items-center justify-center text-[#2F2D2C] hover:bg-gray-50 active:scale-90 transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-bold text-[14px] text-[#C67C4E] w-16 text-right">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))
                  )}

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-[15px] font-bold text-[#2F2D2C]">Free delivery progress</h3>
                        <p className="text-[#9B9B9B] text-[12px] mt-0.5">
                          {cartSubtotal >= 10 ? 'Free delivery unlocked' : `$ ${(10 - cartSubtotal).toFixed(2)} away from free delivery`}
                        </p>
                      </div>
                      <span className="text-[#C67C4E] text-[12px] font-bold">{Math.round(freeDeliveryProgress)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#36C07E] rounded-full"
                        animate={{ width: `${freeDeliveryProgress}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <h3 className="text-[15px] font-bold text-[#2F2D2C] mb-3">You may also like</h3>
                    <div className="grid gap-3 md:grid-cols-3">
                      {recommendedAddOns.map((coffee) => (
                        <button
                          key={coffee.name}
                          onClick={() => addToCart(coffee)}
                          className="text-left rounded-2xl border border-[#EAEAEA] p-2 hover:border-[#C67C4E]/50 active:scale-[0.98] transition-all"
                        >
                          <img src={coffee.image} alt={coffee.name} className="w-full aspect-square rounded-xl object-cover mb-2" />
                          <h4 className="text-[13px] font-bold text-[#2F2D2C] truncate">{coffee.name}</h4>
                          <p className="text-[#9B9B9B] text-[11px] mt-0.5">{coffee.tone}</p>
                          <p className="text-[#C67C4E] text-[13px] font-bold mt-2">$ {coffee.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <h3 className="text-[15px] font-bold text-[#2F2D2C] mb-2">Order notes</h3>
                    <textarea
                      rows={3}
                      className="w-full bg-[#F5F5F5] rounded-xl px-4 py-3 text-[14px] text-[#2F2D2C] outline-none focus:ring-2 focus:ring-[#C67C4E]/40 resize-none transition-all"
                      placeholder="e.g. Extra sugar, no whipped cream, leave at door..."
                    />
                  </div>
                </div>

                <aside className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <h3 className="text-[15px] font-bold text-[#2F2D2C] mb-3">Delivery Address</h3>
                    <p className="text-[14px] font-bold text-[#2F2D2C]">Beggur-koppa Road</p>
                    <p className="text-[#9B9B9B] text-[12px] mt-1">Beggur-koppa Road, Banglore.</p>
                    <p className="text-[#C67C4E] text-[12px] font-bold mt-3">Estimated delivery: 10 mins</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <h3 className="text-[15px] font-bold text-[#2F2D2C] mb-3">Promo code</h3>
                    <div className="flex gap-2">
                      <input
                        value="FIRSTORDER"
                        readOnly
                        className="min-w-0 flex-1 bg-[#F5F5F5] rounded-xl px-4 py-3 text-[14px] text-[#2F2D2C] outline-none"
                      />
                      <button className="bg-[#C67C4E] text-white text-[13px] font-semibold px-4 rounded-xl shadow-lg shadow-[#C67C4E]/20">
                        Apply
                      </button>
                    </div>
                    <p className="text-[#36C07E] text-[12px] mt-3">You saved $ {cartDiscount.toFixed(2)} on this order</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <h3 className="text-[15px] font-bold text-[#2F2D2C] mb-3">Payment Summary</h3>
                    <div className="space-y-3 text-[14px]">
                      <div className="flex justify-between">
                        <span className="text-[#2F2D2C]">Subtotal</span>
                        <span className="font-bold">$ {cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#2F2D2C]">Delivery Fee</span>
                        <span className="font-bold">$ {cartDeliveryFee.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#2F2D2C]">Taxes</span>
                        <span className="font-bold">$ {cartTaxes.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#36C07E]">Discount (10%)</span>
                        <span className="font-bold text-[#36C07E]">- $ {cartDiscount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="h-[1px] bg-[#EAEAEA] my-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[16px] font-bold text-[#2F2D2C]">Total</span>
                      <span className="text-[#C67C4E] text-[22px] font-bold">$ {cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-[15px] font-bold text-[#2F2D2C]">Cash/Wallet</h3>
                        <p className="text-[#9B9B9B] text-[12px] mt-1">Gold member rewards +24 pts</p>
                      </div>
                      <Check size={18} className="text-[#C67C4E]" />
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (cart[0]) {
                        createOrderDraft({ coffee: cart[0], size: cart[0].size || selectedSize, quantity: cart[0].qty });
                      }
                      handleNavigate('confirmation', cart[0] ? { coffee: cart[0], size: cart[0].size || selectedSize, quantity: cart[0].qty } : orderDraft);
                    }}
                    className="w-full bg-[#C67C4E] hover:bg-[#b06f48] transition-colors text-white font-semibold text-[16px] py-4 rounded-[16px] shadow-lg shadow-[#C67C4E]/30"
                  >
                    Checkout
                  </motion.button>
                </aside>
              </div>
            </div>
          ) : activeDesktopNav === 3 ? (
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
          ) : activeDesktopNav === 2 ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-bold text-[#2F2D2C]">Your Bag</h2>
                <button onClick={() => handleDesktopNav(0)} className="text-[#C67C4E] text-[14px] font-bold hover:underline">
                  Continue shopping
                </button>
              </div>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_360px] 2xl:grid-cols-[minmax(0,1.35fr)_390px]">
                <div className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-[#EAEAEA]/50">
                      <ShoppingBag size={48} className="text-[#EAEAEA] mx-auto mb-4" />
                      <p className="text-[#9B9B9B] text-[15px]">Your bag is empty</p>
                      <p className="text-[#9B9B9B] text-[13px] mt-1">Tap + to add items</p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.name} className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[15px]">{item.name}</h3>
                          <p className="text-[#9B9B9B] text-[12px]">{item.tone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCart((current) => current.map((cartItem) => cartItem.name === item.name ? { ...cartItem, qty: Math.max(1, cartItem.qty - 1) } : cartItem))}
                            className="w-7 h-7 rounded-full border border-[#EAEAEA] flex items-center justify-center text-[#2F2D2C] hover:bg-gray-50 active:scale-90 transition-all"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-[14px] font-bold w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => setCart((current) => current.map((cartItem) => cartItem.name === item.name ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem))}
                            className="w-7 h-7 rounded-full border border-[#EAEAEA] flex items-center justify-center text-[#2F2D2C] hover:bg-gray-50 active:scale-90 transition-all"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="font-bold text-[14px] text-[#C67C4E] w-16 text-right">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))
                  )}

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-[15px] font-bold text-[#2F2D2C]">Free delivery progress</h3>
                        <p className="text-[#9B9B9B] text-[12px] mt-0.5">
                          {cartSubtotal >= 10 ? 'Free delivery unlocked' : `$ ${(10 - cartSubtotal).toFixed(2)} away from free delivery`}
                        </p>
                      </div>
                      <span className="text-[#C67C4E] text-[12px] font-bold">{Math.round(freeDeliveryProgress)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#36C07E] rounded-full"
                        animate={{ width: `${freeDeliveryProgress}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <h3 className="text-[15px] font-bold text-[#2F2D2C] mb-3">You may also like</h3>
                    <div className="grid gap-3 md:grid-cols-3">
                      {recommendedAddOns.map((coffee) => (
                        <button
                          key={coffee.name}
                          onClick={() => addToCart(coffee)}
                          className="text-left rounded-2xl border border-[#EAEAEA] p-2 hover:border-[#C67C4E]/50 active:scale-[0.98] transition-all"
                        >
                          <img src={coffee.image} alt={coffee.name} className="w-full aspect-square rounded-xl object-cover mb-2" />
                          <h4 className="text-[13px] font-bold text-[#2F2D2C] truncate">{coffee.name}</h4>
                          <p className="text-[#9B9B9B] text-[11px] mt-0.5">{coffee.tone}</p>
                          <p className="text-[#C67C4E] text-[13px] font-bold mt-2">$ {coffee.price}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <h3 className="text-[15px] font-bold text-[#2F2D2C] mb-2">Order notes</h3>
                    <textarea
                      rows={3}
                      className="w-full bg-[#F5F5F5] rounded-xl px-4 py-3 text-[14px] text-[#2F2D2C] outline-none focus:ring-2 focus:ring-[#C67C4E]/40 resize-none transition-all"
                      placeholder="e.g. Extra sugar, no whipped cream, leave at door..."
                    />
                  </div>
                </div>

                <aside className="space-y-4">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <h3 className="text-[15px] font-bold text-[#2F2D2C] mb-3">Delivery Address</h3>
                    <p className="text-[14px] font-bold text-[#2F2D2C]">Beggur-koppa Road</p>
                    <p className="text-[#9B9B9B] text-[12px] mt-1">Beggur-koppa Road, Banglore.</p>
                    <p className="text-[#C67C4E] text-[12px] font-bold mt-3">Estimated delivery: 10 mins</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <h3 className="text-[15px] font-bold text-[#2F2D2C] mb-3">Promo code</h3>
                    <div className="flex gap-2">
                      <input
                        value="FIRSTORDER"
                        readOnly
                        className="min-w-0 flex-1 bg-[#F5F5F5] rounded-xl px-4 py-3 text-[14px] text-[#2F2D2C] outline-none"
                      />
                      <button className="bg-[#C67C4E] text-white text-[13px] font-semibold px-4 rounded-xl shadow-lg shadow-[#C67C4E]/20">
                        Apply
                      </button>
                    </div>
                    <p className="text-[#36C07E] text-[12px] mt-3">You saved $ {cartDiscount.toFixed(2)} on this order</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <h3 className="text-[15px] font-bold text-[#2F2D2C] mb-3">Payment Summary</h3>
                    <div className="space-y-3 text-[14px]">
                      <div className="flex justify-between">
                        <span className="text-[#2F2D2C]">Subtotal</span>
                        <span className="font-bold">$ {cartSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#2F2D2C]">Delivery Fee</span>
                        <span className="font-bold">$ {cartDeliveryFee.toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#2F2D2C]">Taxes</span>
                        <span className="font-bold">$ {cartTaxes.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#36C07E]">Discount (10%)</span>
                        <span className="font-bold text-[#36C07E]">- $ {cartDiscount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="h-[1px] bg-[#EAEAEA] my-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[16px] font-bold text-[#2F2D2C]">Total</span>
                      <span className="text-[#C67C4E] text-[22px] font-bold">$ {cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAEAEA]/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-[15px] font-bold text-[#2F2D2C]">Cash/Wallet</h3>
                        <p className="text-[#9B9B9B] text-[12px] mt-1">Gold member rewards +24 pts</p>
                      </div>
                      <Check size={18} className="text-[#C67C4E]" />
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (cart[0]) {
                        createOrderDraft({ coffee: cart[0], size: selectedSize, quantity: cart[0].qty });
                      }
                      handleNavigate('confirmation', cart[0] ? { coffee: cart[0], size: selectedSize, quantity: cart[0].qty } : orderDraft);
                    }}
                    className="w-full bg-[#C67C4E] hover:bg-[#b06f48] transition-colors text-white font-semibold text-[16px] py-4 rounded-[16px] shadow-lg shadow-[#C67C4E]/30"
                  >
                    Checkout
                  </motion.button>
                </aside>
              </div>
            </div>
          ) : (
            <>
              <div className="relative w-full h-[180px] rounded-[16px] bg-[#9C6D52] overflow-hidden shadow-lg shadow-black/5 mb-8">
            <motion.div
              initial={{ opacity: 0, x: 34, scale: 1.04 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute top-0 right-0 w-[34%] min-w-[280px] h-full overflow-hidden z-0"
            >
              <motion.img
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                src="https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80"
                alt="Promo Coffee"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#9C6D52] to-transparent"></div>
            </motion.div>
            <div className="absolute inset-0 pl-6 py-5 flex flex-col justify-center items-start z-10">
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

              <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6">
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

              {activeDesktopNav === 1 && favoriteCoffees.length === 0 && (
                <div className="text-center py-16">
                  <Heart size={48} className="text-[#EAEAEA] mx-auto mb-4" />
                  <p className="text-[#9B9B9B] text-[15px]">No favorites yet</p>
                  <p className="text-[#9B9B9B] text-[13px] mt-1">Tap the ♡ on any coffee to add it here</p>
                </div>
              )}

              <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {displayedCoffees.map((coffee, index) => (
              <motion.button
                key={coffee.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                onClick={() => handleSelectCoffee(coffee)}
                className="bg-white rounded-2xl p-2 flex flex-col hover:-translate-y-1 transition-transform duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-left"
              >
                <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
                  <img src={coffee.image} alt={coffee.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="text-[#C67C4E] text-[10px]">★</span>
                    <span className="text-white text-[10px] font-semibold">{coffee.rating}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-[16px] mb-1 px-1">{coffee.name}</h3>
                <p className="text-[#9B9B9B] text-[12px] mb-3 px-1">{coffee.tone}</p>
                <div className="flex justify-between items-center mt-auto px-1 pb-1">
                  <div className="font-semibold text-[18px]">
                    <span className="font-bold mr-1 text-[#2F2D2C]">$</span>
                    {coffee.price}
                  </div>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart(coffee);
                    }}
                    className="bg-[#C67C4E] w-[32px] h-[32px] rounded-xl flex items-center justify-center text-white font-bold text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </motion.button>
            ))}
              </div>
            </>
          )}
        </div>
      </section>

      {currentPage === 'detail' && (
      <aside className="bg-white border-l border-[#EAEAEA] flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-7">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-[18px] font-semibold text-[#2F2D2C]">Detail</h1>
            <button onClick={() => toggleFavorite(selectedCoffee)} className="w-10 h-10 flex items-center justify-end hover:opacity-70 active:scale-90 transition-all">
              <Heart
                size={24}
                className={favorites.includes(selectedCoffee.name) ? 'fill-[#ED5151] text-[#ED5151]' : 'text-[#2F2D2C]'}
              />
            </button>
          </div>

          <div className="w-full h-[220px] rounded-3xl overflow-hidden mb-5 shadow-sm">
            <img src={selectedCoffee.image} alt={selectedCoffee.name} className="w-full h-full object-cover" />
          </div>

          <div className="mb-2">
            <h2 className="text-[22px] font-bold text-[#2F2D2C] mb-1">{selectedCoffee.name}</h2>
            <p className="text-[#9B9B9B] text-[13px]">{selectedCoffee.tone}</p>
          </div>

          <div className="flex items-center gap-1.5 mt-2 mb-4">
            <Star size={20} className="fill-[#FBBE21] text-[#FBBE21]" />
            <span className="text-[16px] font-bold text-[#2F2D2C]">{selectedCoffee.rating}</span>
            <span className="text-[#9B9B9B] text-[12px] ml-1">(230)</span>
          </div>

          <div className="w-full h-[1px] bg-[#EAEAEA] mb-5"></div>

          <div className="mb-6">
            <h3 className="text-[16px] font-bold text-[#2F2D2C] mb-3">Description</h3>
            <p className="text-[#9B9B9B] text-[14px] leading-[1.6]">
              {fullDescription.slice(0, 140)}... <span className="text-[#C67C4E] font-bold">Read More</span>
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-[16px] font-bold text-[#2F2D2C] mb-3">Size</h3>
            <div className="flex gap-3">
              {['S', 'M', 'L'].map((size) => (
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

          <div className="hidden">
            <h1 className="text-[18px] font-semibold text-[#2F2D2C] mb-5">Order</h1>
            <div className="bg-[#F2F2F2] rounded-2xl p-1.5 flex mb-6">
              <button
                onClick={() => setDeliveryMode('deliver')}
                className={`flex-1 py-2 rounded-xl text-[15px] font-semibold transition-colors ${deliveryMode === 'deliver' ? 'bg-[#C67C4E] text-white shadow-sm' : 'text-[#2F2D2C]'}`}
              >
                Deliver
              </button>
              <button
                onClick={() => setDeliveryMode('pickup')}
                className={`flex-1 py-2 rounded-xl text-[15px] font-semibold transition-colors ${deliveryMode === 'pickup' ? 'bg-[#C67C4E] text-white shadow-sm' : 'text-[#2F2D2C]'}`}
              >
                Pick Up
              </button>
            </div>

            {deliveryMode === 'deliver' && (
              <div className="mb-5">
                <h2 className="text-[18px] font-bold text-[#2F2D2C] mb-3">Delivery Address</h2>
                <h3 className="text-[15px] font-bold text-[#2F2D2C] mb-1">Beggur-koppa Road</h3>
                <p className="text-[#9B9B9B] text-[13px] mb-2">Beggur-koppa Road, Banglore.</p>
              </div>
            )}

            <div className="flex items-center gap-4 mb-5">
              <img src={selectedCoffee.image} alt={selectedCoffee.name} className="w-[54px] h-[54px] rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="text-[16px] font-bold text-[#2F2D2C]">{selectedCoffee.name}</h3>
                <p className="text-[#9B9B9B] text-[12px] mt-0.5">{selectedCoffee.tone} - {selectedSize}</p>
              </div>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 rounded-full border border-[#EAEAEA] flex items-center justify-center text-[#2F2D2C] hover:bg-gray-50 active:scale-90 transition-all">
                <Minus size={14} />
              </button>
              <span className="text-[14px] font-bold w-3 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 rounded-full border border-[#EAEAEA] flex items-center justify-center text-[#2F2D2C] hover:bg-gray-50 active:scale-90 transition-all">
                <Plus size={14} />
              </button>
            </div>

            <div className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#EAEAEA] bg-white mb-6">
              <span className="text-[14px] font-bold text-[#2F2D2C]">10% Off — First Order Discount</span>
              <Check size={16} className="text-[#C67C4E]" />
            </div>

            <h2 className="text-[18px] font-bold text-[#2F2D2C] mb-4">Payment Summary</h2>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#2F2D2C] text-[14px]">Price</span>
              <span className="text-[#2F2D2C] text-[14px] font-bold">$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#36C07E] text-[14px]">Discount (10%)</span>
              <span className="text-[#36C07E] text-[14px] font-bold">- $ {discountAmount.toFixed(2)}</span>
            </div>
            {deliveryMode === 'deliver' && (
              <div className="flex justify-between items-center">
                <span className="text-[#2F2D2C] text-[14px]">Delivery Fee</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#2F2D2C] text-[14px] line-through">$ 2.0</span>
                  <span className="text-[#2F2D2C] text-[14px] font-bold">$ 1.0</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-t-3xl px-6 py-5 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex items-center justify-between z-20">
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
            onClick={handleDesktopPrimaryAction}
            className="bg-[#C67C4E] hover:bg-[#b06f48] transition-colors text-white font-semibold text-[16px] py-4 px-[70px] rounded-[16px] shadow-lg shadow-[#C67C4E]/30"
          >
            Buy Now
          </motion.button>
        </div>
      </aside>
      )}
      </>
      )}
    </main>
    );
  };

  return (
    <div className="app-responsive-stage w-full min-h-screen bg-black text-white relative overflow-hidden">
      {renderMobileScreen()}
      {renderDesktopScreen()}
    </div>
  );
}

export default App;
