import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import {
  ChevronLeft,
  LocateFixed,
  Phone,
  MessageSquare,
  Navigation,
  Clock,
  MapPin,
  CheckCircle2,
  Package,
  Coffee,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

const ScooterIcon = ({ className, size = 20, tilt = 0 }) => (
  <motion.div 
    style={{ rotateZ: tilt }}
    className="relative flex items-center justify-center"
  >
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="17" r="3" />
      <circle cx="17" cy="17" r="3" />
      <path d="M7 17h10M17 14v-4l-4-4H5a2 2 0 0 0-2 2v6M13 6v8M5 14h2" />
    </svg>
  </motion.div>
);

const confettiPieces = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  backgroundColor: i % 2 === 0 ? '#C67C4E' : '#36C07E',
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  x: [0, (Math.random() - 0.5) * 100],
  delay: Math.random() * 3,
}));

const MapBackground = ({ progress = 0, isLocating }) => {
  const [scooterState, setScooterState] = useState({ x: 340, y: 110, rotation: 90, tilt: 0 });
  const pathRef = useRef(null);
  const prevRotation = useRef(90);

  // Larger city canvas so the route has natural context around it.
  const routePath = "M 340 110 L 340 295 Q 340 335 380 335 L 590 335 Q 635 335 635 380 L 635 510 Q 635 555 680 555 L 770 555";

  // Use springs for smooth camera following
  const cameraX = useSpring(0, { stiffness: 40, damping: 20 });
  const cameraY = useSpring(0, { stiffness: 40, damping: 20 });
  const cameraZoom = useSpring(1, { stiffness: 50, damping: 25 });

  useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();
      const p = path.getPointAtLength(progress * length);
      
      // Calculate rotation and tilt
      const lookAhead = 0.008;
      const nextP = path.getPointAtLength(Math.min(1, progress + lookAhead) * length);
      const angle = Math.atan2(nextP.y - p.y, nextP.x - p.x) * (180 / Math.PI);
      
      // Real-time tilt calculation based on angular velocity
      const angleDiff = angle - prevRotation.current;
      const tilt = Math.max(-15, Math.min(15, angleDiff * 5));
      
      setScooterState({ x: p.x, y: p.y, rotation: angle, tilt });
      prevRotation.current = angle;
      
      // Dynamic camera centering - gently bias toward the courier without losing city context.
      const centerX = 560;
      const centerY = 355;
      
      cameraX.set((centerX - p.x) * 0.06);
      cameraY.set((centerY - p.y) * 0.05);
      
      // Keep zoom restrained; turns get only a subtle focus bump.
      const isTurning = Math.abs(tilt) > 2;
      cameraZoom.set(isTurning ? 1.035 : 1);
    }
  }, [cameraX, cameraY, cameraZoom, progress]);

  useEffect(() => {
    if (isLocating) {
      cameraZoom.set(1.055);
    } else {
      cameraZoom.set(1);
    }
  }, [cameraZoom, isLocating]);

  return (
    <div className="absolute inset-0 bg-[#F0F2F5] z-0 overflow-hidden">
      <motion.div
        className="w-full h-full origin-center"
        style={{ 
          x: cameraX, 
          y: cameraY, 
          scale: cameraZoom 
        }}
      >
        <svg
          viewBox="0 0 980 700"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="scooterShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="8" stdDeviation="4" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Detailed City Grid */}
          <g opacity="0.3">
            {[...Array(25)].map((_, i) => (
              <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="700" stroke="#CBD5E1" strokeWidth="0.5" />
            ))}
            {[...Array(18)].map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 40} x2="980" y2={i * 40} stroke="#CBD5E1" strokeWidth="0.5" />
            ))}
          </g>

          {/* Architectural Elements (Blocks) */}
          <g fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1">
            <rect x="45" y="45" width="170" height="150" rx="10" />
            <rect x="250" y="35" width="70" height="230" rx="10" />
            <rect x="385" y="45" width="220" height="190" rx="10" />
            <rect x="665" y="45" width="250" height="190" rx="10" />
            <rect x="45" y="245" width="190" height="150" rx="10" />
            <rect x="385" y="260" width="190" height="55" rx="10" />
            <rect x="675" y="260" width="235" height="90" rx="10" />
            <rect x="45" y="445" width="220" height="195" rx="10" />
            <rect x="305" y="390" width="245" height="220" rx="10" />
            <rect x="680" y="395" width="245" height="120" rx="10" />
            <rect x="810" y="555" width="120" height="100" rx="10" />
          </g>

          {/* Road Network Background */}
          <path
            d={routePath}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />

          {/* Active Route Glow */}
          <motion.path
            ref={pathRef}
            d={routePath}
            fill="none"
            stroke="#C67C4E"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 0.1, ease: "linear" }}
            filter="url(#routeGlow)"
            opacity="0.3"
          />

          {/* Active Route Main Line */}
          <motion.path
            d={routePath}
            fill="none"
            stroke="#C67C4E"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 0.1, ease: "linear" }}
          />

          {/* Waypoints */}
          <g transform="translate(340, 110)">
            <circle r="6" fill="white" stroke="#C67C4E" strokeWidth="2" />
          </g>

          {/* Destination Pulsing Indicator */}
          <g transform="translate(770, 555)">
            <motion.circle
              r="24"
              fill="#C67C4E"
              initial={{ scale: 0.5, opacity: 0.2 }}
              animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle r="10" fill="white" className="drop-shadow-md" />
            <circle r="5" fill="#C67C4E" />
          </g>

          {/* Scooter Vehicle Physics Simulation */}
          <motion.g
            animate={{ 
              x: scooterState.x, 
              y: scooterState.y, 
              rotate: scooterState.rotation 
            }}
            transition={{ type: "spring", stiffness: 120, damping: 25, mass: 1 }}
            filter="url(#scooterShadow)"
          >
            {/* Realistic Vehicle Shadow that offsets based on tilt */}
            <motion.ellipse 
              cx={scooterState.tilt * 0.2} 
              cy="16" 
              rx="12" 
              ry="5" 
              fill="black" 
              opacity="0.15" 
            />
            
            {/* Vehicle Body with suspension bounce */}
            <motion.g
              animate={{ y: [0, -1.5, 0] }}
              transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Outer Glow */}
              <circle r="22" fill="white" opacity="0.9" className="shadow-2xl" />
              
              <g transform="translate(-10, -10)">
                <ScooterIcon size={20} className="text-[#C67C4E]" tilt={scooterState.tilt} />
              </g>

              {/* Directional Indicator Light */}
              <motion.circle
                cx="12"
                cy="0"
                r="3"
                fill="#C67C4E"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </motion.g>
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
};

