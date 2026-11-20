/* Erbet Gomez Bohorquez */

const IMAGE_FOLDERS = {
  classes: "assets/images/classes/",
  weapons: "assets/images/weapons/",
  vehicles: "assets/images/vehicles/",
  secrets: "assets/images/easter-eggs/"
};

const BASIC_TIPS = [
  { title: "Juega el objetivo, no solo las bajas", text: "En Conquista y Operaciones se gana capturando banderas o sectores. Quien captura y revive suma más puntos que quien solo dispara." },
  { title: "Cambia de clase según la situación", text: "Si tu equipo no tiene Médicos, sé Médico. Si hay tanques enemigos, lleva a un Asalto con explosivos antitanque." },
  { title: "Revive y reaprovisiona", text: "Revivir a un compañero y repartir munición te da puntos y mantiene viva la línea. Casi todo el equipo lo olvida." },
  { title: "Usa el terreno y la destrucción", text: "Los edificios se derrumban y los cráteres sirven de cobertura. No te quedes quieto en una casa que un tanque puede borrar." },
  { title: "Marca enemigos", text: "Con la tecla de marcado tus aliados ven al enemigo en pantalla. Es el apoyo más barato y más útil que existe." }
];

const GAME_MODES = [
  { name: "Conquista", text: "Dos equipos pelean por controlar banderas repartidas por el mapa. Cuantas más banderas tengas, más rápido baja el contador enemigo. Es el modo más grande, con vehículos y 64 jugadores." },
  { name: "Operaciones", text: "Una campaña por sectores con atacantes y defensores. Si los atacantes ganan un mapa, avanzan al siguiente. Al final pueden aparecer Behemoths para ayudar al equipo que va perdiendo." },
  { name: "Dominación", text: "Versión más pequeña de Conquista, sin vehículos pesados. Ideal para combates cercanos y rápidos." },
  { name: "Asalto (Rush)", text: "Los atacantes deben destruir telégrafos; los defensores los protegen. Es un modo clásico de la saga, lleno de acción cuerpo a cuerpo." },
  { name: "Palomas mensajeras", text: "Capturas una paloma, escribes un mensaje y la sueltas para pedir un bombardeo. Es un modo bastante frenético y muy divertido." }
];

const PLAYER_CLASSES = [
  { name: "Asalto", image: "icono-asalto.png", role: "Primera línea", text: "Armas automáticas de corto alcance y explosivos contra vehículos. Es el mejor para abrir paso en edificios." },
  { name: "Médico", image: "icono-medico.png", role: "Soporte vital", text: "Revive a los caídos y cura a los heridos. Tiene rifles semiautomáticos para el combate a media distancia." },
  { name: "Apoyo", image: "icono-apoyo.png", role: "Fuego de cobertura", text: "Ametralladoras ligeras, munición para el equipo y morteros. Perfecto para mantener una posición." },
  { name: "Explorador", image: "icono-explorador.png", role: "Larga distancia", text: "Rifles de francotirador, bengalas para descubrir enemigos y trampas. Pide paciencia y buena puntería." }
];

