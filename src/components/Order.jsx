import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgePercent,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Minus,
  NotebookText,
  PenLine,
  Plus,
} from 'lucide-react';

const StatusBar = () => (
  <div className="h-[44px] px-5 flex items-center justify-between text-[#242424]">
    <span className="text-[15px] leading-none font-semibold tracking-[-0.2px]">9:41</span>
    <div className="flex items-center gap-1.5">
      <div className="flex items-end gap-[2px] h-[12px]">
        <span className="w-[3px] h-[4px] rounded-[1px] bg-[#242424]" />
        <span className="w-[3px] h-[6px] rounded-[1px] bg-[#242424]" />
        <span className="w-[3px] h-[8px] rounded-[1px] bg-[#242424]" />
        <span className="w-[3px] h-[10px] rounded-[1px] bg-[#242424]" />
      </div>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
        <path d="M1 3.8C4.9.4 10.1.4 14 3.8" stroke="#242424" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M3.7 6.4c2.2-1.8 5.4-1.8 7.6 0" stroke="#242424" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M6.4 8.9c.7-.5 1.5-.5 2.2 0" stroke="#242424" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <div className="w-[20px] h-[9px] rounded-[2px] border border-[#242424]/70 relative">
        <div className="absolute -right-[3px] top-[2px] w-[2px] h-[4px] rounded-r-[1px] bg-[#242424]/70" />
        <div className="absolute left-[2px] top-[2px] h-[3px] w-[14px] rounded-[1px] bg-[#242424]" />
      </div>
    </div>
  </div>
);

const QuantityButton = ({ children, onClick, label }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="w-5 h-5 rounded-full bg-white border border-[#EDEDED] flex items-center justify-center text-[#2F2D2C] shadow-[0_1px_3px_rgba(0,0,0,0.04)] active:scale-90 transition-transform"
  >
    {children}
  </button>
);

