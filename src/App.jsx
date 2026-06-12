// ============================================================
// IMPORTACIONES
// ------------------------------------------------------------
// useState y useEffect son hooks de React:
//   - useState: guarda valores que pueden cambiar (ej: si el menu esta abierto)
//   - useEffect: ejecuta codigo cuando el componente aparece o cambia
// Los iconos vienen de la libreria lucide-react (iconos SVG listos para usar)
// ============================================================
import { useState, useEffect } from "react";
import {
  Package, Globe, Shield, Zap, Handshake,
  MapPin, Mail, Phone, ChevronDown, Menu, X,
  ArrowRight, Container, Truck
} from "lucide-react";
import HorseLogoSrc from "./assets/picsvg_modified.svg";

// ============================================================
// PALETA DE COLORES
// ------------------------------------------------------------
// Objeto C que centraliza todos los colores del sitio.
// En lugar de escribir "#C9A84C" en cada elemento, usamos C.accent.
// Asi si quieres cambiar un color, solo lo cambias aqui y se actualiza en todo.
// ============================================================
const C = {
  primary: "#0F3460",      // azul marino oscuro - color principal de fondo
  primaryMid: "#0F3460",   // azul marino medio (reservado para uso futuro)
  accent: "#C9A84C",       // dorado - color de acento para botones y destacados
  accentHover: "#A8872E",  // dorado mas oscuro - se usa al pasar el mouse sobre botones dorados
  bg: "#F7F9FC",           // gris muy claro - fondo general de las secciones blancas
  bgAlt: "#EEF2F7",        // gris claro - fondo de secciones alternas
  bgCard: "#FFFFFF",       // blanco puro - fondo de las tarjetas de servicios
  text: "#0D1B2A",         // casi negro - color del texto principal
  textMuted: "#64748B",    // gris azulado - texto secundario y descripciones
  border: "#D6E0ED",       // gris azulado claro - bordes de tarjetas y separadores
  contactBg: "#0D1B2A",    // mismo que primary - fondo del bloque de info de contacto
  timeBg: "#FFFDF5",       // crema muy claro - fondo de la caja de tiempo de respuesta
  timeText: "#7A5C1A",     // cafe dorado - texto dentro de la caja de tiempo de respuesta
  timeBorder: "#F0DFA0",   // amarillo palido - borde de la caja de tiempo de respuesta
};

// ============================================================
// ENLACES DE NAVEGACION
// ------------------------------------------------------------
// Array con los links del menu. Cada objeto tiene:
//   - label: texto que se muestra en pantalla
//   - href: el ID de la seccion a la que lleva (ancla interna)
// El boton "Contactanos" se maneja aparte por tener estilo diferente.
// ============================================================
const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Capacidad", href: "#capacidad" },
];

// ============================================================
// DATOS DE SERVICIOS
// ------------------------------------------------------------
// Array con la informacion de cada tarjeta de servicio.
// Cada objeto tiene: icono, titulo, subtitulo, descripcion y etiquetas.
// Se recorre con .map() para generar las tarjetas automaticamente,
// evitando repetir codigo HTML para cada servicio.
// ============================================================
const SERVICES = [
  {
    icon: Container,
    title: "Carga Contenerizada",
    subtitle: "FCL / LCL",
    desc: "Gestión integral de contenedores de carga completa y consolidada. Coordinamos el proceso completo desde el origen hasta el destino final.",
    tags: ["FCL", "LCL", "Importación", "Exportación"],
  },
  {
    icon: Package,
    title: "Carga en General",
    subtitle: "Equipos, materiales y más",
    desc: "Soluciones para mercancía suelta, equipos industriales, materiales de construcción y carga de proyecto con atención personalizada.",
    tags: ["Equipos", "Materiales", "Suelta", "Proyecto"],
  },
];

