'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import gsap from 'gsap'
import {
  Bell,
  Bike,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  Home,
  MapPin,
  Minus,
  Package,
  Plus,
  Search,
  Settings2,
  ShoppingBag,
  Star,
  User,
  WalletCards,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { CoffeeScene } from '@/components/three/coffee-scene'
import { categories, coffees, navItems } from '@/constants/coffee'
import { cn } from '@/lib/utils'

const publicImage = (fileName) => `${import.meta.env.BASE_URL}images/${fileName}`

const navIcons = [Home, Heart, ShoppingBag, Bell]

function Magnetic({ children, className }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 180, damping: 16 })
  const smoothY = useSpring(y, { stiffness: 180, damping: 16 })

  return (
    <motion.div
      style={{ x: smoothX, y: smoothY }}
      className={className}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        x.set((event.clientX - rect.left - rect.width / 2) * 0.18)
        y.set((event.clientY - rect.top - rect.height / 2) * 0.18)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

function TiltCard({ children, className }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useTransform(my, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(mx, [-0.5, 0.5], [-8, 8])

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18 }}
      className={className}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        mx.set((event.clientX - rect.left) / rect.width - 0.5)
        my.set((event.clientY - rect.top) / rect.height - 0.5)
      }}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}

function SplashPanel() {
  return (
    <section className="relative min-h-[760px] overflow-hidden rounded-[34px] bg-[#080706] px-6 pb-8 pt-5 text-white shadow-[0_35px_120px_rgba(0,0,0,0.6)] md:min-h-[720px] md:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_25%,rgba(255,176,103,0.22),transparent_26%),linear-gradient(180deg,transparent_30%,#080706_76%)]" />
      <img
        src={publicImage('splash-reference.png')}
        alt="Coffee cup with floating beans"
        className="absolute inset-x-0 top-0 h-[62%] w-full object-cover opacity-85"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 mt-[490px] text-center md:mt-[450px]"
      >
        <h1 className="text-[32px] font-bold leading-tight md:text-5xl">
          Fall in Love with
          <span className="block">Coffee in Blissful</span>
          <span className="block">Delight!</span>
        </h1>
        <p className="mx-auto mt-4 max-w-[310px] text-sm leading-6 text-white/62">
          Welcome to our cozy coffee corner, where every cup is a delightful for
          you.
        </p>
        <Magnetic className="mx-auto mt-8 max-w-[292px]">
          <Button className="h-[58px] w-full rounded-2xl text-base">
            Get Started
          </Button>
        </Magnetic>
      </motion.div>
    </section>
  )
}

