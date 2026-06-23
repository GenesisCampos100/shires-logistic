// ============================================================
// IMPORTACIONES
// ------------------------------------------------------------
// useState y useEffect son hooks de React:
//   - useState: guarda valores que pueden cambiar (ej: si el menu esta abierto)
//   - useEffect: ejecuta codigo cuando el componente aparece o cambia
// Los iconos vienen de la libreria lucide-react (iconos SVG listos para usar)
// ============================================================
import { useState, useEffect } from "react";
import "./App.css";
import {
  Package, Globe, Shield, Zap, Handshake,
  MapPin, Mail, Phone, ChevronDown, Menu, X,
  ArrowRight, Container, Truck, CheckCircle
} from "lucide-react";
import HorseLogoSrc from "./assets/picsvg_modified.svg";
import emailjs from "@emailjs/browser";

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
      display: "block", 
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
  // alertState: guarda la configuracion y el estado de la alerta flotante premium
  // errors: objeto que guarda el mensaje de error de cada campo (string vacio = sin error)
  // touched: objeto que rastrea si el usuario ya interactuó con cada campo;
  //          solo mostramos errores en campos que el usuario ya tocó
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", cargoType: "", route: "", message: "" });
  const [alertState, setAlertState] = useState({ show: false, exiting: false, title: "", message: "", type: "success" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ----------------------------------------------------------
  // FUNCIONES DE VALIDACION
  // ----------------------------------------------------------

  // validateEmail: verifica que el correo tenga un formato valido.
  // La expresion regular (regex) valida:
  //   - Uno o mas caracteres antes del @
  //   - Un dominio con al menos un punto (ej: gmail.com)
  // Retorna true si el correo es valido, false si no.
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  };

  // validatePhone: verifica que el número sea un teléfono real.
  // Acepta formatos con o sin codigo de país, espacios, guiones o puntos.
  // En México y la mayoría de países, un teléfono válido tiene al menos 10 dígitos.
  const validatePhone = (phone) => {
    // Primero quitamos espacios, guiones, paréntesis y el símbolo +
    const digits = phone.replace(/[\s\-().+]/g, "");
    // Verificamos que queden solo dígitos y que sean al menos 10 (hasta 15)
    return /^\d{10,15}$/.test(digits);
  };

  // validateField: valida UN campo específico por su id y valor.
  // Retorna un string con el mensaje de error, o string vacio si el campo es valido.
  // Esta funcion centraliza todas las reglas de validacion en un solo lugar.
  const validateField = (id, value) => {
    // Convertimos el valor a string y quitamos espacios en los extremos
    const v = String(value).trim();

    switch (id) {
      case "name":
        // El nombre no puede estar vacío
        if (!v) return "El nombre es obligatorio.";
        // El nombre debe tener al menos 2 caracteres
        if (v.length < 2) return "Ingresa un nombre válido.";
        return "";

      case "company":
        // La empresa no puede estar vacía
        if (!v) return "El nombre de la empresa es obligatorio.";
        return "";

      case "email":
        // El correo no puede estar vacío
        if (!v) return "El correo electrónico es obligatorio.";
        // Usamos validateEmail para verificar el formato
        if (!validateEmail(v)) return "Ingresa un correo válido (ej: nombre@empresa.com).";
        return "";

      case "phone":
        // El teléfono no puede estar vacío
        if (!v) return "El teléfono es obligatorio.";
        // Usamos validatePhone para verificar que sea un número real
        if (!validatePhone(v)) return "Ingresa un teléfono válido (ej: +52 314 000 0000).";
        return "";

      case "cargoType":
        // El tipo de carga debe ser seleccionado
        if (!v) return "Selecciona el tipo de carga.";
        return "";

      case "route":
        // El origen/destino ahora es obligatorio
        if (!v) return "El origen / destino es obligatorio.";
        if (v.length < 4) return "Ingresa una ruta válida.";
        return "";

      default:
        // Campos opcionales (message) no tienen validación
        return "";
    }
  };

  // handleFieldChange: se ejecuta cada vez que el usuario escribe en un campo.
  // Actualiza el valor en el estado 'form' y, si el campo ya fue tocado antes,
  // re-valida en tiempo real para dar feedback inmediato.
  const handleFieldChange = (id, value) => {
    // Actualizamos el valor del campo en el estado del formulario
    setForm(prev => ({ ...prev, [id]: value }));

    // Si el usuario ya tocó este campo, re-validamos mientras escribe
    // Esto da feedback en tiempo real (el error desaparece al corregir)
    if (touched[id]) {
      setErrors(prev => ({ ...prev, [id]: validateField(id, value) }));
    }
  };

  // handleFieldBlur: se ejecuta cuando el usuario sale de un campo (pierde foco).
  // Marcamos el campo como "tocado" y lo validamos por primera vez.
  // Usamos onBlur (no onChange) para no mostrar errores antes de que el usuario
  // haya tenido oportunidad de llenar el campo.
  const handleFieldBlur = (id) => {
    // Marcamos el campo como tocado para activar la validacion visual
    setTouched(prev => ({ ...prev, [id]: true }));
    // Validamos el campo y guardamos el error (si hay)
    setErrors(prev => ({ ...prev, [id]: validateField(id, form[id]) }));
  };

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
  // EFECTO: AUTO-CIERRE DE LA ALERTA FLOTANTE
  // ----------------------------------------------------------
  // Controla el ciclo de vida de la alerta flotante.
  // Muestra la alerta por 5 segundos en total. A los 4.6 segundos (4600ms)
  // inicia la animación de salida (exiting = true) y a los 5 segundos la oculta.
  useEffect(() => {
    if (alertState.show) {
      // Iniciamos la animación de salida un poco antes de quitar el elemento
      const exitTimer = setTimeout(() => {
        setAlertState(prev => ({ ...prev, exiting: true }));
      }, 4600);

      // Ocultamos la alerta por completo al cumplir los 5 segundos
      const closeTimer = setTimeout(() => {
        setAlertState({ show: false, exiting: false, title: "", message: "", type: "success" });
      }, 5000);

      // Limpieza de temporizadores si la alerta se cierra manualmente o se desmonta
      return () => {
        clearTimeout(exitTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [alertState.show]);

  // ----------------------------------------------------------
  // HOOK: ANIMACION DE REVELADO AL SCROLLEAR
  // ----------------------------------------------------------

useEffect(() => {
  const timer = setTimeout(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.08 }
    );

    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-pop, .stat-num")
      .forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, 100); // pequeño delay para que React termine de pintar

  return () => clearTimeout(timer);
}, []);


useEffect(() => {
  const section = document.getElementById("capacidad");
  if (!section) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("section-visible");
        observer.disconnect(); // solo una vez
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(section);
  return () => observer.disconnect();
}, []);

  // ----------------------------------------------------------
  // FUNCION: ENVIAR FORMULARIO
  // ----------------------------------------------------------
  // Antes de enviar, validamos TODOS los campos requeridos a la vez.
  // Si hay errores, los mostramos todos juntos y bloqueamos el envío.
  // Si todo está bien, procedemos con la llamada a EmailJS.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Campos que son obligatorios y deben pasar validacion
    const requiredFields = ["name", "company", "email", "phone", "cargoType", "route"];

    // Generamos los errores de todos los campos requeridos de una vez
    const newErrors = {};
    requiredFields.forEach(id => {
      newErrors[id] = validateField(id, form[id]);
    });

    // Marcamos todos los campos requeridos como "tocados" para mostrar sus errores
    const allTouched = {};
    requiredFields.forEach(id => { allTouched[id] = true; });

    // Guardamos los errores y el estado de tocados en el estado
    setErrors(newErrors);
    setTouched(allTouched);

    // Verificamos si existe algún error (valor no vacío en el objeto errors)
    const hasErrors = Object.values(newErrors).some(msg => msg !== "");

    // Si hay errores, detenemos el envio y hacemos scroll al primer campo con error
    if (hasErrors) {
      const firstErrorField = requiredFields.find(id => newErrors[id] !== "");
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return; // <-- Detenemos aqui, no enviamos el formulario
    }

    // Si llegamos aqui, todos los campos son validos. Procedemos con el envio.
    try {
      await emailjs.send(
        "service_l0dtc7s",    // de EmailJS → Email Services
        "template_3ebzojz",   // de EmailJS → Email Templates
        {
          nombre:     form.name,
          empresa:    form.company,
          correo:     form.email,
          telefono:   form.phone,
          tipo_carga: form.cargoType,
          ruta:       form.route,
          mensaje:    form.message || "Sin mensaje adicional",
        },
        "Nm0AAAQ9NEZK2ctTZ"   // de EmailJS → Account → Public Key
      );

      // Reseteamos el formulario y los estados de validacion
      setForm({ name: "", company: "", email: "", phone: "", cargoType: "", route: "", message: "" });
      setTouched({});
      setErrors({});

      // Mostramos la alerta flotante premium de exito
      setAlertState({
        show: true,
        exiting: false,
        title: "¡Solicitud Enviada con Éxito!",
        message: "Tu cotización ha sido recibida. Un asesor logístico te contactará en menos de 2 horas.",
        type: "success"
      });
    } catch (err) {
      console.error("Error al enviar:", err);
      // Mostramos alerta flotante premium de error
      setAlertState({
        show: true,
        exiting: false,
        title: "Error de Envío",
        message: "Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.",
        type: "error"
      });
    }
  };

  return (
    // Contenedor raiz: aplica la fuente Outfit a toda la pagina
    // y establece el color de fondo y texto base
   
    <div style={{ fontFamily: "'Outfit', sans-serif", background: C.bg, color: C.text, colorScheme: "light", width: "100%", margin: 0, overflowX: "hidden" }}>

      {/* Carga la fuente Outfit desde Google Fonts con los pesos 400, 500, 600, 700 y 800 */}
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />


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
        background: scrolled ? "rgba(10,20,35,0.98)" : "rgba(10,20,35,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "all 0.4s ease",
        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.15)" : "1px solid transparent",
        padding: "0 5%",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 70,
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
      }}>

  {/* LOGO */}
  <a href="#inicio" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
    <div style={{ position: "relative" }}>
      <HorseLogo size={42} invert />
      {/* Glow dorado detrás del logo */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle, ${C.accent}33 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 25, color: "#fff", letterSpacing: "4px" }}>
        SHIRES
      </span>
      <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 8, color: "#fff", letterSpacing: "5px", marginTop: 3, opacity: 0.85 }}>
        — LOGISTIC —
      </span>
    </div>
  </a>

  {/* LINKS DESKTOP */}
  <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 6 }}>
    {NAV_LINKS.map(l => (
      <a key={l.href} href={l.href}
      className="nav-link"
        style={{
          color: "rgba(255,255,255,0.72)", fontSize: 15, fontWeight: 500,
          textDecoration: "none", padding: "8px 16px", borderRadius: 8,
          transition: "all 0.25s ease", position: "relative", letterSpacing: "0.3px",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = "#fff";
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = "rgba(255,255,255,0.72)";
          e.currentTarget.style.background = "transparent";
        }}
      >{l.label}</a>
    ))}

    {/* Separador */}
    <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", margin: "0 10px" }} />

    {/* Botón CTA */}
    <a href="#contacto"
      style={{
        background: `linear-gradient(135deg, ${C.accent} 0%, #E8C96A 100%)`,
        color: C.primary, padding: "10px 22px", borderRadius: 8,
        fontSize: 14, fontWeight: 700, textDecoration: "none",
        transition: "all 0.25s ease",
        boxShadow: `0 4px 15px ${C.accent}44`,
        letterSpacing: "0.3px",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 25px ${C.accent}66`;
        e.currentTarget.style.background = `linear-gradient(135deg, #E8C96A 0%, ${C.accent} 100%)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = `0 4px 15px ${C.accent}44`;
        e.currentTarget.style.background = `linear-gradient(135deg, ${C.accent} 0%, #E8C96A 100%)`;
      }}
    >Contáctanos</a>
  </div>

  {/* HAMBURGUESA MÓVIL */}
  <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn"
    style={{
      display: "none", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
      cursor: "pointer", color: "#fff", padding: "8px", borderRadius: 8,
      transition: "all 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
  >
    {menuOpen ? <X size={22} /> : <Menu size={22} />}
  </button>
</nav>

{/* MENÚ MÓVIL */}
{menuOpen && (
  <div style={{
    position: "fixed", top: 70, left: 0, right: 0, zIndex: 99,
    background: "rgba(10,20,35,0.98)",
    backdropFilter: "blur(20px)",
    padding: "16px 5% 24px",
    borderBottom: `1px solid rgba(201,168,76,0.15)`,
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  }}>
    {NAV_LINKS.map(l => (
      <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          color: "rgba(255,255,255,0.8)", fontSize: 16, padding: "14px 0",
          textDecoration: "none", borderBottom: "1px solid rgba(255,255,255,0.06)",
          transition: "color 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = C.accent}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
      >
        {l.label}
        <ArrowRight size={14} style={{ opacity: 0.4 }} />
      </a>
    ))}
    <a href="#contacto" onClick={() => setMenuOpen(false)}
      style={{
        display: "block", marginTop: 16,
        background: `linear-gradient(135deg, ${C.accent} 0%, #E8C96A 100%)`,
        color: C.primary, padding: "14px 0", borderRadius: 10,
        textAlign: "center", fontWeight: 700, textDecoration: "none", fontSize: 15,
        boxShadow: `0 4px 20px ${C.accent}44`,
      }}
    >Contáctanos</a>
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
        SECCION: NOSOTROS
        ========================================================== */}
    <section id="nosotros" style={{ padding: "90px 0", background: "#E8EDF4" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 5%" }}>

        {/* ENCABEZADO */}
        <div style={{ textAlign: "center", marginBottom: 64 }} className="reveal">
          <p style={{ color: C.accent, fontWeight: 700, fontSize: 13, letterSpacing: "2px", margin: "0 0 8px 0" }}>QUIÉNES SOMOS</p>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, margin: "0 0 16px 0" }}>
            Logística con propósito,<br />resultados con confianza.
          </h2>
          <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 520, margin: "0 auto", lineHeight: 1.8 }}>
            Expertos en logística integral desde Manzanillo, Colima — el puerto de contenedores más importante de México.
          </p>
        </div>

      </div>

          {/* FRANJA CON 4 TARJETAS */}
    <div style={{ padding: "0 5%", marginBottom: 64 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            {
              num: "01",
              label: "NUESTRA HISTORIA",
              title: "De Manzanillo\nal mundo.",
              text: "Nacimos de la experiencia directa en el sector con la convicción de que la logística debe ser una ventaja competitiva, no un obstáculo. Conectamos empresas mexicanas con el mercado global desde el puerto más importante del país.",
            },
            {
              num: "02",
              label: "MISIÓN",
              title: "Lo que nos\nmueve cada día.",
              text: "Ser el aliado logístico más confiable para empresas que mueven mercancía en México y el mundo — con soluciones ágiles, transparentes y personalizadas que generen resultados reales.",
            },
            {
              num: "03",
              label: "VISIÓN",
              title: "A dónde vamos\na llegar juntos.",
              text: "Convertirnos en referencia nacional de logística integral, reconocidos por nuestra agilidad, transparencia y el compromiso genuino con cada cliente y cada envío que pasa por nuestras manos.",
            },
            {
              num: "04",
              label: "NUESTRO PROCESO",
              title: "Así de simple\nes trabajar con nosotros.",
              steps: [
                "Contáctanos y cuéntanos qué necesitas mover",
                "Recibes tu cotización ",
                "Tu carga en camino, con seguimiento en tiempo real",
              ],
            },
          ].map((item, i) => (
            <div key={i}
              className={`${i % 2 === 0 ? "reveal-left" : "reveal-right"} delay-${i + 1}`}
              style={{
                background: "#0F3460",
                borderRadius: 16,
                padding: "36px 28px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(15,52,96,0.25)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(15,52,96,0.35)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(15,52,96,0.25)";
              }}
            >
              {/* Número decorativo */}
              <span style={{
                position: "absolute", top: 16, right: 20,
                fontFamily: "'Outfit', sans-serif", fontSize: 80,
                fontWeight: 900, color: C.accent, opacity: 0.07,
                lineHeight: 1, userSelect: "none", pointerEvents: "none",
              }}>{item.num}</span>

              {/* Línea dorada top */}
              <div style={{ width: 32, height: 3, background: C.accent, borderRadius: 2, marginBottom: 20 }} />

              <p style={{ color: C.accent, fontWeight: 700, fontSize: 11, letterSpacing: "2.5px", margin: "0 0 12px 0" }}>{item.label}</p>

              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                fontWeight: 800, color: "#fff",
                margin: "0 0 16px 0", lineHeight: 1.3,
                whiteSpace: "pre-line",
              }}>{item.title}</h3>

              {/* Texto o pasos */}
              {item.text ? (
                <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 14, lineHeight: 1.85, margin: 0, textAlign: "justify" }}>
                  {item.text}
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {item.steps.map((step, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: "rgba(201,168,76,0.12)",
                        border: "1px solid rgba(201,168,76,0.25)",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <span style={{ color: C.accent, fontWeight: 700, fontSize: 11 }}>{j + 1}</span>
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 14, lineHeight: 1.6, margin: 0, textAlign: "left", paddingTop: 3 }}>{step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 5%" }}>

        {/* STATS */}
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 0, marginBottom: 48 }}>
          {[
            { num: "#1", label: "Puerto de contenedores en México", sub: "Manzanillo, nuestra base" },
            { num: "<2h", label: "Tiempo de respuesta", sub: "En horario hábil" },
            { num: "100%", label: "Atención personalizada", sub: "Sin bots, sin scripts" },
            { num: "24/7", label: "Seguimiento de tu carga", sub: "Siempre disponibles" },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: "center",
              padding: "0 20px",
              borderRight: i < 3 ? `1px solid ${C.border}` : "none",
            }}>
              <p className="stat-num" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 52, fontWeight: 900, margin: "0 0 8px 0", color: C.accent, lineHeight: 1 }}>{s.num}</p>
              <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 4px 0", color: C.text, lineHeight: 1.4 }}>{s.label}</p>
              <p style={{ fontSize: 13, margin: 0, color: C.textMuted }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* UBICACIÓN — tarjeta destacada */}
        <div className="reveal location-card" style={{
          background: "#fff",
          borderRadius: 16,
          padding: "28px 32px",
          marginBottom: 32,
          display: "flex",
          alignItems: "center",
          gap: 24,
          boxShadow: `0 4px 24px rgba(15,52,96,0.08), 0 0 0 1px ${C.border}`,
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg, ${C.accent}, #E8C96A)`, borderRadius: "16px 0 0 16px" }} />
          <div style={{ width: 52, height: 52, background: `rgba(201,168,76,0.1)`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 8 }}>
            <MapPin size={22} color={C.accent} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: C.text, fontWeight: 700, fontSize: 16, margin: "0 0 6px 0" }}>Ubicación estratégica</p>
            <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Operamos desde <strong style={{ color: C.primary }}>Manzanillo, Colima</strong>, el puerto que mueve más del 50% de los contenedores de México — con acceso directo a rutas del Pacífico y conexiones terrestres a todo el país.
            </p>
          </div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 64, fontWeight: 900, color: C.primary, opacity: 0.04, margin: 0, userSelect: "none", flexShrink: 0, lineHeight: 1 }}>MX</p>
        </div>

        {/* FRASE DE CIERRE */}
        <div className="reveal" style={{
          background: `linear-gradient(135deg, ${C.primary} 0%, #0A2647 100%)`,
          borderRadius: 16, padding: "52px 40px",
          textAlign: "center", position: "relative", overflow: "hidden",
          boxShadow: `0 20px 60px rgba(15,52,96,0.2)`,
        }}>
          <div style={{ position: "absolute", right: -20, bottom: -20, opacity: 0.05, pointerEvents: "none" }}>
            <HorseLogo size={220} invert />
          </div>
          <div style={{ width: 40, height: 3, background: C.accent, borderRadius: 2, margin: "0 auto 24px" }} />
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#fff", margin: "0 0 16px 0", lineHeight: 1.4, position: "relative", zIndex: 1 }}>
            "No somos solo un proveedor.<br />Somos tu aliado logístico."
          </h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 440, margin: "0 auto", lineHeight: 1.8, position: "relative", zIndex: 1 }}>
            Cada envío importa. Cada cliente es prioritario.<br />Así trabajamos desde el primer día.
          </p>
          <div style={{ width: 40, height: 3, background: C.accent, borderRadius: 2, margin: "24px auto 0", opacity: 0.4 }} />
        </div>

      </div>
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
          <div style={{ textAlign: "center", marginBottom: 56 }} className="reveal">
            <p style={{ color: C.accent, fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>LO QUE HACEMOS</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, marginBottom: 14 }}>Nuestros Servicios Logísticos</h2>
            <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 520, margin: "0 auto" }}>Ofrecemos servicios <strong>locales y foráneos</strong> diseñados para mover tu mercancía de forma segura y eficiente.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {/* Se recorre el array SERVICES y por cada elemento se crea una tarjeta */}
            {SERVICES.map((s, i) => (
              <div key={i} className={`reveal-pop delay-${i + 1}`} style={{ background: C.bgCard, borderRadius: 16, border: `1px solid ${C.border}`, padding: "36px 32px", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }}
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
          <div style={{ textAlign: "center", marginBottom: 52 }} className="reveal">
            <p style={{ color: C.accent, fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>GESTIÓN DE UNIDADES</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: "#fff", marginBottom: 14 }}>Capacidad y Equipos</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 580, margin: "0 auto", lineHeight: 1.7 }}>
              Operamos bajo un modelo ágil <strong style={{ color: "rgba(255,255,255,0.7)" }}>Asset-Light</strong>. Red de proveedores certificados para garantizar la unidad exacta para tu mercancía.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {/* Se recorre el array FLEET y por cada elemento se crea una tarjeta */}
            {FLEET.map((f, i) => (
              <div key={i} className="fleet-card" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "24px 20px", display: "flex", alignItems: "flex-start", gap: 10, transition: "background 0.2s, border-color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = `rgba(201,168,76,0.1)`; e.currentTarget.style.borderColor = `rgba(201,168,76,0.4)`; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                <div style={{ width: 42, height: 42, background: `rgba(201,168,76,0.15)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <f.icon size={20} color={C.accent} strokeWidth={1.8} />
                </div>
                <div>
                  <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 3, textAlign: "left" }}>{f.label}</p>
                  <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textAlign: "left" }}>{f.detail}</p>
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
          <div style={{ textAlign: "center", marginBottom: 52 }} className="reveal">
            <p style={{ color: C.accent, fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>POR QUÉ ELEGIRNOS</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text }}>Lo que nos distingue</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {VALUES.map((v, i) => (
              <div key={i} className={`value-card reveal delay-${i + 1}`} style={{ textAlign: "center", padding: "32px 20px", border: `1px solid ${C.border}`, borderRadius: 14, transition: "border-color 0.2s, transform 0.2s" }}
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
          <div style={{ textAlign: "center", marginBottom: 52 }} className="reveal">
            <p style={{ color: C.accent, fontWeight: 700, fontSize: 13, letterSpacing: "2px", marginBottom: 8 }}>CONTACTO</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem, 3.5vw, 3rem)", fontWeight: 800, color: C.text, marginBottom: 10 }}>Contáctanos</h2>
            <p style={{ color: C.textMuted, fontSize: 15, maxWidth: 480, margin: "0 auto" }}>Déjanos tus datos y un asesor logístico se pondrá en contacto contigo a la brevedad.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>

            {/* COLUMNA IZQUIERDA: formulario */}
            <div className="reveal-left" style={{ background: C.bgCard, borderRadius: 16, padding: "36px 28px", border: `1px solid ${C.border}`, textAlign: "left" }}>
              {/* ----------------------------------------------------------
                  FORMULARIO CON VALIDACIONES
                  ----------------------------------------------------------
                  Cada campo usa:
                    - className dinámica: 'field-input error' o 'field-input valid'
                      según si el campo fue tocado y si tiene o no error.
                    - onChange → llama a handleFieldChange para actualizar el valor
                      y re-validar si ya fue tocado.
                    - onBlur  → llama a handleFieldBlur para marcar como tocado
                      y mostrar el error por primera vez.
                    - id      → necesario para que handleSubmit pueda hacer focus()
                      en el primer campo con error. */}
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
                noValidate  // Desactivamos la validacion nativa del browser para usar la nuestra
              >
                  {/* ---- GRUPO: Nombre completo ---- */}
                  <div className="field-group">
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                      Nombre completo <span style={{ color: "#E53935" }}>*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Tu nombre"
                      value={form.name}
                      // onChange: actualiza el valor y re-valida si ya fue tocado
                      onChange={e => handleFieldChange("name", e.target.value)}
                      // onBlur: marca el campo como tocado al salir de él
                      onBlur={() => handleFieldBlur("name")}
                      // Clase dinámica: 'error' si hay error y fue tocado, 'valid' si está bien y fue tocado
                      className={`field-input ${
                        touched.name
                          ? errors.name ? "error" : "valid"
                          : ""
                      }`}
                    />
                    {/* Mensaje de error: solo se muestra si el campo fue tocado Y hay un error */}
                    {touched.name && errors.name && (
                      <span className="field-error-msg">⚠ {errors.name}</span>
                    )}
                  </div>

                  {/* ---- GRUPO: Empresa ---- */}
                  <div className="field-group">
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                      Empresa <span style={{ color: "#E53935" }}>*</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      placeholder="Nombre de tu empresa"
                      value={form.company}
                      onChange={e => handleFieldChange("company", e.target.value)}
                      onBlur={() => handleFieldBlur("company")}
                      className={`field-input ${
                        touched.company
                          ? errors.company ? "error" : "valid"
                          : ""
                      }`}
                    />
                    {touched.company && errors.company && (
                      <span className="field-error-msg">⚠ {errors.company}</span>
                    )}
                  </div>

                  {/* ---- GRUPO: Correo electrónico ---- */}
                  {/* La validacion de email usa la regex en validateEmail() */}
                  <div className="field-group">
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                      Correo electrónico <span style={{ color: "#E53935" }}>*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="correo@empresa.com"
                      value={form.email}
                      onChange={e => handleFieldChange("email", e.target.value)}
                      onBlur={() => handleFieldBlur("email")}
                      className={`field-input ${
                        touched.email
                          ? errors.email ? "error" : "valid"
                          : ""
                      }`}
                    />
                    {touched.email && errors.email && (
                      <span className="field-error-msg">⚠ {errors.email}</span>
                    )}
                  </div>

                  {/* ---- GRUPO: Teléfono ---- */}
                  {/* La validacion usa validatePhone() que acepta diferentes formatos
                      internacionales con o sin código de país */}
                  <div className="field-group">
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                      Teléfono <span style={{ color: "#E53935" }}>*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+52 314 000 0000"
                      value={form.phone}
                      onChange={e => handleFieldChange("phone", e.target.value)}
                      onBlur={() => handleFieldBlur("phone")}
                      className={`field-input ${
                        touched.phone
                          ? errors.phone ? "error" : "valid"
                          : ""
                      }`}
                    />
                    {touched.phone && errors.phone && (
                      <span className="field-error-msg">⚠ {errors.phone}</span>
                    )}
                  </div>

                  {/* ---- GRUPO: Tipo de carga (select) ---- */}
                  <div className="field-group">
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                      Tipo de carga <span style={{ color: "#E53935" }}>*</span>
                    </label>
                    <select
                      id="cargoType"
                      value={form.cargoType}
                      onChange={e => handleFieldChange("cargoType", e.target.value)}
                      onBlur={() => handleFieldBlur("cargoType")}
                      // El select recibe las mismas clases dinamicas que los inputs
                      className={`field-input ${
                        touched.cargoType
                          ? errors.cargoType ? "error" : "valid"
                          : ""
                      }`}
                    >
                      <option value="">Seleccionar...</option>
                      <option>Carga Contenerizada (FCL/LCL)</option>
                      <option>Carga en General</option>
                    </select>
                    {touched.cargoType && errors.cargoType && (
                      <span className="field-error-msg">⚠ {errors.cargoType}</span>
                    )}
                  </div>

                  {/* ---- GRUPO: Origen / Destino ---- */}
                  {/* Este campo ahora es obligatorio */}
                  <div className="field-group">
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                      Origen / Destino <span style={{ color: "#E53935" }}>*</span>
                    </label>
                    <input
                      id="route"
                      type="text"
                      placeholder="Ej: Manzanillo a CDMX"
                      value={form.route}
                      // Actualizamos el valor y validamos si ya fue tocado
                      onChange={e => handleFieldChange("route", e.target.value)}
                      onBlur={() => handleFieldBlur("route")}
                      className={`field-input ${
                        touched.route
                          ? errors.route ? "error" : "valid"
                          : ""
                      }`}
                    />
                    {touched.route && errors.route && (
                      <span className="field-error-msg">⚠ {errors.route}</span>
                    )}
                  </div>

                  {/* ---- GRUPO: Mensaje adicional (opcional) ---- */}
                  <div className="field-group">
                    <label style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                      Mensaje
                      <span style={{ fontSize: 11, fontWeight: 400, color: C.textMuted, marginLeft: 6 }}>(opcional)</span>
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Detalles adicionales de tu envío"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="field-input"
                      style={{ resize: "vertical" }}
                    />
                  </div>

                  {/* ---- BOTON DE ENVIO ---- */}
                  {/* El botón siempre está activo. La validacion ocurre dentro de handleSubmit. */}
                  <button
                    type="submit"
                    style={{
                      background: C.accent,
                      color: C.primary,
                      border: "none",
                      padding: "13px",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 15,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "background 0.2s, transform 0.2s",
                      marginTop: 4,
                    }}
                    onMouseEnter={e => { e.target.style.background = C.accentHover; e.target.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.target.style.background = C.accent; e.target.style.transform = "translateY(0)"; }}
                  >
                    Enviar Solicitud
                  </button>
                </form>
              </div>

              {/* COLUMNA DERECHA: informacion de contacto + tiempo de respuesta */}
            <div className="reveal-right" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: C.contactBg, borderRadius: 16, padding: "32px 28px", color: "#fff", textAlign: "left" }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#fff", margin: "0 0 20px 0", textAlign: "center" }}>Información de contacto</h3>
                {[
                  { icon: MapPin, label: "Ubicación", value: "Manzanillo, Colima, México" },
                  { icon: Mail, label: "Correos", value: "a.santillan@shireslogistic.com\ne.magana@shireslogistic.com" },
                  { icon: Phone, label: "Teléfonos", value: "444 133 8949\n812 355 5926" },
                ].map((c, i) => (
                  <div key={i} style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    marginBottom: i < 2 ? 20 : 0,
                    paddingBottom: i < 2 ? 20 : 0,
                    borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}>
                    {/* Ícono */}
                    <div style={{
                      width: 36, height: 36,
                      background: "rgba(201,168,76,0.15)",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                    }}>
                      <c.icon size={18} color={C.accent} strokeWidth={1.8} />
                    </div>

                    {/* Texto */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
                      <span style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                      }}>{c.label}</span>
                      {c.value.split("\n").map((v, j) => (
                        <span key={j} style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: 16,
                          lineHeight: 1.5,
                        }}>{v}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Caja tiempo de respuesta */}
              <div style={{ background: C.timeBg, borderRadius: 14, padding: "22px 24px", border: `1px solid ${C.timeBorder}` }}>
                <p style={{ color: C.timeText, fontSize: 13, fontWeight: 700, margin: "0 0 4px 0" }}>Tiempo de respuesta</p>
                <p style={{ color: C.timeText, fontSize: 22, fontWeight: 800, margin: "0 0 4px 0" }}>Menos de 2 horas</p>
                <p style={{ color: C.timeText, fontSize: 13, margin: 0 }}>En horario hábil, lunes a viernes.</p>
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
        
      </footer>

      {/* ==========================================================
          ALERTA FLOTANTE PREMIUM (TOAST)
          ----------------------------------------------------------
          Se muestra en la parte superior derecha (o centro en movil)
          cuando el formulario es enviado con exito o falla.
          ========================================================== */}
      {alertState.show && (
        <div className="custom-alert-container">
          <div className={`custom-alert-card ${alertState.exiting ? "exiting" : ""} ${alertState.type}`}>
            <div className="custom-alert-icon">
              {alertState.type === "success" ? (
                <CheckCircle size={22} color="#C9A84C" />
              ) : (
                <X size={22} color="#E53935" />
              )}
            </div>
            <div className="custom-alert-content">
              <h4 className="custom-alert-title">{alertState.title}</h4>
              <p className="custom-alert-desc">{alertState.message}</p>
            </div>
            <button
              className="custom-alert-close"
              onClick={() => setAlertState(prev => ({ ...prev, show: false }))}
              aria-label="Cerrar alerta"
            >
              <X size={16} />
            </button>
            {alertState.type === "success" && <div className="custom-alert-progress" />}
          </div>
        </div>
      )}
    </div>
  );
}