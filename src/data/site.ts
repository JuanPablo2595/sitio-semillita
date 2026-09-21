export const contact = {
  phoneDisplay: "+56 9 9959 9062",
  phoneHref: "tel:+56999599062",
  whatsappNumber: "56999599062",
  whatsappMessage:
    "Hola, quisiera recibir información sobre la Sala Cuna y Jardín Infantil Semillita.",
  publicEmail: "jsemillita@gmail.com",
  address: "República de Israel 1777, Ñuñoa, Región Metropolitana.",
  instagramUrl: "https://www.instagram.com/semillita_jardininfantil/?hl=es",
};

export const site = {
  name: "Sala Cuna y Jardín Infantil Semillita",
  shortName: "Semillita",
  welcome: "Bienvenidos a Sala Cuna y Jardín Infantil Semillita",
  tagline: "Sembramos con amor, educamos para crecer.",
  experience: "Más de 30 años de trayectoria",
  foundedDetail: "Funcionamos desde marzo de 1995.",
  rbd: "42.440-2",
  description:
    "Prototipo local y privado de Sala Cuna y Jardín Infantil Semillita en Ñuñoa, con contenido oficial, niveles, horarios y contacto directo.",
};

export const links = {
  whatsapp: `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(
    contact.whatsappMessage,
  )}`,
  phone: contact.phoneHref,
  email: `mailto:${contact.publicEmail}`,
  instagram: contact.instagramUrl,
};

interface ResponsiveSource {
  media?: string;
  srcset: string;
  type: string;
}

interface ResponsiveAsset {
  alt: string;
  height: number;
  src: string;
  srcset?: string;
  sources?: ResponsiveSource[];
  width: number;
}

const phaseImages = "/images/phase-1-1f";

const srcSet = (folder: string, name: string, widths: number[], extension: string) =>
  widths.map((width) => `${phaseImages}/${folder}/${name}-${width}.${extension} ${width}w`).join(", ");

const photoAsset = (
  folder: string,
  name: string,
  widths: number[],
  alt: string,
  width: number,
  height: number,
): ResponsiveAsset => {
  const largest = widths[widths.length - 1];

  return {
    alt,
    width,
    height,
    src: `${phaseImages}/${folder}/${name}-${largest}.jpg`,
    srcset: srcSet(folder, name, widths, "jpg"),
    sources: [
      { type: "image/avif", srcset: srcSet(folder, name, widths, "avif") },
      { type: "image/webp", srcset: srcSet(folder, name, widths, "webp") },
    ],
  };
};

const sealAsset = (name: string, alt: string, width: number, height: number): ResponsiveAsset => ({
  alt,
  width,
  height,
  src: `${phaseImages}/certifications/${name}-520.png`,
  srcset: `${phaseImages}/certifications/${name}-320.png 320w, ${phaseImages}/certifications/${name}-520.png 520w`,
  sources: [
    {
      type: "image/webp",
      srcset: `${phaseImages}/certifications/${name}-320.webp 320w, ${phaseImages}/certifications/${name}-520.webp 520w`,
    },
  ],
});

const activityPhoto = (asset: ResponsiveAsset) => ({
  kind: "photo" as const,
  ...asset,
});

export const navItems = [
  {
    label: "Nosotros",
    href: "#nosotros",
    children: [
      { label: "Sobre nosotros", href: "#nosotros" },
      { label: "Misión", href: "#mision" },
      { label: "Visión", href: "#vision" },
      { label: "Metodología", href: "#metodologia" },
      { label: "Equipo educativo", href: "#equipo" },
    ],
  },
  {
    label: "Niveles",
    href: "#niveles",
    children: [
      { label: "Niveles", href: "#niveles" },
      { label: "Jornadas", href: "#jornadas" },
    ],
  },
  { label: "Nuestro jardín", href: "#jardin" },
  { label: "Actividades", href: "#actividades" },
  { label: "Contacto", href: "#contacto" },
];