function ProductCard({ coffee, index, onSelect }) {
  return (
    <TiltCard className="group cursor-pointer rounded-[22px] bg-white p-2 text-[#24201f] shadow-[0_18px_50px_rgba(10,8,6,0.12)] dark:bg-white/[0.08] dark:text-white">
      <div className="relative h-32 overflow-hidden rounded-[16px]" onClick={() => onSelect && onSelect(coffee)}>
        <img
          src={coffee.image}
          alt={coffee.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/45 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
          <Star className="h-3 w-3 fill-[#FBBF24] text-[#FBBF24]" />
          {coffee.rating}
        </div>
      </div>
      <div className="px-1 py-3" onClick={() => onSelect && onSelect(coffee)}>
        <h3 className="font-bold">{coffee.name}</h3>
        <p className="mt-1 text-xs text-black/45 dark:text-white/48">
          {coffee.tone}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-extrabold">$ {coffee.price}</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="grid h-8 w-8 place-items-center rounded-lg bg-[#C67C4E] text-white shadow-[0_10px_24px_rgba(198,124,78,0.38)]"
            aria-label={`Add ${coffee.name}`}
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
      <span className="sr-only">Product {index + 1}</span>
    </TiltCard>
  )
}

function HomePanel() {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-[#f6f4f2] pb-24 text-[#252222] shadow-[0_35px_120px_rgba(0,0,0,0.35)]">
      <div className="rounded-b-[32px] bg-[linear-gradient(135deg,#1f1f1f,#0b0b0b)] px-6 pb-16 pt-5 text-white">

        <p className="mt-8 text-xs text-white/50">Location</p>
        <button className="mt-2 flex items-center gap-1 text-sm font-semibold">
          Beggur-koppa Road, Banglore <ChevronDown className="h-3 w-3" />
        </button>
        <div className="mt-6 flex gap-4">
          <label className="flex h-[54px] flex-1 items-center gap-3 rounded-xl bg-white/9 px-4 text-white/55 ring-1 ring-white/5 transition focus-within:ring-[#FFB067]/60">
            <Search className="h-5 w-5" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/48"
              placeholder="Search coffee"
            />
          </label>
          <button className="grid h-[54px] w-[54px] place-items-center rounded-xl bg-[#C67C4E] text-white">
            <Settings2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-6 -mt-11 overflow-hidden rounded-2xl bg-[#a98263] px-5 py-4 text-white"
      >
        <img
          src={publicImage('home-reference.png')}
          alt=""
          className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-55 mix-blend-screen"
        />
        <span className="rounded-lg bg-[#ff4f4f] px-2 py-1 text-xs font-bold">
          Promo
        </span>
        <h2 className="relative mt-3 max-w-[220px] text-[29px] font-extrabold leading-none">
          Buy one get one FREE
        </h2>
      </motion.div>
      <div className="mt-5 flex gap-3 overflow-x-auto px-6 no-scrollbar">
        {categories.map((category, index) => (
          <button
            key={category}
            className={cn(
              'shrink-0 rounded-lg px-4 py-2 text-sm transition',
              index === 0
                ? 'bg-[#C67C4E] text-white'
                : 'bg-white text-[#2f2b29]',
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 px-6">
        {coffees.map((coffee, index) => (
          <ProductCard key={coffee.name} coffee={coffee} index={index} />
        ))}
      </div>
      <BottomNav />
    </section>
  )
}

function BottomNav() {
  return (
    <nav className="absolute bottom-0 left-0 right-0 flex h-[88px] items-center justify-around rounded-t-[26px] bg-white px-6 text-[#9a9692] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
      {navItems.map((item, index) => {
        const Icon = navIcons[index]
        return (
          <button
            key={item}
            className={cn(
              'relative flex flex-col items-center gap-1.5',
              index === 0 && 'text-[#C67C4E]',
            )}
            aria-label={item}
          >
            <Icon className="h-6 w-6" />
            <span className="text-[11px] font-semibold">{item}</span>
          </button>
        )
      })}
    </nav>
  )
}

function DetailPanel({ coffee }) {
  const item = coffee || coffees[0]
  return (
    <section className="rounded-[32px] bg-[#f9f9f9] px-6 pb-7 pt-5 text-[#282423] shadow-[0_35px_120px_rgba(0,0,0,0.28)]">

      <div className="mt-10 flex items-center justify-between">
        <ChevronLeft className="h-5 w-5" />
        <h2 className="font-bold">Detail</h2>
        <Heart className="h-5 w-5" />
      </div>
      <div className="mt-8 h-[180px] overflow-hidden rounded-[14px]">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-5 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">{item.name}</h2>
          <p className="mt-1 text-sm text-black/35">{item.tone}</p>
          <div className="mt-3 flex items-center gap-2">
            <Star className="h-5 w-5 fill-[#FBBF24] text-[#FBBF24]" />
            <span className="font-bold">{item.rating}</span>
            <span className="text-sm text-black/35">(230)</span>
          </div>
        </div>
        <div className="flex gap-3 text-[#C67C4E]">
          {[Bike, Package, CreditCard].map((Icon) => (
            <span
              key={Icon.displayName}
              className="grid h-11 w-11 place-items-center rounded-xl bg-black/[0.03]"
            >
              <Icon className="h-5 w-5" />
            </span>
          ))}
        </div>
      </div>
      <div className="my-5 h-px bg-black/8" />
      <h3 className="font-bold">Description</h3>
      <p className="mt-3 text-sm leading-6 text-black/35">
        A cappuccino is an approximately 150 ml beverage, with 25 ml espresso
        coffee and 85 ml of fresh milk the fo...
        <span className="font-bold text-[#C67C4E]"> Read More</span>
      </p>
      <h3 className="mt-6 font-bold">Size</h3>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {['S', 'M', 'L'].map((size) => (
          <button
            key={size}
            className={cn(
              'h-10 rounded-xl border text-sm',
              size === 'M'
                ? 'border-[#C67C4E] bg-[#fff5ef] text-[#C67C4E]'
                : 'border-black/10 bg-white',
            )}
          >
            {size}
          </button>
        ))}
      </div>
      <div className="-mx-6 mt-6 flex items-center justify-between rounded-t-[24px] bg-white px-6 py-4 shadow-[0_-16px_50px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-sm text-black/35">Price</p>
          <motion.p
            key={`price-${item.name}`}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-1 text-lg font-bold text-[#C67C4E]"
          >
            $ {item.price}
          </motion.p>
        </div>
        <Button className="h-[50px] w-[194px] rounded-2xl">Buy Now</Button>
      </div>
    </section>
  )
}

function OrderPanel({ coffee }) {
  const item = coffee || coffees[0]
  return (
    <GlassCard className="bg-[#f8f8f8] p-6 text-[#282423]">
      <div className="flex items-center justify-between">
        <ChevronLeft className="h-5 w-5" />
        <h2 className="font-bold">Order</h2>
        <span className="h-5 w-5" />
      </div>
      <div className="mt-8 grid grid-cols-2 rounded-xl bg-black/[0.06] p-1">
        <button className="h-9 rounded-lg bg-[#C67C4E] font-semibold text-white">
          Deliver
        </button>
        <button className="h-9 rounded-lg">Pick Up</button>
      </div>
      <h3 className="mt-6 font-bold">Delivery Address</h3>
      <p className="mt-4 font-bold">Beggur-koppa Road</p>
      <p className="mt-1 text-xs text-black/35">
        Beggur-koppa Road, Banglore.
      </p>
      <div className="mt-4 flex gap-2">
        <button className="rounded-full border border-black/15 px-3 py-1 text-xs">
          Edit Address
        </button>
        <button className="rounded-full border border-black/15 px-3 py-1 text-xs">
          Add Note
        </button>
      </div>
      <div className="my-4 h-px bg-black/8" />
      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="h-14 w-14 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-bold">{item.name}</h3>
          <p className="text-xs text-black/35">{item.tone}</p>
        </div>
        <button className="grid h-7 w-7 place-items-center rounded-full bg-white">
          <Minus className="h-4 w-4" />
        </button>
        <span className="font-semibold">1</span>
        <button className="grid h-7 w-7 place-items-center rounded-full bg-white">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-8 rounded-2xl border border-black/8 bg-white px-4 py-4 font-semibold">
        <div className="flex items-center justify-between">
          <span>1 Discount is Applies</span>
          <ChevronRight className="h-5 w-5" />
        </div>
      </div>
      <h3 className="mt-6 font-bold">Payment Summary</h3>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Price</span>
          <strong>$ {item.price}</strong>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee</span>
          <strong>
            <span className="mr-2 text-black/40 line-through">$ 2.0</span>$ 1.0
          </strong>
        </div>
      </div>
      <div className="-mx-6 -mb-6 mt-8 rounded-t-[24px] bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <WalletCards className="h-5 w-5 text-[#C67C4E]" />
            <div>
              <p className="text-sm font-bold">Cash/Wallet</p>
              <p className="text-xs text-[#C67C4E]">$ {(item.price + 1.0).toFixed(2)}</p>
            </div>
          </div>
          <ChevronDown className="h-5 w-5" />
        </div>
        <Button className="w-full rounded-2xl">Order</Button>
      </div>
    </GlassCard>
  )
}

function TrackingPanel() {
  return (
    <GlassCard className="overflow-hidden bg-[#f7f7f7] text-[#282423]">
      <div className="relative h-[410px] bg-[#ededed]">
        <div className="map-grid absolute inset-0 opacity-70" />
        <button className="absolute left-6 top-12 grid h-11 w-11 place-items-center rounded-xl bg-white/90 shadow">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button className="absolute right-6 top-12 grid h-11 w-11 place-items-center rounded-xl bg-white/90 shadow">
          <MapPin className="h-5 w-5" />
        </button>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 360 410">
          <motion.path
            d="M70 210 L95 210 L95 178 L136 178 L136 150 L235 150 L262 140 L262 275"
            fill="none"
            stroke="#C67C4E"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>
        <motion.div
          animate={{ x: [0, 110, 190], y: [0, -32, 62] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute left-[70px] top-[200px] grid h-9 w-9 place-items-center rounded-full bg-white text-[#C67C4E] shadow-lg"
        >
          <Bike className="h-4 w-4" />
        </motion.div>
      </div>
      <div className="-mt-8 rounded-t-[28px] bg-white px-6 pb-6 pt-7">
        <div className="mx-auto mb-4 h-1 w-11 rounded-full bg-black/12" />
        <h2 className="text-center text-lg font-bold">10 minutes left</h2>
        <p className="mt-1 text-center text-sm text-black/35">
          Delivery to <strong className="text-black/70">Jl. Kpg Sutoyo</strong>
        </p>
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((step) => (
            <span
              key={step}
              className={cn(
                'h-1 rounded-full',
                step < 3 ? 'bg-[#36C27E]' : 'bg-black/10',
              )}
            />
          ))}
        </div>
        <div className="mt-5 flex gap-4 rounded-2xl border border-black/10 p-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl border border-black/8 text-[#C67C4E]">
            <Bike className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold">Delivered your order</h3>
            <p className="mt-1 text-xs leading-5 text-black/35">
              We will deliver your goods to you in the shortest possible time.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <img
            src={publicImage('tracking-reference.png')}
            alt=""
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h3 className="font-bold">Brooklyn Simmons</h3>
            <p className="text-sm text-black/35">Personal Courier</p>
          </div>
          <button className="grid h-11 w-11 place-items-center rounded-xl border border-black/10">
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </GlassCard>
  )
}

function DesktopSidebar() {
  return (
    <GlassCard className="hidden h-full min-h-[760px] p-5 lg:block">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C67C4E] text-xl font-black text-white">
          N
        </div>
        <div>
          <p className="font-bold text-white">Noir Brew</p>
          <p className="text-xs text-white/45">Premium Reserve</p>
        </div>
      </div>
      <nav className="mt-10 space-y-3">
        {['Dashboard', 'Cafe Menu', 'Orders', 'Rewards', 'Settings'].map(
          (item, index) => (
            <button
              key={item}
              className={cn(
                'group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                index === 0
                  ? 'bg-[#C67C4E]/18 text-[#FFB067] shadow-[inset_3px_0_0_#FFB067]'
                  : 'text-white/52 hover:bg-white/7 hover:text-white',
              )}
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-70" />
              {item}
            </button>
          ),
        )}
      </nav>
      <div className="mt-10">
        <p className="text-xs uppercase tracking-[0.25em] text-white/35">
          Categories
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/62"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto pt-12">
        <div className="rounded-3xl bg-white/[0.06] p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
              <User className="h-5 w-5 text-[#FFB067]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Dagum</p>
              <p className="text-xs text-white/45">Gold member</p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
}

function DesktopRightRail() {
  return (
    <div className="hidden h-full min-h-[760px] space-y-5 xl:block">
      <OrderPanel />
      <GlassCard className="p-5">
        <h3 className="font-bold text-white">Trending Now</h3>
        <div className="mt-4 space-y-3">
          {coffees.slice(0, 3).map((coffee) => (
            <div key={coffee.name} className="flex items-center gap-3">
              <img
                src={coffee.image}
                alt=""
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {coffee.name}
                </p>
                <p className="text-xs text-white/40">{coffee.tone}</p>
              </div>
              <span className="text-sm font-bold text-[#FFB067]">
                ${coffee.price}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function DesktopHero() {
  return (
    <GlassCard className="relative min-h-[420px] overflow-hidden p-6 md:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C67C4E]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-[#FFB067]/15 blur-3xl" />
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-[0.28em] text-[#FFB067]"
          >
            Cyber reserve 2049
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mt-5 max-w-[680px] text-5xl font-black leading-[0.96] text-white md:text-7xl"
          >
            Apple-level coffee for night-city rituals.
          </motion.h1>
          <p className="mt-6 max-w-[530px] text-base leading-7 text-white/58">
            Luxury mobile ordering expanded into a cinematic desktop command
            center with live delivery, glass panels, glowing controls, and a
            responsive 3D coffee cup.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Button className="h-14 px-7">Build My Order</Button>
            </Magnetic>
            <Button variant="ghost" className="h-14 px-7">
              Watch Steam Flow
            </Button>
          </div>
        </div>
        <div className="relative min-h-[340px]">
          <CoffeeScene />
        </div>
      </div>
    </GlassCard>
  )
}

export default function CoffeeExperience() {
  const rootRef = useRef(null)
  const [showSplash, setShowSplash] = useState(true)
  const [selectedCoffee, setSelectedCoffee] = useState(coffees[0])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.ambient-bean', {
        y: -28,
        rotation: 24,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: 0.3,
      })
      gsap.to('.glass-sheen', {
        xPercent: 140,
        duration: 5,
        repeat: -1,
        ease: 'none',
      })
    }, rootRef)
    const updateGlow = (event) => {
      document.documentElement.style.setProperty('--x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', updateGlow)
    const timer = window.setTimeout(() => setShowSplash(false), 1500)
    return () => {
      ctx.revert()
      window.removeEventListener('pointermove', updateGlow)
      window.clearTimeout(timer)
    }
  }, [])

  return (
    <main ref={rootRef} className="relative min-h-screen overflow-hidden">
      {showSplash && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 1.15, duration: 0.45 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black"
        >
          <div className="h-[760px] w-[390px] max-w-[94vw]">
            <SplashPanel />
          </div>
        </motion.div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(198,124,78,0.26),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(255,176,103,0.18),transparent_22%),linear-gradient(135deg,#0B0B0B,#15100d_55%,#050505)]" />
      {[12, 24, 36, 48, 60, 72].map((left, index) => (
        <span
          key={left}
          className="ambient-bean pointer-events-none absolute top-[12%] h-5 w-3 rounded-full bg-[#8b421f] shadow-[0_0_18px_rgba(255,176,103,0.42)]"
          style={{ left: `${left}%`, top: `${12 + (index % 4) * 18}%` }}
        />
      ))}
      <div className="mouse-glow pointer-events-none fixed inset-0 opacity-70" />

      <div className="relative z-10 mx-auto hidden min-h-screen w-full max-w-[1860px] gap-5 px-4 py-4 sm:px-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:p-6 xl:grid-cols-[260px_minmax(0,1fr)_360px]">
        <DesktopSidebar />
        <section className="space-y-5">
          <DesktopHero />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div className="space-y-5">
              <GlassCard className="p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#FFB067]">
                      Mobile inspired menu
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      Featured coffee carousel
                    </h2>
                  </div>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {categories.map((category, index) => (
                      <button
                        key={category}
                        className={cn(
                          'shrink-0 rounded-full px-4 py-2 text-sm transition',
                          index === 0
                            ? 'bg-[#C67C4E] text-white'
                            : 'border border-white/10 text-white/55 hover:text-white',
                        )}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                  {coffees.map((coffee, index) => (
                    <ProductCard key={coffee.name} coffee={coffee} index={index} onSelect={setSelectedCoffee} />
                  ))}
                </div>
              </GlassCard>
              <div className="grid gap-5 lg:grid-cols-2">
                <DetailPanel coffee={selectedCoffee} />
                <TrackingPanel />
              </div>
            </div>
            <div className="hidden lg:block xl:hidden">
              <OrderPanel coffee={selectedCoffee} />
            </div>
          </div>
        </section>
        <DesktopRightRail />
      </div>

      <div className="relative z-20 mx-auto grid max-w-[430px] gap-6 px-4 py-4 lg:hidden">
        <SplashPanel />
        <HomePanel />
        <DetailPanel coffee={selectedCoffee} />
        <OrderPanel coffee={selectedCoffee} />
        <TrackingPanel />
      </div>
    </main>
  )
}