const Tracking = ({ order, onBack }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Simulation Loop for realistic acceleration/deceleration
  useEffect(() => {
    let frame;
    let lastTime = performance.now();
    let currentProgress = 0;
    let currentVelocity = 0; // Current actual speed
    let pauseTimer = 0;

    const update = (time) => {
      const dt = time - lastTime;
      lastTime = time;

      // Handle intersection pauses
      if (pauseTimer > 0) {
        pauseTimer -= dt;
        frame = requestAnimationFrame(update);
        return;
      }

      // Base speed: Extremely slow for realism (takes ~2 mins for the full route)
      // 1.0 / (120 seconds * 1000 ms) = 0.0000083
      let desiredSpeed = 0.0000083; 
      
      // 1. Deceleration at intersections/turns
      const turns = [0.28, 0.58, 0.88];
      turns.forEach(turn => {
        if (Math.abs(currentProgress - turn) < 0.05) {
          desiredSpeed *= 0.3; // Slow down significantly for the turn
        }
      });

      // 2. Random Traffic Simulation
      const trafficDensity = 1 + (Math.sin(time / 2500) * 0.2); // Slow wave of traffic
      desiredSpeed *= trafficDensity;

      // 3. Smooth Acceleration/Deceleration (Inertia)
      const acceleration = 0.0000005; // Very subtle speed change
      if (currentVelocity < desiredSpeed) {
        currentVelocity = Math.min(desiredSpeed, currentVelocity + acceleration * dt);
      } else {
        currentVelocity = Math.max(desiredSpeed, currentVelocity - acceleration * dt);
      }

      // 4. Update Progress
      currentProgress += currentVelocity * dt;
      
      // 5. Trigger random "Red Light" pauses at intersections
      turns.forEach(turn => {
        if (Math.abs(currentProgress - turn) < 0.001 && Math.random() > 0.7) {
          pauseTimer = 3000 + Math.random() * 2000; // 3-5 second pause
        }
      });

      if (currentProgress >= 1) {
        currentProgress = 1;
        setDisplayProgress(1);
      } else {
        setDisplayProgress(currentProgress);
        frame = requestAnimationFrame(update);
      }
    };

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, []);

  const deliveryState =
    displayProgress < 0.4
      ? 'preparing'
      : displayProgress < 0.7
        ? 'picked_up'
        : displayProgress < 0.95
          ? 'nearby'
          : 'delivered';

  const etaMinutes = Math.max(0, Math.ceil(10 - (displayProgress * 10)));

  const getStatusText = () => {
    switch (deliveryState) {
      case 'preparing': return 'Preparing Your Coffee';
      case 'picked_up': return 'Courier is On the Way';
      case 'nearby': return 'Courier is Arriving';
      case 'delivered': return 'Delivered Successfully';
      default: return 'Order Confirmed';
    }
  };

  const steps = [
    { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2, active: true },
    { id: 'preparing', label: 'Preparing', icon: Coffee, active: displayProgress >= 0 },
    { id: 'picked_up', label: 'Picked Up', icon: Navigation, active: displayProgress >= 0.4 },
    { id: 'delivered', label: 'Delivered', icon: Package, active: displayProgress >= 1 }
  ];

  return (
    <div className="w-full h-screen bg-white overflow-hidden relative flex flex-col lg:flex-row">
      {/* Immersive Map Viewport */}
      <div className="flex-1 relative overflow-hidden h-[45vh] lg:h-full border-b lg:border-b-0 lg:border-r border-gray-100">
        <MapBackground progress={displayProgress} isLocating={isLocating} />
        
        {/* Cinematic Map Overlays */}
        <div className="absolute top-10 left-6 right-6 flex justify-between items-start pointer-events-none">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center pointer-events-auto border border-white"
          >
            <ChevronLeft size={24} className="text-[#2F2D2C]" />
          </motion.button>
          
          <div className="flex flex-col gap-3 items-end">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLocating(!isLocating)}
              className={`w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center pointer-events-auto backdrop-blur-md border transition-all ${isLocating ? 'bg-[#C67C4E] text-white border-[#C67C4E]' : 'bg-white/90 text-[#2F2D2C] border-white'}`}
            >
              <LocateFixed size={22} className={isLocating ? 'animate-pulse' : ''} />
            </motion.button>
            
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white pointer-events-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#2F2D2C]">Live Tracking</span>
            </div>
          </div>
        </div>

        {/* Mobile Dynamic ETA Island */}
        <AnimatePresence>
          {deliveryState !== 'delivered' && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="absolute bottom-6 left-6 right-6 lg:hidden"
            >
              <div className="bg-[#131313] text-white p-4 rounded-[24px] shadow-2xl flex items-center justify-between border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C67C4E] rounded-xl flex items-center justify-center shadow-lg shadow-[#C67C4E]/20">
                    <Clock size={20} className="animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estimated Arrival</p>
                    <p className="text-lg font-bold">{etaMinutes} Minutes</p>
                  </div>
                </div>
                <div className="h-10 w-[1px] bg-white/10 mx-2" />
                <div className="flex-1 text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Status</p>
                  <p className="text-sm font-bold text-[#C67C4E] truncate">{getStatusText()}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Logistics Dashboard Side Panel */}
      <motion.aside
        className="w-full lg:w-[440px] xl:w-[480px] bg-white lg:h-full z-10 shadow-2xl flex flex-col"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      >
        <div className="flex-1 overflow-y-auto px-8 py-6 lg:py-12 no-scrollbar">
          {/* Header & Badges */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#2F2D2C] mb-1">Delivery Details</h1>
              <div className="flex items-center gap-2">
                <span className="bg-gray-100 text-[#2F2D2C] text-[10px] font-bold px-2 py-1 rounded-md">ID: #CFF-7721</span>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <ShieldCheck size={10} /> Insured Delivery
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">ETA</p>
              <p className="text-2xl font-black text-[#C67C4E]">{etaMinutes}<span className="text-sm ml-0.5">MIN</span></p>
            </div>
          </div>

          {/* Active Status Card */}
          <div className="relative mb-10 overflow-hidden bg-[#131313] rounded-[32px] p-6 text-white shadow-xl">
            <div className="relative z-10 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#C67C4E] rounded-2xl">
                  <Zap size={24} />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{getStatusText()}</h2>
                  <p className="text-xs text-gray-400">Real-time GPS Monitoring</p>
                </div>
              </div>
            </div>

            {/* Micro-Progress Visualization */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {steps.map((step, i) => (
                <div key={step.id} className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#C67C4E]"
                    initial={{ width: 0 }}
                    animate={{ width: step.active ? "100%" : "0%" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Courier Intelligence */}
          <div className="bg-gray-50 rounded-[32px] p-6 mb-10 border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                  alt="Courier"
                  className="w-16 h-16 rounded-[24px] object-cover border-2 border-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-5 h-5 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-bold text-[#2F2D2C] text-lg">Pavan Kumar</h3>
                  <div className="flex items-center bg-[#FFF9F5] px-1.5 py-0.5 rounded border border-[#F2E3D8]">
                    <span className="text-[10px] font-bold text-[#C67C4E]">GOLD</span>
                  </div>
                </div>
                <p className="text-gray-400 text-xs font-medium">Verified Professional Courier</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#FFF" }}
                whileTap={{ scale: 0.98 }}
                className="py-3.5 rounded-2xl border border-gray-200 flex items-center justify-center gap-2 text-sm font-bold text-[#2F2D2C] shadow-sm transition-all"
              >
                <Phone size={18} /> Call
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#C67C4E" }}
                whileTap={{ scale: 0.98 }}
                className="py-3.5 rounded-2xl bg-[#C67C4E] flex items-center justify-center gap-2 text-sm font-bold text-white shadow-lg shadow-[#C67C4E]/20 transition-all"
              >
                <MessageSquare size={18} /> Message
              </motion.button>
            </div>
          </div>

          {/* Logistics Summary */}
          <div className="space-y-6 mb-10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Shipment Details</h3>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                <MapPin size={20} className="text-[#C67C4E]" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery To</p>
                <p className="text-sm font-bold text-[#2F2D2C]">Beggur-koppa Road, Banglore</p>
                <p className="text-xs text-gray-400 mt-0.5">Apartment 4B, 2nd Floor</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                <Coffee size={20} className="text-[#C67C4E]" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Package Content</p>
                <p className="text-sm font-bold text-[#2F2D2C]">{order?.coffee?.name} x {order?.quantity}</p>
                <p className="text-xs text-gray-400 mt-0.5">{order?.size} Size • Hot Brew</p>
              </div>
            </div>
          </div>

          {/* Live Support Help */}
          <div className="bg-[#F8FAFC] p-4 rounded-2xl flex items-center gap-3 border border-gray-100">
            <Info size={18} className="text-blue-500" />
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              Having issues with your delivery? <button className="text-[#C67C4E] font-bold hover:underline">Contact Support</button>
            </p>
          </div>
        </div>

        {/* Dynamic Action Zone */}
        <div className="p-8 border-t border-gray-100 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full py-5 rounded-[24px] font-bold text-lg transition-all flex items-center justify-center gap-3 ${deliveryState === 'delivered' ? 'bg-[#36C07E] text-white shadow-xl shadow-[#36C07E]/20' : 'bg-[#F1F5F9] text-gray-400 cursor-not-allowed'}`}
          >
            {deliveryState === 'delivered' ? (
              <><CheckCircle2 size={24} /> Confirm Delivery Receipt</>
            ) : (
              <><Clock size={20} /> Arriving in {etaMinutes} Min</>
            )}
          </motion.button>
        </div>
      </motion.aside>

      {/* Arrival Success Experience */}
      <AnimatePresence>
        {deliveryState === 'delivered' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="bg-white rounded-[48px] p-10 max-w-sm w-full text-center relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
            >
              {/* Confetti Micro-Animations */}
              <div className="absolute inset-0 pointer-events-none">
                {confettiPieces.map((piece) => (
                  <motion.div
                    key={piece.id}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ 
                      backgroundColor: piece.backgroundColor,
                      left: piece.left,
                      top: piece.top
                    }}
                    animate={{ 
                      y: [0, 200], 
                      x: piece.x, 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: piece.delay }}
                  />
                ))}
              </div>

              <div className="w-24 h-24 bg-[#E8F8F0] text-[#36C07E] rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-black text-[#2F2D2C] mb-3">Order Arrived!</h2>
              <p className="text-gray-500 font-medium leading-relaxed mb-10">
                Pavan has safely delivered your coffee.<br/>Enjoy your blissful delight!
              </p>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onBack}
                  className="w-full bg-[#C67C4E] text-white py-5 rounded-[24px] font-black text-lg shadow-2xl shadow-[#C67C4E]/40"
                >
                  Rate Experience
                </motion.button>
                <button onClick={onBack} className="text-gray-400 font-bold text-sm hover:text-[#2F2D2C] transition-colors">
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tracking;