// ============================================================
// DATOS DE FLOTA
// ------------------------------------------------------------
// Array con los tipos de unidades disponibles para la seccion Capacidad.
// Mismo patron que SERVICES: se recorre con .map() para no repetir codigo.
// ============================================================
const FLEET = [
  { label: "Cajas Secas", detail: "48 y 53 pies", icon: Container },
  { label: "Plataformas", detail: "Para carga especial", icon: Truck },
  { label: "Camiones Torton", detail: "Distribución nacional", icon: Truck },
  { label: "Unidades 3.5 Ton", detail: "Última milla", icon: Package },
  { label: "Porta Contenedores", detail: "Carga marítima", icon: Container },
];

// ============================================================
// DATOS DE VALORES
// ------------------------------------------------------------
// Array con las propuestas de valor para la seccion "Lo que nos distingue".
// Mismo patron de datos: icono + titulo + descripcion corta.
// ============================================================
const VALUES = [
  { icon: Globe, title: "Cobertura", desc: "Nacional" },
  { icon: Shield, title: "Confianza", desc: "Seguridad en cada envío" },
  { icon: Zap, title: "Eficiencia", desc: "Soluciones ágiles y efectivas" },
  { icon: Handshake, title: "Compromiso", desc: "Servicio confiable y personalizado" },
];

// ============================================================
// COMPONENTE: LOGO DEL CABALLO
// ------------------------------------------------------------
// Componente reutilizable que renderiza el logo SVG del caballo.
// Acepta dos props (parametros):
//   - size: ancho y alto en pixeles (default 44px)
//   - color: color de relleno del logo (default dorado de la marca)
//
// El SVG fue exportado desde el archivo original picsvg_modified.svg.
// El transform "translate(0,600) scale(0.1,-0.1)" voltea y escala
// las coordenadas originales (que estaban en un canvas de 6000x6000)
// para que quepan en el viewBox de 600x600.
//
// Se usa en tres lugares:
//   1. Navbar (48px) - junto al nombre de la empresa
//   2. Hero (600px, 6% opacidad) - como fondo decorativo
//   3. Footer (32px) - junto al copyright
// ============================================================
const HorseLogo = ({ size = 42, invert = false }) => (
  <img
    src={HorseLogoSrc}
    alt="Shires Logistic"
    style={{
      width: size,
      height: size,
      objectFit: "contain",
      filter: invert ? "brightness(0) invert(1)" : "none",
    }}
  />
);