export const images = {
  logo: {
    src: `${phaseImages}/brand/semillita-logo.webp`,
    alt: "Logo de Sala Cuna y Jardín Infantil Semillita",
    width: 320,
    height: 323,
  },
  hero: {
    src: `${phaseImages}/hero/portada-1600.jpg`,
    srcset: `${phaseImages}/hero/portada-640.jpg 640w, ${phaseImages}/hero/portada-960.jpg 960w, ${phaseImages}/hero/portada-1280.jpg 1280w, ${phaseImages}/hero/portada-1600.jpg 1600w`,
    sources: [
      {
        media: "(max-width: 620px)",
        type: "image/avif",
        srcset: `${phaseImages}/hero/portada-mobile-820x1200.avif 820w`,
      },
      {
        media: "(max-width: 620px)",
        type: "image/webp",
        srcset: `${phaseImages}/hero/portada-mobile-820x1200.webp 820w`,
      },
      {
        media: "(max-width: 620px)",
        type: "image/jpeg",
        srcset: `${phaseImages}/hero/portada-mobile-820x1200.jpg 820w`,
      },
      {
        type: "image/avif",
        srcset: `${phaseImages}/hero/portada-640.avif 640w, ${phaseImages}/hero/portada-960.avif 960w, ${phaseImages}/hero/portada-1280.avif 1280w, ${phaseImages}/hero/portada-1600.avif 1600w`,
      },
      {
        type: "image/webp",
        srcset: `${phaseImages}/hero/portada-640.webp 640w, ${phaseImages}/hero/portada-960.webp 960w, ${phaseImages}/hero/portada-1280.webp 1280w, ${phaseImages}/hero/portada-1600.webp 1600w`,
      },
    ],
    alt: "Niños y niñas de Semillita sentados en trenes de juguete en el patio",
    width: 1600,
    height: 1293,
  },
  illustrations: {
    heroSeed: {
      src: "/images/illustrations/hero-seed.svg",
      alt: "Ilustración de una semilla con hojas y flor",
    },
    about: {
      src: "/images/illustrations/intro-about.svg",
      alt: "Ilustración de un jardín con brotes, flores y sol",
    },
    garden: {
      src: "/images/illustrations/garden-house.svg",
      alt: "Ilustración de una casita-hongo del jardín",
    },
    activities: {
      src: "/images/illustrations/activities-kite.svg",
      alt: "Ilustración de actividades con cometa, lápices y hojas",
    },
    mission: {
      src: "/images/illustrations/mission-sprout.svg",
      alt: "Ilustración de manos cuidando un brote",
    },
    vision: {
      src: "/images/illustrations/vision-sun.svg",
      alt: "Ilustración de un sol infantil y un camino verde",
    },
    team: {
      src: "/images/illustrations/team-flowers.svg",
      alt: "Ilustración de flores distintas creciendo juntas",
    },
  },
  levels: [
    {
      src: "/images/illustrations/level-seed.svg",
      alt: "Ilustración de una semilla",
    },
    {
      src: "/images/illustrations/level-sprout.svg",
      alt: "Ilustración de un brote",
    },
    {
      src: "/images/illustrations/level-plant.svg",
      alt: "Ilustración de una planta",
    },
    {
      src: "/images/illustrations/level-flower-house.svg",
      alt: "Ilustración de una flor junto a una casita-hongo",
    },
  ],
  content: {
    methodology: photoAsset(
      "content",
      "metodologia",
      [640, 960],
      "Niños y niñas participando en una experiencia educativa de aula",
      960,
      720,
    ),
    families: photoAsset(
      "content",
      "nuestras-familias",
      [640, 960],
      "Niños y niñas jugando en una casita de patio",
      960,
      1283,
    ),
  },
  facilities: [
    {
      id: "patio",
      label: "Patio exterior",
      featured: true,
      images: [
        photoAsset("facilities", "patio-1", [480, 800], "Fachada exterior de Sala Cuna y Jardín Infantil Semillita", 800, 556),
        photoAsset("facilities", "patio-2", [480, 800], "Patio de acceso de Sala Cuna y Jardín Infantil Semillita", 800, 1067),
        photoAsset("facilities", "patio-3", [480, 800], "Patio con juegos infantiles de Semillita", 800, 1067),
      ],
    },
    {
      id: "salas",
      label: "Salas",
      images: [
        photoAsset("facilities", "sala-1", [480, 800], "Sala de actividades con mesas, sillas y materiales al alcance", 800, 1067),
        photoAsset("facilities", "sala-2", [480, 800], "Sala con espacios de juego y descanso infantil", 800, 1067),
        photoAsset("facilities", "sala-3", [480, 800], "Sala luminosa con materiales didácticos organizados", 800, 1067),
        photoAsset("facilities", "sala-4", [480, 800], "Sala equipada con mesas, sillas y rincones de aprendizaje", 800, 1067),
      ],
    },
    {
      id: "banos",
      label: "Baños",
      images: [
        photoAsset("facilities", "bano-1", [480, 800], "Baño infantil adaptado para niños y niñas", 800, 1067),
        photoAsset("facilities", "bano-2", [480, 800], "Baño infantil con lavamanos y mobiliario a escala", 800, 1067),
      ],
    },
    {
      id: "pasillos",
      label: "Pasillos",
      images: [
        photoAsset("facilities", "pasillo-1", [480, 800], "Pasillo interior de Sala Cuna y Jardín Infantil Semillita", 800, 1067),
        photoAsset("facilities", "pasillo-2", [480, 800], "Pasillo y espacio interior de Semillita", 800, 1067),
      ],
    },
  ],
};

