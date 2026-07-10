import type { Accesory } from "./accessories";

export type Clothing = Accesory & { cost: number; description: string};

export const SHOP: Clothing[] = [
    {id: "shop-bow", name: "Moñito rosa super poderoso", emoji: "", xp: 0, slot: "hat", cost: 3, description: "Un toque de poder dulce y atractivo para lucir"},
    {id: "shop-cap", name: "Gorra HiperInteligencia", emoji:"", xp:0, slot:"hat", cost:4, description: "Usa esta gorra y tu mente se llenará de inteligencia galáctica"},
    {id: "shop-glasses", name: "Lentes de Neón", emoji:"", xp:0, slot:"",cost:5, description:"Gafas que te permiten entender más rapido cada problema"},
    {id: "shop-ears", name:"Audífonos Ultrasónicos", emoji:"", xp:0, slot:"",cost:6, description:""},
    {id: "shop-jacket", name:"Chaqueta Anti-Láser", emoji:"", xp:0, slot:"",cost:7, description:"Una chaqueta que te cuida de cualquier ataque en todo momento"},
    {id: "shop-visor", name:"Visor de Realidad Virtual", emoji:"", xp:0, slot:"",cost:8, description:"Con este visor podrás explorar nuevos lugares y escanear informacón"},
    {id: "shop-shoes", nme:"Zapatos 0 gravedad", emoji:"", xp:0, slot:"",cost:9,description:"Tenis con sistema antigravedad, para no caer nunca"},
    {id: "shop-bag", name:"Maleta Infinita", emoji:"",xp:0, slot:"",cost:10,description:"La maleta ideal para guardar todos tus accesorios sin necesidad de preocuparte por el espacio, todo te cabe, es infinita por dentro"},
    {id: "shop-drone", name:"Dron Espía", emoji:"", xp:0, slot:"",cost:11,description:"Un pequeño dron que te cuida y tambien espia a tus rivales y te ayuda a siempre ganar"},
    {id: "shop-clock", name:"Reloj StopTimer", emoji:"", xp:0, slot:"",cost:12,description:"Te permite retrocederel tiempo y poder anticiparte a cualquier evento"},
    {id: "shop-fire", name:"Esencia de Fuego", emoji:"", xp:0, slot:"",cost:13,description:"Podrás tener siempre llamas intergalacticas que rodean tu personaje"},
    {id: "shop-energy",name:"Alas de Energía Solar", emoji:"", xp:0, slot:"",cost:14,description:"Alas de luz para volar por todo el espacio cuando quieras"},
    {id: "shop-", name:"Escudo Deflector", emoji:"", xp:0, slot:"",cost:15,description:"Una burbuja de fuerza translúcida que te protege"},
    {id: "shop-", name:"", emoji:"", xp:0, slot:"", cost:16, description:""},
    {id: "shop-", name:"", emoji:"", xp:0, slot:"", cost:17, desccription:""},
    {id: "shop-medal", name:"Lingote de Oro puro", emoji:"",xp:0, slot:"",cost:18, description:"Un gran lujo para presumir en tus accesorios que demuestren tu nivel"},
    {id: "shop-", name:"", emoji:"",xp:0, slot:"",cost:19, description:""},
    {id: "shop-rocket", name:"Mochila Cohete", emoji:"",xp:0, slot:"hat",cost:20, description:"Acelera tu progeso con la mochilla cohete, y despega hoy mismo"},
];

export function findShopItem(id: string | null | undefined): Clothing | undefined {
    if (!id) return undefined;
    return SHOP.find((s) => s.id ===id);



}