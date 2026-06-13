"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Search, Plus, Trash2, ShoppingCart, Info, Package } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  images: string[];
}

export default function BuildGiftPackPage() {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Box state
  const [boxItems, setBoxItems] = useState<{product: Product, qty: number}[]>([]);
  const [boxSize, setBoxSize] = useState("Medium Box (Fits up to 5 items)");
  const [giftMessage, setGiftMessage] = useState("");
  const [addRibbon, setAddRibbon] = useState(false);
  const [cardType, setCardType] = useState("None");
  const [cardTo, setCardTo] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  useEffect(() => {
    fetch("/api/v1/products")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          // Exclude gift-packs category itself from being added inside a gift pack
          setProducts(json.data.filter((p: any) => p.status !== "draft" && p.category !== "gift-packs"));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDragStart = (e: React.DragEvent, product: Product) => {
    e.dataTransfer.setData("product_id", product.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const productId = e.dataTransfer.getData("product_id");
    const product = products.find(p => p.id === productId);
    if (product) {
      addToBox(product);
    }
  };

  const addToBox = (product: Product) => {
    setBoxItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromBox = (productId: string) => {
    setBoxItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const totalItemsCount = boxItems.reduce((acc, item) => acc + item.qty, 0);
  const itemsTotal = boxItems.reduce((acc, item) => acc + (item.product.price * item.qty), 0);
  const ribbonPrice = addRibbon ? 150 : 0;
  const cardPrice = cardType !== "None" ? 500 : 0;
  const grandTotal = itemsTotal + ribbonPrice + cardPrice;

  const handleAddToCart = () => {
    if (totalItemsCount < 3) {
      alert("Please add at least 3 items to your gift pack.");
      return;
    }
    
    const description = `Box: ${boxSize}\n` +
      boxItems.map(i => `- ${i.qty}x ${i.product.name}`).join("\n") +
      (addRibbon ? "\n- Decorative Ribbon (+150 LKR)" : "") +
      (cardType !== "None" ? `\n- Card: ${cardType} (+500 LKR)\n  To: ${cardTo}\n  Message: "${cardMessage}"` : "") +
      (giftMessage ? `\nBox Note: "${giftMessage}"` : "");

    addItem({
      id: `custom-gift-pack-${Date.now()}`,
      name: "Custom Gift Pack",
      price: grandTotal,
      emoji: "🎁",
      weight: `${totalItemsCount} items`,
      vacuum: false,
      description,
      subItems: boxItems.map(i => ({ id: i.product.id, qty: i.qty }))
    });

    router.push("/cart");
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-[1400px] mx-auto">
          <nav className="flex items-center gap-1.5 text-xs text-[#999]">
            <Link href="/" className="hover:text-[#D98C1F]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#444]">Gift Packs</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-[#2C4631]/10 rounded-full flex items-center justify-center text-[#2C4631] flex-shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-display font-bold text-[#222] text-2xl md:text-3xl">Create Your Gift Pack</h1>
            <p className="text-[#666] text-sm mt-1">Build a personalized gift pack by adding your favorite items to the box.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Select Items */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 h-[calc(100vh-200px)] flex flex-col">
            <h2 className="font-bold text-[#222] text-lg mb-4">1. Select Items</h2>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#D98C1F] focus:ring-1 focus:ring-[#D98C1F] transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <p className="text-center text-sm text-[#888] py-8">No products found.</p>
              ) : (
                filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, product)}
                    className="flex items-center justify-between p-3 bg-white border border-gray-100 hover:border-[#D98C1F]/40 hover:shadow-sm rounded-xl transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl overflow-hidden relative">
                        {product.images?.[0] ? (
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                        ) : (
                          <span>{product.emoji || "📦"}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#222] line-clamp-1">{product.name}</p>
                        <p className="text-xs font-bold text-[#D98C1F]">LKR {product.price.toLocaleString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => addToBox(product)}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#D98C1F] hover:text-white hover:border-[#D98C1F] transition-colors flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CENTER COLUMN: The Box */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#222] text-lg">2. Build Your Gift Pack</h2>
              {totalItemsCount > 0 && (
                <button 
                  onClick={() => setBoxItems([])}
                  className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full"
                >
                  <Trash2 className="w-3 h-3" /> CLEAR BOX
                </button>
              )}
            </div>

            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative h-[450px] bg-white rounded-3xl border-2 border-dashed transition-all duration-300 flex items-center justify-center overflow-hidden
                ${isDraggingOver ? 'border-[#D98C1F] bg-[#D98C1F]/5 shadow-inner' : 'border-gray-200'}
              `}
            >
              {/* Photorealistic Box Image */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-90 flex items-center justify-center p-8">
                 <Image src="/premium-box.png" alt="Empty Gift Box" width={600} height={600} className="object-contain w-full h-full drop-shadow-2xl" priority />
              </div>

              {/* Interaction Layer */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
                {totalItemsCount === 0 ? (
                  <div className="bg-black/60 backdrop-blur-md px-8 py-6 rounded-2xl text-center text-white border border-white/10 shadow-xl pointer-events-none">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-80" />
                    <p className="font-medium text-lg">Drag & Drop items here</p>
                    <p className="text-sm text-white/70 mt-1">or click 'Add' to select items</p>
                  </div>
                ) : (
                  <div className="bg-black/40 backdrop-blur-sm px-6 py-4 rounded-full text-white border border-white/20 shadow-lg pointer-events-none transform translate-y-12">
                    <p className="font-bold text-xl">{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} inside</p>
                  </div>
                )}
              </div>
            </div>

            {/* Total & Add to Cart Bar */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#666]">{totalItemsCount} Items Selected</p>
              </div>
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className="text-right">
                  <p className="text-xs text-[#888] font-medium uppercase tracking-wider">Total</p>
                  <p className="font-display font-bold text-2xl text-[#D98C1F]">LKR {grandTotal.toLocaleString()}</p>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={totalItemsCount < 3}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all
                    ${totalItemsCount >= 3 
                      ? 'bg-[#2C4631] hover:bg-[#1E3322] text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  <ShoppingCart className="w-5 h-5" />
                  ADD TO CART
                </button>
              </div>
            </div>
            
            {totalItemsCount < 3 && (
              <div className="flex items-center gap-2 mt-3 text-xs font-medium text-[#2C4631] bg-[#2C4631]/10 px-4 py-2 rounded-xl">
                <Info className="w-4 h-4" /> You must add a minimum of 3 items to create a gift pack.
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Items & Options */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Items List */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#222] text-base mb-4">Your Gift Pack Items ({totalItemsCount})</h3>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {boxItems.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                    <Package className="w-8 h-8 text-[#ccc] mx-auto mb-2" />
                    <p className="text-xs text-[#888]">Your gift pack is empty.<br/>Add some delicious items!</p>
                  </div>
                ) : (
                  boxItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center overflow-hidden relative">
                         {item.product.images?.[0] ? (
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                        ) : (
                          <span className="text-lg">{item.product.emoji}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#222] line-clamp-1">{item.product.name}</p>
                        <p className="text-[10px] text-[#888]">Qty: {item.qty} • LKR {(item.product.price * item.qty).toLocaleString()}</p>
                      </div>
                      <button 
                        onClick={() => removeFromBox(item.product.id)}
                        className="w-7 h-7 rounded-full hover:bg-white border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-bold text-[#222] text-base mb-4">Gift Pack Options</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Select Box Size</label>
                  <select 
                    value={boxSize}
                    onChange={(e) => setBoxSize(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#D98C1F]"
                  >
                    <option>Small Box (Fits up to 3 items)</option>
                    <option>Medium Box (Fits up to 5 items)</option>
                    <option>Large Box (Fits up to 8 items)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#555] mb-1.5">Add Gift Message (Optional)</label>
                  <textarea 
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    placeholder="Write a note to be placed inside the box... (Max 120 chars)"
                    maxLength={120}
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#D98C1F] resize-none"
                  ></textarea>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#222]">Add Greeting Card (+LKR 500)</label>
                  </div>
                  <select 
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#D98C1F]"
                  >
                    <option value="None">No Card</option>
                    <option value="Birthday">Birthday Card</option>
                    <option value="Anniversary">Anniversary Card</option>
                    <option value="Congratulations">Congratulations Card</option>
                    <option value="Thank You">Thank You Card</option>
                  </select>
                  
                  {cardType !== "None" && (
                    <div className="space-y-3 pt-2">
                      <input 
                        type="text" 
                        value={cardTo}
                        onChange={(e) => setCardTo(e.target.value)}
                        placeholder="To (Name)" 
                        className="w-full bg-white border border-gray-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#D98C1F]"
                      />
                      <textarea 
                        value={cardMessage}
                        onChange={(e) => setCardMessage(e.target.value)}
                        placeholder="Message on the card..."
                        rows={2}
                        className="w-full bg-white border border-gray-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#D98C1F] resize-none"
                      ></textarea>
                    </div>
                  )}
                </div>

                <label className="flex items-center justify-between p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={addRibbon}
                      onChange={(e) => setAddRibbon(e.target.checked)}
                      className="w-4 h-4 text-[#D98C1F] border-gray-300 rounded focus:ring-[#D98C1F]"
                    />
                    <span className="text-sm font-medium text-[#222]">Add Decorative Ribbon</span>
                  </div>
                  <span className="text-sm font-bold text-[#D98C1F]">LKR 150.00</span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-wrap gap-6 justify-between items-center">
          {[
            { title: "100% Homemade", desc: "Made with love and natural ingredients", icon: "🌱" },
            { title: "Customizable", desc: "Choose your favorite items", icon: "✨" },
            { title: "Beautiful Packaging", desc: "Premium gift box with elegant design", icon: "🎀" },
            { title: "Perfect for Any Occasion", desc: "Birthdays, anniversaries, festivals & more", icon: "🎉" },
            { title: "Islandwide Delivery", desc: "Delivered fresh to your doorstep", icon: "🚚" },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-3 w-full sm:w-[calc(50%-12px)] lg:w-auto">
              <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-xl flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-[#222]">{f.title}</p>
                <p className="text-xs text-[#666] mt-0.5 max-w-[180px]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