// ============================================================
// COMPONENTE PRINCIPAL: App
// ------------------------------------------------------------
// Este es el componente raiz que contiene toda la pagina.
// "export default" significa que este es el componente que React
// va a montar cuando se cargue la aplicacion.
// ============================================================
export default function App() {

  // ----------------------------------------------------------
  // ESTADO DEL COMPONENTE (useState)
  // ----------------------------------------------------------
  // menuOpen: controla si el menu movil esta abierto o cerrado
  // scrolled: se vuelve true cuando el usuario baja mas de 40px,
  //           lo que hace que el navbar se vea mas solido
  // form: objeto que guarda los valores de cada campo del formulario
  // sent: se vuelve true cuando el formulario fue enviado,
  //       lo que cambia la vista a la pantalla de confirmacion
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", cargoType: "", route: "", message: "" });
  const [sent, setSent] = useState(false);

  // ----------------------------------------------------------
  // EFECTO: DETECTAR SCROLL
  // ----------------------------------------------------------
  // useEffect con [] se ejecuta una sola vez cuando el componente
  // se monta (aparece en pantalla).
  // Agrega un listener al evento "scroll" de la ventana.
  // El return limpia el listener cuando el componente se desmonta,
  // para evitar fugas de memoria.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ----------------------------------------------------------
  // FUNCION: ENVIAR FORMULARIO
  // ----------------------------------------------------------
  // e.preventDefault() evita que la pagina se recargue (comportamiento
  // default de los formularios HTML). Luego cambia "sent" a true
  // para mostrar la pantalla de confirmacion.
  // En produccion aqui iria la llamada a un API o servicio de email.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    // Contenedor raiz: aplica la fuente Outfit a toda la pagina
    // y establece el color de fondo y texto base
   
    <div style={{ fontFamily: "'Outfit', sans-serif", background: C.bg, color: C.text, colorScheme: "light", width: "100%", margin: 0, overflowX: "hidden" }}>

      {/* Carga la fuente Outfit desde Google Fonts con los pesos 400, 500, 600, 700 y 800 */}
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #root { width: 100%; margin: 0; padding: 0; }

    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
    @keyframes glow { 0%, 100% { opacity: 0.08; } 50% { opacity: 0.14; } }
    
    /* ENTRANCE ANIMATIONS (Logistics Theme: movement, assembly, and route mapping) */
    @keyframes slideLeft {
      from { transform: translateX(-40px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideRight {
      from { transform: translateX(40px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideLeftMobile {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideRightMobile {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes scaleWidth {
      from { transform: scaleX(0); opacity: 0; }
      to { transform: scaleX(1); opacity: 0.8; }
    }
    @keyframes fadeUpShort {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes popIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .hero-line-left {
      display: inline-block;
      animation: slideLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .hero-line-right {
      display: inline-block;
      animation: slideRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      animation-delay: 0.15s;
      opacity: 0;
    }
    .route-divider {
      animation: scaleWidth 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      animation-delay: 0.45s;
      opacity: 0;
      transform-origin: center;
    }
    .hero-desc {
      animation: fadeUpShort 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      animation-delay: 0.6s;
      opacity: 0;
    }
    .hero-buttons {
      animation: popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: 0.8s;
      opacity: 0;
    }

    .horse-watermark { animation: glow 6s ease-in-out infinite; }

    .desktop-nav { display: flex !important; }
    .mobile-menu-btn { display: none !important; }
    
    /* TITULO HERO */
    .hero-title {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(2.3rem, 6.2vw, 4.8rem);
      font-weight: 900;
      color: #ffffff;
      line-height: 1.15;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
      text-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
    }

    /* DESCRIPCION HERO */
    .hero-desc {
      font-size: clamp(1.05rem, 1.8vw, 1.25rem);
      color: rgba(255, 255, 255, 0.88);
      line-height: 1.65;
      max-width: 600px;
      margin: 0 auto 40px;
    }

    /* BOTONES HERO */
    .btn-hero {
      padding: 16px 36px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 16px;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-hero.primary {
      background: #C9A84C;
      color: #0F3460;
      box-shadow: 0 8px 30px rgba(201, 168, 76, 0.3);
    }

    .btn-hero.primary:hover {
      background: #A8872E;
      transform: translateY(-2px);
      box-shadow: 0 12px 36px rgba(201, 168, 76, 0.45);
    }

    .btn-hero.secondary {
      background: rgba(255, 255, 255, 0.07);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-hero.secondary:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.45);
    }

    /* RESPONSIVIDAD GENERAL */
    @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .mobile-menu-btn { display: block !important; }
      
      .hero-br {
        display: none;
      }
      .hero-line-left {
        animation-name: slideLeftMobile;
      }
      .hero-line-right {
        animation-name: slideRightMobile;
      }
      .btn-hero {
        padding: 14px 28px;
        font-size: 15px;
        width: 100%;
        justify-content: center;
      }
      .hero-buttons {
        flex-direction: column;
        width: 100%;
        max-width: 320px;
        margin: 0 auto;
        gap: 12px !important; 
      }
      .hero-scroll-indicator {
        display: none !important;
      }
      .horse-watermark {
        right: -15% !important;
        bottom: -5% !important;
        opacity: 0.06 !important;
        transform: scale(0.7);
      }
    }

    @media (max-height: 720px) {
      .hero-scroll-indicator {
        display: none !important;
      }
    }
  `}</style>

      {/* ==========================================================
          SECCION: NAVBAR
          ----------------------------------------------------------
          Barra de navegacion fija en la parte superior.
          - position fixed: se queda pegada aunque el usuario scrollee
          - zIndex 100: se pone por encima de todo el contenido
          - El fondo cambia de opacidad segun la variable "scrolled":
            sin scroll = semitransparente, con scroll = casi solido
          - backdropFilter blur: efecto de vidrio esmerilado detras
          ========================================================== */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(13,27,42,0.97)" : "rgba(13,27,42,0.88)",
        backdropFilter: "blur(12px)",
        transition: "background 0.3s",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        padding: "0 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 70,
      }}>
        {/* Logo: icono del caballo + nombre de la empresa en dos lineas */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <HorseLogo size={42} invert/>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 25, color: "#fff", letterSpacing: "3px" }}>
              SHIRES
            </span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "4px", marginTop: 2 }}>
              — LOGISTIC —
            </span>
          </div>
        </div>

        {/* Links de navegacion desktop: solo visibles en pantallas grandes
            Se ocultan en movil via CSS (.desktop-nav)
            Cada link cambia de color al pasar el mouse con onMouseEnter/Leave */}
        <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} style={{ color: "rgba(255,255,255,0.79)", fontSize: 15, fontWeight: 500, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.75)"}
            >{l.label}</a>
          ))}
          {/* Boton CTA (Call To Action) con fondo dorado */}
          <a href="#contacto" style={{ background: C.accent, color: C.primary, padding: "9px 20px", borderRadius: 8, fontSize: 15, fontWeight: 700, textDecoration: "none", transition: "background 0.2s" }}
            onMouseEnter={e => e.target.style.background = C.accentHover}
            onMouseLeave={e => e.target.style.background = C.accent}
          >Contáctanos</a>
        </div>

        {/* Boton hamburguesa para movil: solo visible en pantallas pequenas
            Alterna entre icono de menu (tres lineas) y X segun el estado menuOpen */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Menu movil desplegable: solo se renderiza cuando menuOpen es true
          Aparece justo debajo del navbar (top: 68 = altura del navbar) */}
      {menuOpen && (
        <div style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 99, background: C.primary, padding: "1.5rem 5%", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          {NAV_LINKS.map(l => (
            // Al hacer click en un link, cierra el menu automaticamente
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} style={{ display: "block", color: "rgba(255,255,255,0.8)", fontSize: 16, padding: "12px 0", textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{l.label}</a>
          ))}
          <a href="#contacto" onClick={() => setMenuOpen(false)} style={{ display: "block", marginTop: 16, background: C.accent, color: C.primary, padding: "12px 0", borderRadius: 8, textAlign: "center", fontWeight: 700, textDecoration: "none" }}>Contáctanos</a>
        </div>
      )}

      {/* ==========================================================
          SECCION: HERO
          ----------------------------------------------------------
          Primera seccion visible al entrar al sitio.
          - minHeight 100vh: ocupa toda la altura de la pantalla
          - overflow hidden: el caballo watermark no desborda
          - Contiene tres capas:
            1. Caballo watermark (fondo decorativo, 6% opacidad)
            2. Grid de lineas (textura sutil, 3% opacidad)
            3. Contenido principal (titulo, descripcion, botones)
          ========================================================== */}
        <section id="inicio" style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${C.primary} 0%, #0A2647 100%)`, display: "flex", alignItems: "center", position: "relative", padding: "100px 0 60px" }}>

        {/* Contenedor de fondo decorativo aislado para no interferir con el flujo y evitar desbordes */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          {/* Caballo de fondo con glow dorado */}
          <div className="horse-watermark" style={{ position: "absolute", right: "-5%", bottom: "-8%", opacity: 0.1, userSelect: "none", filter: `drop-shadow(0 0 60px ${C.accent})` }}>
            <HorseLogo size={620} invert color={C.accent} />
          </div>

          {/* Grid decorativo */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

          {/* Resplandor dorado sutil arriba a la izquierda */}
          <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 500, height: 500, background: `radial-gradient(circle, ${C.accent}22 0%, transparent 70%)` }} />
        </div>

        <div className="hero-content" style={{ maxWidth: 800, position: "relative", zIndex: 1, textAlign: "center", margin: "0 auto", padding: "0 24px" }}>

          <h1 className="hero-title" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span className="hero-line-left" style={{ display: "block" }}>
              Soluciones logísticas{" "}
              <span style={{
                background: `linear-gradient(135deg, ${C.accent} 0%, #F4D88C 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>integrales</span>,
            </span>
            <span className="hero-line-right" style={{ display: "block" }}>
              conectando tu carga con el mundo.
            </span>
          </h1>

          {/* Línea de ruta/conexión decorativa animada */}
          <div className="route-divider" style={{ height: "2px", width: "80px", background: `linear-gradient(90deg, transparent, ${C.accent}, transparent)`, margin: "24px auto" }} />

          <p className="hero-desc">
            Nuestra base en Manzanillo es tu conexión estratégica al mercado global, con cobertura local y foránea.
          </p>

          <div className="hero-buttons" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="#contacto" className="btn-hero primary">
              Contáctanos <ArrowRight size={19} />
            </a>

            <a href="#servicios" className="btn-hero secondary">
              Nuestros servicios
            </a>
          </div>
        </div>

        <a href="#servicios" className="hero-scroll-indicator" style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.4)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 11, letterSpacing: "1px" }}>
          SCROLL <ChevronDown size={18} style={{ animation: "bounce 2s infinite" }} />
        </a>
      </section>

      {/* ==========================================================
          SECCION: SERVICIOS
          ----------------------------------------------------------
          Grid de tarjetas con los servicios que ofrece la empresa.
          - auto-fit + minmax(300px, 1fr): el grid se adapta automaticamente,
            poniendo las columnas que quepan con minimo 300px cada una
          - Las tarjetas suben 4px al pasar el mouse (translateY)
            y aparece una sombra sutil para dar efecto de elevacion
          ========================================================== */}
      <section id="servicios" style={{ padding: "80px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: C.accent, fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>LO QUE HACEMOS</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, marginBottom: 14 }}>Nuestros Servicios Logísticos</h2>
            <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 520, margin: "0 auto" }}>Ofrecemos servicios <strong>locales y foráneos</strong> diseñados para mover tu mercancía de forma segura y eficiente.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {/* Se recorre el array SERVICES y por cada elemento se crea una tarjeta */}
            {SERVICES.map((s, i) => (
              <div key={i} style={{ background: C.bgCard, borderRadius: 16, border: `1px solid ${C.border}`, padding: "36px 32px", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Icono del servicio con fondo dorado semitransparente */}
                <div style={{ width: 56, height: 56, background: `rgba(201,168,76,0.1)`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <s.icon size={26} color={C.accent} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 4, color: C.text }}>{s.title}</h3>
                <p style={{ color: C.accent, fontWeight: 600, fontSize: 13, marginBottom: 14 }}>{s.subtitle}</p>
                <p style={{ color: C.textMuted, fontSize: 15, lineHeight: 1.7, marginBottom: 20 }}>{s.desc}</p>
                {/* Etiquetas/chips al pie de cada tarjeta */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {s.tags.map(t => (<span key={t} style={{ background: C.bgAlt, color: C.textMuted, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 6 }}>{t}</span>))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          SECCION: CAPACIDAD
          ----------------------------------------------------------
          Grid de tarjetas con los tipos de unidades disponibles.
          Fondo oscuro (C.primary) para contrastar con las secciones claras.
          Al hacer hover, el fondo y borde de cada tarjeta cambia a dorado.
          ========================================================== */}
      <section id="capacidad" style={{ padding: "80px 5%", background: C.primary }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: C.accent, fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>GESTIÓN DE UNIDADES</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: "#fff", marginBottom: 14 }}>Capacidad y Equipos</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
              Operamos bajo un modelo ágil <strong style={{ color: "rgba(255,255,255,0.7)" }}>Asset-Light</strong>. Red de proveedores certificados para garantizar la unidad exacta para tu mercancía.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {/* Se recorre el array FLEET y por cada elemento se crea una tarjeta */}
            {FLEET.map((f, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "24px 20px", display: "flex", alignItems: "flex-start", gap: 14, transition: "background 0.2s, border-color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = `rgba(201,168,76,0.1)`; e.currentTarget.style.borderColor = `rgba(201,168,76,0.4)`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                <div style={{ width: 42, height: 42, background: `rgba(201,168,76,0.15)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <f.icon size={20} color={C.accent} strokeWidth={1.8} />
                </div>
                <div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 3 }}>{f.label}</p>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{f.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          SECCION: VALORES
          ----------------------------------------------------------
          Grid de 4 tarjetas con los valores diferenciadores.
          Al hacer hover, el borde cambia a dorado y la tarjeta sube ligeramente.
          No tiene id porque no esta en el menu de navegacion.
          ========================================================== */}
      <section style={{ padding: "80px 5%", background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: C.accent, fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>POR QUÉ ELEGIRNOS</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text }}>Lo que nos distingue</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ textAlign: "center", padding: "32px 20px", border: `1px solid ${C.border}`, borderRadius: 14, transition: "border-color 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}
              >
                {/* Icono centrado con fondo circular semitransparente */}
                <div style={{ width: 60, height: 60, background: `rgba(201,168,76,0.1)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <v.icon size={26} color={C.accent} strokeWidth={1.8} />
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6 }}>{v.title}</h3>
                <p style={{ color: C.textMuted, fontSize: 14 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          SECCION: CONTACTO
          ----------------------------------------------------------
          Dos columnas:
            Izquierda: formulario de cotizacion
            Derecha: informacion de contacto + caja de tiempo de respuesta

          El formulario tiene dos estados controlados por "sent":
            - sent = false: muestra el formulario normal
            - sent = true: muestra mensaje de confirmacion con icono

          Cada campo del formulario actualiza el objeto "form" en el estado.
          El patron { ...form, [f.id]: e.target.value } copia todos los
          valores actuales del formulario y solo actualiza el campo que cambio.
          ========================================================== */}
      <section id="contacto" style={{ padding: "80px 5%", background: C.bgAlt }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: C.accent, fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>CONTACTO</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, marginBottom: 10 }}>Cotiza tu Envío</h2>
            <p style={{ color: C.textMuted, fontSize: 15, maxWidth: 480, margin: "0 auto" }}>Déjanos tus datos y un asesor logístico se pondrá en contacto contigo a la brevedad.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>

            {/* COLUMNA IZQUIERDA: formulario */}
            <div style={{ background: C.bgCard, borderRadius: 16, padding: "36px 28px", border: `1px solid ${C.border}` }}>
              {sent ? (
                // Pantalla de confirmacion despues de enviar el formulario
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 64, height: 64, background: `rgba(201,168,76,0.1)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Zap size={28} color={C.accent} />
                  </div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700, color: C.text, marginBottom: 8 }}>Solicitud enviada</h3>
                  <p style={{ color: C.textMuted, fontSize: 14 }}>Un asesor te contactará pronto.</p>
                </div>
              ) : (
                // Formulario normal con campos de texto
                // Los 4 primeros campos (nombre, empresa, email, tel) se generan
                // con .map() desde un array para no repetir el mismo codigo 4 veces
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { id: "name", label: "Nombre completo", type: "text", placeholder: "Tu nombre" },
                    { id: "company", label: "Empresa", type: "text", placeholder: "Nombre de tu empresa" },
                    { id: "email", label: "Correo electrónico", type: "email", placeholder: "correo@empresa.com" },
                    { id: "phone", label: "Teléfono", type: "tel", placeholder: "+52 314 000 0000" },
                  ].map(f => (
                    <div key={f.id}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 5 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} required value={form[f.id]} onChange={e => setForm({ ...form, [f.id]: e.target.value })}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                    </div>
                  ))}
                  {/* Select de tipo de carga */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 5 }}>Tipo de carga</label>
                    <select required value={form.cargoType} onChange={e => setForm({ ...form, cargoType: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", fontFamily: "inherit", background: "#fff", boxSizing: "border-box" }}>
                      <option value="">Seleccionar...</option>
                      <option>Carga Contenerizada (FCL/LCL)</option>
                      <option>Carga en General</option>
                    </select>
                  </div>
                  {/* Campo origen/destino */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 5 }}>Origen / Destino</label>
                    <input type="text" placeholder="Ej: Manzanillo a CDMX" value={form.route} onChange={e => setForm({ ...form, route: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                  </div>
                  {/* Area de texto para mensaje adicional */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 5 }}>Mensaje</label>
                    <textarea rows={3} placeholder="Detalles adicionales de tu envío" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
                  </div>
                  {/* Boton de envio */}
                  <button type="submit" style={{ background: C.accent, color: C.primary, border: "none", padding: "13px", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", transition: "background 0.2s", marginTop: 4 }}
                    onMouseEnter={e => e.target.style.background = C.accentHover}
                    onMouseLeave={e => e.target.style.background = C.accent}
                  >Enviar Solicitud</button>
                </form>
              )}
            </div>

            {/* COLUMNA DERECHA: informacion de contacto + tiempo de respuesta */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Tarjeta oscura con icono, label y valor para cada dato de contacto
                  c.value.split("\n") parte el texto en lineas cuando hay salto de linea */}
              <div style={{ background: C.contactBg, borderRadius: 16, padding: "32px 28px", color: "#fff" }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#fff" }}>Información de contacto</h3>
                {[
                  { icon: MapPin, label: "Ubicación", value: "Manzanillo, Colima, México" },
                  { icon: Mail, label: "Correos", value: "a.santillan@shireslogistic.com\ne.magana@shireslogistic.com" },
                  { icon: Phone, label: "Teléfonos", value: "444 133 8949\n812 355 5926" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: 20, paddingBottom: 20, borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                    <div style={{ width: 40, height: 40, background: `rgba(201,168,76,0.15)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <c.icon size={18} color={C.accent} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, marginBottom: 4, letterSpacing: "0.5px" }}>{c.label.toUpperCase()}</p>
                      {c.value.split("\n").map((v, j) => (<p key={j} style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>{v}</p>))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Caja de tiempo de respuesta con fondo crema */}
              <div style={{ background: C.timeBg, borderRadius: 14, padding: "22px 24px", border: `1px solid ${C.timeBorder}` }}>
                <p style={{ color: C.timeText, fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Tiempo de respuesta</p>
                <p style={{ color: C.timeText, fontSize: 22, fontWeight: 800 }}>Menos de 2 horas</p>
                <p style={{ color: C.timeText, fontSize: 13, marginTop: 4 }}>En horario hábil, lunes a viernes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          SECCION: FOOTER
          ----------------------------------------------------------
          Barra inferior con logo pequeno, copyright y link de privacidad.
          flexWrap: "wrap" permite que los elementos bajen a una nueva
          linea en pantallas muy pequenas sin romper el layout.
          ========================================================== */}
      <footer style={{ background: C.primary, padding: "28px 5%", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <HorseLogo size={32} invert color={C.accent} />
          <span style={{ fontFamily: "'Outfit', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
            © 2026 Shires Logistic. Todos los derechos reservados.
          </span>
        </div>
        <a href="#" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none" }}>Aviso de privacidad</a>
      </footer>
    </div>
  );
}