export const presentation = {
  text: "Somos un jardín infantil con más de 30 años de trayectoria. Nacimos con el sueño de crear un lugar donde los niños y niñas pudieran aprender y crecer felices, seguros y queridos.",
  certifications:
    "Contamos con Autorización de Funcionamiento, Reconocimiento Oficial y nuestro",
};

export const certificationImages = [
  {
    title: "Autorización de Funcionamiento",
    alt: "Autorización de Funcionamiento de Sala Cuna y Jardín Infantil Semillita",
    fullSrc: `${phaseImages}/certifications/autorizacion-funcionamiento.png`,
    image: sealAsset(
      "autorizacion-funcionamiento",
      "Sello de Autorización de Funcionamiento otorgado por el Ministerio de Educación",
      520,
      593,
    ),
  },
  {
    title: "Reconocimiento Oficial",
    alt: "Reconocimiento Oficial de Sala Cuna y Jardín Infantil Semillita",
    fullSrc: `${phaseImages}/certifications/reconocimiento-oficial.png`,
    image: sealAsset(
      "reconocimiento-oficial",
      "Sello de Reconocimiento Oficial otorgado por el Ministerio de Educación",
      520,
      579,
    ),
  },
];

export const contentBlocks = [
  {
    id: "mision",
    title: "Misión",
    subtitle: "Educación integral, afectiva y de calidad",
    text: "Nuestra misión es brindar una educación integral, afectiva y de calidad, para que cada niño y cada niña puedan jugar, explorar, crear y aprender en un ambiente seguro y feliz.",
    media: images.illustrations.mission,
    mediaType: "illustration",
    theme: "pastel",
  },
  {
    id: "vision",
    title: "Visión",
    subtitle: "Una comunidad cercana a las familias",
    text: "Nuestra visión es ser una comunidad educativa cercana a las familias, reconocida por contribuir a una infancia feliz, respetada y llena de aprendizajes significativos.",
    media: images.illustrations.vision,
    mediaType: "illustration",
    theme: "white",
    reverse: true,
  },
  {
    id: "metodologia",
    title: "Metodología",
    subtitle: "Currículum Integral y experiencias significativas",
    text: "En Sala Cuna y Jardín Infantil Semillita trabajamos con el Currículum Integral, promoviendo el desarrollo pleno de cada niño y niña. A través del juego, la exploración y las experiencias significativas, fortalecemos la autonomía, la creatividad, la afectividad y el aprendizaje, respetando sus intereses y ritmos individuales.",
    media: images.content.methodology,
    mediaType: "photo",
    theme: "pastel",
  },
  {
    id: "equipo",
    title: "Equipo educativo",
    subtitle: "Profesionalismo, dedicación y amor",
    text: "Contamos con un equipo de amplia experiencia, vocación y compromiso, que acompaña con profesionalismo, dedicación y amor el desarrollo integral de cada niño y niña, haciendo de la Sala Cuna y Jardín Infantil Semillita un espacio donde educar es también cuidar, acompañar y dejar huellas para la vida.",
    media: images.illustrations.team,
    mediaType: "illustration",
    theme: "white",
    reverse: true,
  },
];