const WEAPONS_BY_CLASS = {
  "Asalto": [
    { name: "Hellriegel 1915", image: "Hellriegel-1915.png", note: "Subfusil con mucha cadencia. Muy fuerte en distancias cortas dentro de edificios." },
    { name: "MP 18", image: "MP-18.png", note: "Subfusil equilibrado y fácil de controlar. Buena primera elección." },
    { name: "Automatico M1918", image: "Automatico-M1918.png", note: "Cargador amplio y buena precisión para ser de corto alcance." },
    { name: "Escopeta Trench Gun", image: "Escopeta_de-trinchera.png", note: "Daño brutal cuerpo a cuerpo. Casi nada se le acerca a menos de diez metros." }
  ],
  "Médico": [
    { name: "Cei-Rigotti", image: "Cei-Rigotti.png", note: "Semiautomático muy preciso y con poco retroceso. Gran rifle para empezar." },
    { name: "RSC 1917", image: "RSC_1917.png", note: "Daño alto y cadencia moderada. Premia los disparos limpios a distancia media." },
    { name: "Selbstlader M1916", image: "Selbstlader-M1916.png", note: "Equilibrio entre daño y control. Resulta cómodo con visor." }
  ],
  "Apoyo": [
    { name: "Lewis Gun", image: "LewisGun.png", note: "Precisa y con retroceso suave. La ametralladora más recomendada para empezar." },
    { name: "Madsen MG", image: "MadsenMG.png", note: "Cargador ligero y movilidad alta. Se puede usar con el cuerpo en movimiento." },
    { name: "BAR M1918", image: "BARM1918.png", note: "Semi y automático según prefieras. Muy versátil a media distancia." }
  ],
  "Explorador": [
    { name: "Gewehr 98 Sniper", image: "Gewehr98Sniper.png", note: "Un clásico alemán. Precisión alta y buen daño, pero recarga de cerrojo." },
    { name: "SMLE MKIII", image: "SMLEMKIII.png", note: "Rifle británico con cargador generoso. Perfecto si sueles fallar el primer tiro." },
    { name: "Martini-Henry", image: "Martini-Henry.png", note: "Un tiro, una baja a larga distancia. Necesita buena puntería." }
  ]
};

const VEHICLES = [
  { name: "Tanques pesados (Mark V, A7V)", image: "Tanque-pesado-MarkV.png", type: "Tierra", text: "Cañón principal y varias ametralladoras laterales. Necesitan conductor y artilleros. Muy poderosos, pero lentos y vulnerables al fuego antitanque." },
  { name: "Tanque ligero (FT-17)", image: "Tanque-ligeroFT-17.png", type: "Tierra", text: "Rápido y ágil. Buena opción para un jugador solitario que quiere flanquear al enemigo." },
  { name: "Cazas (Albatros D.III, Bristol F2.B)", image: "Caza-AlbatrosD.III.png", type: "Aire", text: "Dominan el cielo y persiguen aviones enemigos. Pilotar bien lleva tiempo, así que practica en un servidor tranquilo." },
  { name: "Aviones de ataque y bombarderos", image: "Avion-de-ataque.png", type: "Aire", text: "Destruyen vehículos y concentraciones de infantería. Requieren un escolta para sobrevivir a los cazas enemigos." },
  { name: "Caballería", image: "caballeria.png", type: "Tierra", text: "Rápida, silenciosa y letal con el sable. Embiste al galope para derribar enemigos de un solo golpe." },
  { name: "Behemoths (Zepelín, Tren blindado, Acorazado)", image: "Behemoths.png", type: "Behemoth", text: "Aparecen en Operaciones o Conquista cuando un equipo va perdiendo. Ayudan a darle la vuelta a la partida." }
];

const EASTER_EGGS = [
  { title: "El megalodón de Fort de Vaux", image: "El-megalodón-de-Fort-de-Vaux.png", text: "En ese mapa se puede activar un secreto que hace aparecer un tiburón gigante, una tradición heredada de Battlefield 4." },
  { title: "La casa de «Up» en Verdun Heights", image: "La-casa-de-Up-en-Verdun-Heights.png", text: "Entre las referencias al cine, hay una casa con globos que homenajea a la película de Pixar." },
  { title: "Cestas de Pascua en Soissons", image: "Cestas-de-Pascua-en-Soissons.png", text: "Hay cestas de huevos de Pascua repartidas por el mapa, incluso bajo el agua." },
  { title: "Los guiños de «Battlefield Friends»", text: "En mapas de la expansión «En nombre del Zar» (Volga River, Brusilov Keep y Lupkow Pass) hay audios escondidos con los personajes de esa serie de vídeos." },
  { title: "El tema de Battlefield 1 en Prise de Tahure", text: "En ese mapa de «No pasarán» existe un easter egg que reproduce la melodía principal del juego." },
  { title: "El ARG de las chapas secretas", text: "La comunidad resolvió un juego de realidad alternativa con código Morse que desbloqueaba chapas de identificación secretas." },
  { title: "Recarga a cuerda en Apocalypse", text: "La ametralladora LMG 08/18 tiene una animación especial de recarga, nacida de un vídeo humorístico que vio un animador de DICE." }
];
