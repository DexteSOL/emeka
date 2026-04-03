import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  ShoppingBag,
  MapPin,
  Star,
  ChevronRight,
  Search,
  ArrowRight,
  Clock,
  Smartphone,
  Utensils,
  Coffee,
  Heart,
  Info,
  Sparkles,
  Send
} from 'lucide-react';
import { MOCK_MENU, MenuItem, getAIAssistantResponse, getMealRecommendation } from './lib/gemini.ts';

// --- Components ---

const Navbar = ({ onNavigate, currentPage }: { onNavigate: (page: string) => void, currentPage: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Menu', id: 'menu' },
    { name: 'Deals', id: 'deals' },
    { name: 'Locations', id: 'locations' },
    { name: 'Loyalty', id: 'loyalty' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-mcd-dark/80 backdrop-blur-md border-b border-mcd-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <div className="w-10 h-10 bg-mcd-gold rounded-lg flex items-center justify-center font-display text-3xl text-mcd-red font-bold">
            M
          </div>
          <span className="font-display text-2xl tracking-wider hidden sm:block">MCDONALD'S</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-mcd-gold ${
                currentPage === item.id ? 'text-mcd-gold' : 'text-gray-400'
              }`}
            >
              {item.name.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-mcd-gold transition-colors relative">
            <ShoppingBag size={20} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-mcd-red text-[10px] flex items-center justify-center rounded-full text-white font-bold">
              0
            </span>
          </button>
          <button
            className="md:hidden p-2 text-gray-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button className="hidden sm:block bg-mcd-gold text-mcd-dark px-6 py-2.5 rounded-full font-bold text-sm hover:bg-mcd-gold/90 transition-all active:scale-95">
            ORDER NOW
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-mcd-card border-b border-mcd-border p-6 flex flex-col gap-4"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className="text-left text-lg font-display tracking-widest py-2 border-b border-mcd-border/50"
              >
                {item.name.toUpperCase()}
              </button>
            ))}
            <button className="bg-mcd-red text-white w-full py-4 rounded-xl font-bold mt-4">
              ORDER NOW
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-mcd-card border-t border-mcd-border pt-20 pb-10 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
      <div className="col-span-1 md:col-span-1">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-mcd-gold rounded flex items-center justify-center font-display text-xl text-mcd-red font-bold">
            M
          </div>
          <span className="font-display text-xl tracking-wider">MCDONALD'S</span>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">
          Bringing the Golden Arches to your screen with AI-powered personalization and high-speed ordering.
        </p>
      </div>
      <div>
        <h4 className="font-display text-lg tracking-widest mb-6 text-mcd-gold">EXPLORE</h4>
        <ul className="flex flex-col gap-3 text-sm text-gray-400">
          <li className="hover:text-white cursor-pointer transition-colors">Full Menu</li>
          <li className="hover:text-white cursor-pointer transition-colors">Deals & Offers</li>
          <li className="hover:text-white cursor-pointer transition-colors">Gift Cards</li>
          <li className="hover:text-white cursor-pointer transition-colors">McCafé</li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-lg tracking-widest mb-6 text-mcd-gold">ABOUT</h4>
        <ul className="flex flex-col gap-3 text-sm text-gray-400">
          <li className="hover:text-white cursor-pointer transition-colors">Our Story</li>
          <li className="hover:text-white cursor-pointer transition-colors">Nutrition Hub</li>
          <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
          <li className="hover:text-white cursor-pointer transition-colors">Sustainability</li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-lg tracking-widest mb-6 text-mcd-gold">CONNECT</h4>
        <div className="flex gap-4 mb-6">
          {['FB', 'TW', 'IG', 'YT'].map(s => (
            <div key={s} className="w-10 h-10 rounded-full bg-mcd-dark border border-mcd-border flex items-center justify-center text-xs font-bold hover:border-mcd-gold cursor-pointer transition-all">
              {s}
            </div>
          ))}
        </div>
        <div className="bg-mcd-dark border border-mcd-border rounded-xl p-4 flex items-center gap-3">
          <Smartphone className="text-mcd-gold" size={20} />
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Download App</p>
            <p className="text-xs font-bold">Get Exclusive Deals</p>
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-10 border-t border-mcd-border flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-[10px] text-gray-600 uppercase tracking-widest">
        © 2026 McDonald's. All Rights Reserved. Built with Gemini 2.5 Pro.
      </p>
      <div className="flex gap-6 text-[10px] text-gray-600 uppercase tracking-widest">
        <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
        <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
        <span className="hover:text-gray-400 cursor-pointer">Accessibility</span>
      </div>
    </div>
  </footer>
);

// --- Pages ---

const HomePage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-height-[90vh] flex flex-col justify-center px-6 overflow-hidden">
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 font-display text-[600px] text-mcd-gold/5 select-none pointer-events-none leading-none">
          M
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-mcd-gold/10 border border-mcd-gold/30 rounded-full px-4 py-1.5 mb-8"
          >
            <div className="w-2 h-2 bg-mcd-gold rounded-full animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-mcd-gold uppercase">Limited Time Offer</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-7xl md:text-9xl leading-[0.9] mb-8"
          >
            CRAVEABLE <br />
            <span className="text-mcd-gold">FAVORITES</span> <br />
            <span className="text-mcd-red">DELIVERED.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mb-12 leading-relaxed"
          >
            Experience the next generation of McDonald's. Powered by AI to bring you personalized deals, smarter ordering, and the food you love, faster.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => onNavigate('menu')}
              className="bg-mcd-gold text-mcd-dark px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 group hover:bg-mcd-gold/90 transition-all active:scale-95"
            >
              ORDER NOW
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-mcd-card border border-mcd-border text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-mcd-border transition-all active:scale-95">
              VIEW DEALS
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-mcd-border pt-12"
          >
            {[
              { label: 'Core Pages', val: '12' },
              { label: 'Build Phases', val: '06' },
              { label: 'AI Features', val: '08' },
              { label: 'Timeline', val: '10wk' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-1">
                <span className="font-display text-4xl text-mcd-gold">{stat.val}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-32 px-6 bg-mcd-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div>
              <span className="font-mono text-xs text-mcd-gold tracking-[0.3em] uppercase mb-4 block">Our Menu</span>
              <h2 className="font-display text-5xl md:text-6xl">POPULAR CATEGORIES</h2>
            </div>
            <button
              onClick={() => onNavigate('menu')}
              className="text-mcd-gold font-bold flex items-center gap-2 hover:underline"
            >
              VIEW FULL MENU <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Burgers', icon: <Utensils />, color: 'bg-mcd-red/10 text-mcd-red', img: 'https://picsum.photos/seed/burger-cat/600/400' },
              { name: 'Breakfast', icon: <Clock />, color: 'bg-mcd-gold/10 text-mcd-gold', img: 'https://picsum.photos/seed/breakfast-cat/600/400' },
              { name: 'McCafé', icon: <Coffee />, color: 'bg-blue-500/10 text-blue-400', img: 'https://picsum.photos/seed/coffee-cat/600/400' },
              { name: 'Desserts', icon: <Sparkles />, color: 'bg-purple-500/10 text-purple-400', img: 'https://picsum.photos/seed/dessert-cat/600/400' },
            ].map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative h-80 rounded-3xl overflow-hidden border border-mcd-border cursor-pointer"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mcd-dark via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${cat.color}`}>
                    {cat.icon}
                  </div>
                  <h3 className="font-display text-3xl tracking-wide">{cat.name.toUpperCase()}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -inset-10 bg-mcd-gold/10 blur-3xl rounded-full" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative bg-mcd-card border border-mcd-border rounded-[40px] p-8 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-mcd-gold rounded-full flex items-center justify-center">
                  <Sparkles className="text-mcd-dark" />
                </div>
                <div>
                  <h4 className="font-bold">AI Meal Recommender</h4>
                  <p className="text-xs text-gray-500">Powered by Gemini 2.5 Pro</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-mcd-dark/50 p-4 rounded-2xl border border-mcd-border text-sm italic text-gray-400">
                  "I'm looking for a light lunch that's under 600 calories but still filling."
                </div>
                <div className="bg-mcd-gold/5 p-6 rounded-2xl border border-mcd-gold/20">
                  <p className="text-mcd-gold font-bold text-sm mb-2">Gemini Suggests:</p>
                  <p className="text-sm leading-relaxed text-gray-300">
                    Try the <span className="text-white font-bold">McChicken Meal</span> with a side salad instead of fries. It's high in protein and comes in at exactly 540 calories!
                  </p>
                </div>
              </div>

              <button className="w-full mt-8 bg-white text-mcd-dark py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors">
                TRY AI ASSISTANT
              </button>
            </motion.div>
          </div>

          <div>
            <span className="font-mono text-xs text-mcd-gold tracking-[0.3em] uppercase mb-4 block">Innovation</span>
            <h2 className="font-display text-5xl md:text-6xl mb-8">SMARTER ORDERING WITH AI</h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Our integrated Gemini AI learns your preferences, considers the time of day, and even checks the local weather to suggest the perfect meal for your mood.
            </p>
            <ul className="space-y-6">
              {[
                { title: 'Personalized Upsells', desc: 'Smarter suggestions that actually match your taste.' },
                { title: 'Nutritional Filtering', desc: 'Instantly find items that fit your dietary goals.' },
                { title: 'Voice Ordering', desc: 'Coming soon: Order just by speaking to the app.' },
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-mcd-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-mcd-gold rounded-full" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white">{item.title}</h5>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

const MenuPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Burgers', 'Chicken', 'Breakfast', 'Beverages', 'Desserts'];

  const filteredMenu = MOCK_MENU.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-16">
        <span className="font-mono text-xs text-mcd-gold tracking-[0.3em] uppercase mb-4 block">Full Menu</span>
        <h1 className="font-display text-6xl md:text-7xl mb-8">EXPLORE OUR MENU</h1>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-mcd-gold text-mcd-dark'
                    : 'bg-mcd-card border border-mcd-border text-gray-400 hover:border-mcd-gold/50'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search for a Big Mac..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-mcd-card border border-mcd-border rounded-full py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:border-mcd-gold transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredMenu.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={item.id}
              className="bg-mcd-card border border-mcd-border rounded-[32px] overflow-hidden group hover:border-mcd-gold/30 transition-all"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-mcd-dark/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-mcd-gold border border-mcd-gold/20">
                  {item.calories} CAL
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-2xl tracking-wide">{item.name.toUpperCase()}</h3>
                  <span className="font-bold text-mcd-gold">${item.price}</span>
                </div>
                <p className="text-gray-500 text-sm mb-8 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <button className="w-full bg-mcd-red text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-mcd-red/90 transition-all active:scale-95">
                  <ShoppingBag size={18} />
                  ADD TO ORDER
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredMenu.length === 0 && (
        <div className="py-40 text-center">
          <div className="w-20 h-20 bg-mcd-card border border-mcd-border rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="text-gray-600" size={32} />
          </div>
          <h3 className="font-display text-3xl mb-2">NO ITEMS FOUND</h3>
          <p className="text-gray-500">Try searching for something else or change categories.</p>
        </div>
      )}
    </div>
  );
};

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Welcome to McDonald's! I'm your AI assistant. Looking for a recommendation or have a question about our menu?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const response = await getAIAssistantResponse(userMsg, "User is browsing the McDonald's website.");
    setMessages(prev => [...prev, { role: 'ai', text: response || "I'm sorry, I couldn't process that." }]);
    setIsTyping(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-mcd-gold rounded-full shadow-2xl flex items-center justify-center text-mcd-dark hover:scale-110 transition-transform active:scale-95 z-40"
      >
        <Sparkles size={28} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[380px] h-[500px] bg-mcd-card border border-mcd-border rounded-[32px] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-mcd-border flex items-center justify-between bg-mcd-gold/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-mcd-gold rounded-full flex items-center justify-center">
                  <Sparkles className="text-mcd-dark" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">MCDONALD'S AI</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-mcd-red text-white rounded-tr-none'
                      : 'bg-mcd-dark border border-mcd-border text-gray-300 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-mcd-dark border border-mcd-border p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-mcd-border">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about the menu..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-mcd-dark border border-mcd-border rounded-2xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:border-mcd-gold transition-colors"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mcd-gold hover:text-mcd-gold/80"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomePage onNavigate={setCurrentPage} />
            </motion.div>
          )}
          {currentPage === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MenuPage />
            </motion.div>
          )}
          {['deals', 'locations', 'loyalty'].includes(currentPage) && (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-40 pb-60 text-center px-6"
            >
              <div className="w-24 h-24 bg-mcd-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Clock className="text-mcd-gold" size={40} />
              </div>
              <h1 className="font-display text-6xl mb-4 uppercase tracking-wider">Coming Soon</h1>
              <p className="text-gray-500 max-w-md mx-auto">
                We're currently cooking up something special for the {currentPage} page. Check back soon!
              </p>
              <button
                onClick={() => setCurrentPage('home')}
                className="mt-12 bg-mcd-gold text-mcd-dark px-8 py-3 rounded-full font-bold hover:bg-mcd-gold/90 transition-all"
              >
                BACK TO HOME
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
}