export const levelsIntro = {
  quote: "Acompañamos cada etapa del crecimiento con amor, cuidado y aprendizaje.",
};

export const levels = [
  {
    id: "sala-cuna-menor",
    title: "Sala Cuna Menor",
    age: "Desde los 84 días hasta 1 año aprox.",
    image: images.levels[0],
  },
  {
    id: "sala-cuna-mayor",
    title: "Sala Cuna Mayor",
    age: "Desde 1 año hasta 2 años aprox.",
    image: images.levels[1],
  },
  {
    id: "nivel-medio-menor",
    title: "Nivel Medio Menor",
    age: "Desde 2 años hasta 3 años aprox.",
    image: images.levels[2],
  },
  {
    id: "nivel-medio-mayor",
    title: "Nivel Medio Mayor",
    age: "Desde 3 años hasta 4 años aprox.",
    image: images.levels[3],
  },
];

export const schedulesIntro =
  "Sala Cuna y Jardín Infantil Semillita atiende de lunes a viernes, todos los meses del año (enero a diciembre), excepto fines de semana y días feriados.";

export const schedules = [
  {
    title: "Jornada Mañana",
    time: "7:30 a 12:30",
  },
  {
    title: "Jornada Tarde",
    time: "14:00 a 17:50",
  },
  {
    title: "Jornada Completa",
    time: "7:30 a 17:50",
  },
  {
    title: "Jornada Especial N.° 1",
    time: "7:30 a 18:30",
  },
  {
    title: "Jornada Especial N.° 2",
    time: "7:30 a 16:30",
  },
];

export const families = {
  quote: "La familia es parte esencial del proceso educativo.",
  text: "Trabajamos junto a las familias, con comunicación, confianza y respeto, para acompañar a cada niño y niña en su desarrollo y bienestar.",
};

export const principles = {
  quote:
    "Valores que guían nuestro quehacer diario en la formación de niños y niñas felices.",
  words: [
    { title: "amor", size: "xl", accent: "red" },
    { title: "respeto", size: "lg", accent: "green" },
    { title: "bienestar", size: "md", accent: "blue" },
    { title: "juego", size: "xl", accent: "yellow" },
    { title: "inclusión", size: "md", accent: "red" },
    { title: "autonomía", size: "lg", accent: "blue" },
    { title: "buen trato", size: "md", accent: "green" },
  ],
  text: "En Sala Cuna y Jardín Infantil Semillita sembramos valores cada día para cosechar frutos llenos de amor, respeto y felicidad.",
};

export const facilitiesIntro = {
  title: "Nuestro jardín",
  text: "Conoce algunos de los espacios de nuestra sede ubicada en República de Israel 1777, Ñuñoa",
};

export const activitiesIntro =
  "En nuestro jardín ofrecemos, durante todo el año, actividades que favorecen aprendizajes significativos.";