const Order = ({ coffee, initialSize = 'M', initialQuantity = 1, onBack, onNavigate }) => {
  const [deliveryMode, setDeliveryMode] = useState('deliver');
  const [quantity, setQuantity] = useState(initialQuantity);

  const deliveryFee = deliveryMode === 'deliver' ? 1 : 0;
  const total = useMemo(
    () => coffee.price * quantity + deliveryFee,
    [coffee.price, deliveryFee, quantity]
  );

  return (
    <motion.main
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="min-h-[100dvh] w-full bg-[#F9F9F9] text-[#2F2D2C] flex flex-col overflow-hidden"
    >
      <StatusBar />

      <header className="relative h-[82px] px-5 flex items-start justify-center pt-[36px]">
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="absolute left-[31px] top-[35px] w-8 h-8 flex items-start justify-start text-[#2F2D2C] active:scale-90 transition-transform"
        >
          <ChevronLeft size={22} strokeWidth={1.7} />
        </button>
        <h1 className="text-[17px] font-bold tracking-[-0.2px] leading-none">Order</h1>
      </header>

      <section className="px-5 pb-[148px] flex-1 overflow-y-auto no-scrollbar">
        <div className="h-[38px] rounded-[10px] bg-[#EDEDED] p-1 flex mb-[22px]">
          {[
            ['deliver', 'Deliver'],
            ['pickup', 'Pick Up'],
          ].map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => setDeliveryMode(mode)}
              className={`flex-1 rounded-[7px] text-[15px] leading-none font-semibold transition-all duration-200 ${
                deliveryMode === mode
                  ? 'bg-[#C67C4E] text-white shadow-[0_4px_10px_rgba(198,124,78,0.18)]'
                  : 'text-[#2F2D2C]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <section className="mb-[14px]">
          <h2 className="text-[16px] font-bold leading-none mb-[19px]">Delivery Address</h2>
          <p className="text-[14px] font-bold leading-none mb-[8px]">Jl. Kpg Sutoyo</p>
          <p className="text-[12px] leading-none text-[#A2A2A2] mb-[14px]">
            Kpg. Sutoyo No. 620, Bilzen, Tanjungbalai.
          </p>
          <div className="flex items-center gap-[7px]">
            <button
              type="button"
              className="h-[24px] px-[10px] rounded-full bg-white border border-[#CFCFCF] flex items-center gap-[4px] text-[12px] leading-none text-[#2F2D2C] active:scale-[0.98] transition-transform"
            >
              <PenLine size={12} strokeWidth={1.8} />
              Edit Address
            </button>
            <button
              type="button"
              className="h-[24px] px-[10px] rounded-full bg-white border border-[#CFCFCF] flex items-center gap-[4px] text-[12px] leading-none text-[#2F2D2C] active:scale-[0.98] transition-transform"
            >
              <NotebookText size={12} strokeWidth={1.8} />
              Add Note
            </button>
          </div>
        </section>

        <div className="mx-[14px] h-px bg-[#EAEAEA] mb-[15px]" />

        <section className="flex items-center gap-[14px] mb-[17px]">
          <img
            src={coffee.image}
            alt={coffee.name}
            loading="lazy"
            className="w-[54px] h-[54px] rounded-[8px] object-cover"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-bold leading-none mb-[8px]">{coffee.name}</h3>
            <p className="text-[12px] leading-none text-[#A2A2A2]">{coffee.tone}</p>
          </div>
          <div className="flex items-center gap-[17px]">
            <QuantityButton
              label="Decrease quantity"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              <Minus size={12} strokeWidth={2} />
            </QuantityButton>
            <span className="w-[10px] text-center text-[14px] font-semibold leading-none">{quantity}</span>
            <QuantityButton
              label="Increase quantity"
              onClick={() => setQuantity((current) => current + 1)}
            >
              <Plus size={12} strokeWidth={2} />
            </QuantityButton>
          </div>
        </section>

        <div className="mx-[-20px] h-[4px] bg-[#F2F2F2] mb-[16px]" />

        <button
          type="button"
          className="w-full h-[50px] bg-white rounded-[14px] border border-[#EAEAEA] shadow-[0_2px_10px_rgba(0,0,0,0.025)] flex items-center justify-between px-[15px] mb-[24px] active:scale-[0.99] transition-transform"
        >
          <span className="flex items-center gap-[14px] text-[14px] font-bold leading-none">
            <BadgePercent size={16} strokeWidth={1.8} className="text-[#C67C4E]" />
            1 Discount is Applies
          </span>
          <ChevronRight size={19} strokeWidth={1.7} />
        </button>

        <section>
          <h2 className="text-[16px] font-bold leading-none mb-[22px]">Payment Summary</h2>
          <div className="space-y-[15px]">
            <div className="flex items-center justify-between text-[14px] leading-none">
              <span>Price</span>
              <span className="font-bold">$ {(coffee.price * quantity).toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-[14px] leading-none">
              <span>Delivery Fee</span>
              <span className="font-bold">
                <span className="font-normal line-through mr-[7px]">$ 2.0</span>
                $ {deliveryFee.toFixed(1)}
              </span>
            </div>
          </div>
        </section>
      </section>

      <footer className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[16px] px-5 pt-[15px] pb-[39px] shadow-[0_-8px_22px_rgba(0,0,0,0.035)]">
        <div className="flex items-center justify-between mb-[9px]">
          <div className="flex items-center gap-[13px]">
            <CircleDollarSign size={18} strokeWidth={1.7} className="text-[#C67C4E]" />
            <div>
              <p className="text-[14px] leading-none font-bold mb-[7px]">Cash/Wallet</p>
              <p className="text-[12px] leading-none font-semibold text-[#C67C4E]">$ {total.toFixed(2)}</p>
            </div>
          </div>
          <ChevronDown size={20} strokeWidth={1.7} />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={() => onNavigate && onNavigate('confirmation', { coffee, size: initialSize, quantity })}
          className="w-full h-[50px] rounded-[14px] bg-[#C67C4E] text-white text-[16px] font-bold leading-none shadow-[0_10px_20px_rgba(198,124,78,0.2)]"
        >
          Order
        </motion.button>

        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[120px] h-[4px] rounded-full bg-[#111111]" />
      </footer>
    </motion.main>
  );
};

export default Order;
