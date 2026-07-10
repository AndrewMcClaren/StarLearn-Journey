import { createFileRoute } from "@tanstack/react-router";
import { useGame } from "@/lib/game-store";
import { ALIENS } from "@/lib/aliens";
import { AlienAvatar } from "@/components/AlienAvatar";
import { SHOP, findShopItem, type Clothing } from "@/lib/shop";
import { Star, Check, Lock, ShoppingBag, Sparkles } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Tienda Galáctica" },
      { name: "description", content: "Compra ropa para tu avatar con las estrellas que ganas." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { profile, stars, ownedClothes, equippedAccessory, equipAccessory, buyClothing } = useGame();
  const alien = ALIENS[profile?.alien ?? "mint"];
  const equipped = findShopItem(equippedAccessory);

  const items = [...SHOP].sort((a, b) => a.cost - b.cost);

  const handleClick = (item: Clothing) => {
    const owned = ownedClothes.includes(item.id);
    if (owned) {
      equipAccessory(equippedAccessory === item.id ? null : item.id);
      return;
    }
    if (stars < item.cost) return;
    if (confirm(`¿Comprar ${item.name} por ${item.cost} ⭐?`)) {
      buyClothing(item.id, item.cost);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-5 py-6">
      
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="w-6 h-6 text-cosmic-pink" />
        <h1 className="font-display text-3xl font-black">Tienda Galáctica</h1>
      </div>

      
      <div className="bg-gradient-to-br from-cosmic-purple via-cosmic-pink to-star-yellow rounded-[2rem] p-5 border-b-8 border-black/30 shadow-chunky flex items-center gap-4 mb-5">
        <div className="bg-white/20 rounded-3xl p-2">
          <AlienAvatar alienId={profile?.alien ?? "mint"} accessoryId={equippedAccessory} size={104} />
        </div>
        <div className="flex-1 text-white">
          <p className="text-[10px] font-bold tracking-widest opacity-80">TU ALIEN</p>
          <h2 className="font-display text-2xl font-black leading-none">{alien.name}</h2>
          <p className="text-xs opacity-90 mt-0.5">{alien.tagline}</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-space-deep/40 px-3 py-1.5 rounded-2xl">
            <Star className="w-4 h-4 fill-star-yellow text-star-yellow" />
            <span className="font-bold">{stars} estrellas</span>
          </div>
          {equipped && (
            <p className="text-[11px] mt-2 opacity-90">
              Lleva: <b>{equipped.emoji} {equipped.name}</b>
            </p>
          )}
        </div>
      </div>

      
      <div className="bg-white/5 border-2 border-alien-mint/30 rounded-3xl p-4 mb-5 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-alien-mint shrink-0 mt-0.5" />
        <p className="text-xs text-white/85 leading-relaxed">
          Cada <b>actividad completada</b> (lección, tv, memorizar, preguntas, mini-juego, enseñar, retos) te da
          <b className="text-star-yellow"> 1 ⭐</b>. ¡Gástalas en ropa para tu Avatar!
        </p>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => {
          const owned = ownedClothes.includes(item.id);
          const on = equippedAccessory === item.id;
          const canAfford = stars >= item.cost;
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              disabled={!owned && !canAfford}
              className={`relative aspect-[3/4] rounded-3xl p-3 border-b-[6px] flex flex-col items-center justify-between text-center transition-all ${
                on
                  ? "bg-alien-mint text-space-deep border-emerald-900 scale-[1.03]"
                  : owned
                    ? "bg-cosmic-purple/30 border-cosmic-purple/60 text-white hover:bg-cosmic-purple/40"
                    : canAfford
                      ? "bg-white/10 border-black/30 text-white hover:bg-white/20"
                      : "bg-white/5 border-black/20 text-white/60 cursor-not-allowed"
              }`}
            >
              {on && (
                <span className="absolute top-2 right-2 size-6 rounded-full bg-space-deep text-alien-mint flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </span>
              )}
              {!owned && !canAfford && (
                <span className="absolute top-2 right-2 size-6 rounded-full bg-black/40 flex items-center justify-center">
                  <Lock className="w-3 h-3" />
                </span>
              )}
              <span className="text-5xl mt-1">{item.emoji}</span>
              <div>
                <p className="font-bold text-sm leading-tight">{item.name}</p>
                <p className={`text-[10px] mt-0.5 ${on ? "opacity-70" : "opacity-80"}`}>{item.description}</p>
              </div>
              <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                owned ? "bg-black/30" : "bg-star-yellow text-space-deep"
              }`}>
                {owned ? (on ? "PUESTO" : "GUARDADO") : (<><Star className="w-3 h-3 fill-current" /> {item.cost}</>)}
              </div>
            </button>
          );
        })}
      </div>

      {equippedAccessory && (
        <button
          onClick={() => equipAccessory(null)}
          className="mt-6 w-full text-xs font-bold text-white/60 hover:text-white py-3"
        >
          Quitar ropa actual
        </button>
      )}
    </div>
  );
}