const activityImages = {
  semanaBienvenida: activityPhoto(
    photoAsset(
      "activities",
      "semana-bienvenida",
      [560, 880],
      "Niños y niñas compartiendo materiales en una mesa de bienvenida",
      880,
      658,
    ),
  ),
  conejitoPascua: activityPhoto(
    photoAsset(
      "activities",
      "conejito-pascua",
      [560, 880],
      "Niñas con orejas de conejo durante una celebración de Pascua",
      880,
      1322,
    ),
  ),
  disertacionFamilia: activityPhoto(
    photoAsset(
      "activities",
      "disertacion-familia",
      [560, 880],
      "Niños y niñas participando en la disertación La Familia",
      880,
      578,
    ),
  ),
  diaLibro: activityPhoto(
    photoAsset(
      "activities",
      "dia-libro",
      [560, 880],
      "Actividad del Día del Libro en el patio de Semillita",
      880,
      660,
    ),
  ),
  diaTierra: activityPhoto(
    photoAsset(
      "activities",
      "dia-tierra",
      [560, 880],
      "Niños y niñas pintando un gran dibujo del planeta Tierra",
      880,
      660,
    ),
  ),
  diaMama: activityPhoto(
    photoAsset(
      "activities",
      "dia-mama",
      [560, 880],
      "Niños y niñas en una celebración dedicada a las mamás",
      880,
      634,
    ),
  ),
  diaPapa: activityPhoto(
    photoAsset(
      "activities",
      "dia-papa",
      [560, 880],
      "Niños y niñas realizando una actividad del Día del Papá",
      880,
      660,
    ),
  ),
  talleresInvierno: activityPhoto(
    photoAsset(
      "activities",
      "talleres-invierno",
      [560, 880],
      "Mural infantil con dibujos de talleres de invierno",
      880,
      660,
    ),
  ),
  diaNinoNina: activityPhoto(
    photoAsset(
      "activities",
      "dia-nino-nina",
      [560, 880],
      "Niños y niñas celebrando su día en el jardín",
      880,
      660,
    ),
  ),
  fiestasPatrias: activityPhoto(
    photoAsset(
      "activities",
      "fiestas-patrias",
      [560, 880],
      "Celebración de Fiestas Patrias en Semillita",
      880,
      845,
    ),
  ),
  animalesPreferidos: activityPhoto(
    photoAsset(
      "activities",
      "animales-preferidos",
      [560, 880],
      "Niños y niñas en la disertación Mis animales preferidos",
      880,
      658,
    ),
  ),
  graduacion: activityPhoto(
    photoAsset(
      "activities",
      "graduacion",
      [560, 880],
      "Graduación de niños y niñas de Semillita",
      880,
      633,
    ),
  ),
  navidadFamilia: activityPhoto(
    photoAsset(
      "activities",
      "navidad-familia",
      [560, 880],
      "Celebración de Navidad en Familia en Semillita",
      880,
      684,
    ),
  ),
  talleresVerano: activityPhoto(
    photoAsset(
      "activities",
      "talleres-verano",
      [560, 880],
      "Mural infantil con dibujos de talleres de verano",
      880,
      1171,
    ),
  ),
};

export const activities = [
  {
    title: "Semana Bienvenida",
    text: "Nos reencontramos, acogemos y comenzamos juntos un nuevo año lleno de aprendizajes.",
    image: activityImages.semanaBienvenida,
  },
  {
    title: "Conejito de Pascua",
    text: "Compartimos una jornada de alegría, cariño y amistad.",
    image: activityImages.conejitoPascua,
  },
  {
    title: "Disertación “La Familia”",
    text: "Fortalecemos la identidad y el amor por nuestra familia.",
    image: activityImages.disertacionFamilia,
  },
  {
    title: "Día del Libro",
    text: "Descubrimos la magia de los cuentos y la lectura.",
    image: activityImages.diaLibro,
  },
  {
    title: "Día de la Tierra",
    text: "Aprendemos a amar, respetar y cuidar nuestro planeta.",
    image: activityImages.diaTierra,
  },
  {
    title: "Día de la Mamá",
    text: "Celebramos con amor el vínculo especial con mamá.",
    image: activityImages.diaMama,
  },
  {
    title: "Día del Papá",
    text: "Reconocemos con cariño la presencia y el amor de papá.",
    image: activityImages.diaPapa,
  },
  {
    title: "Talleres de Invierno",
    text: "Aprendemos y disfrutamos creando, jugando y explorando.",
    image: activityImages.talleresInvierno,
  },
  {
    title: "Día del niño y la niña",
    text: "Celebramos la infancia, sus derechos y la alegría de crecer.",
    image: activityImages.diaNinoNina,
  },
  {
    title: "Fiestas Patrias",
    text: "Conocemos y disfrutamos nuestras tradiciones y cultura chilena.",
    image: activityImages.fiestasPatrias,
  },
  {
    title: "Disertación “Mis animales preferidos”",
    text: "Aprendemos sobre los animales y fortalecemos la expresión y la confianza.",
    image: activityImages.animalesPreferidos,
  },
  {
    title: "Graduación",
    text: "Celebramos con orgullo los aprendizajes y logros alcanzados.",
    image: activityImages.graduacion,
  },
  {
    title: "Navidad en Familia",
    text: "Compartimos la magia de la Navidad junto a quienes queremos.",
    image: activityImages.navidadFamilia,
  },
  {
    title: "Talleres de Verano",
    text: "Exploramos, creamos y aprendemos disfrutando del verano.",
    image: activityImages.talleresVerano,
  },
];
