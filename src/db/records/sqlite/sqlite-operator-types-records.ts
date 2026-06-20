import type { sqliteOperatorTypesTable } from '../../schemas/index.js'

export const sqliteOperatorTypesRecords: (typeof sqliteOperatorTypesTable.$inferInsert)[] =
  [
    {
      id: '019ee2c2-36d6-7259-bbf2-932459059eab',
      name: 'Operador de Excavadora de Obras',
      description:
        'Manipular la excavadora (oruga o llantas) para la apertura de zanjas profundas, movimiento de tierras masivo, demoliciones y carga de camiones volquetes. Su precisión es clave para excavar respetando las cotas y niveles dados por el equipo de topografía.',
    },
    {
      id: '019ee2c2-4901-7200-83fe-c6b0d8244338',
      name: 'Operador de Bulldozer / Tractor de Oruga',
      description:
        'Utilizar la hoja frontal para el empuje, nivelación y desbroce de terrenos difíciles en las fases iniciales de la obra (movimiento de tierras).',
    },
    {
      id: '019ee2c2-84d6-7da7-8000-b9f7291af900',
      name: 'Operador de Motoniveladora',
      description:
        'Es uno de los perfiles más técnicos de la línea amarilla. Se encarga del refino y la nivelación fina de capas de tierra, base o subbase (crucial en vías, plataformas industriales o cimentaciones), trabajando muy de la mano con los niveles de topografía.',
    },
    {
      id: '019ee2c3-119c-7c1a-9a35-8ae99e84d5eb',
      name: 'Operador de Retroexcavadora Pajarita',
      description:
        'Operar esta máquina versátil de llantas que combina un cucharón frontal (para cargar material) y un brazo excavador trasero (para zanjas menores). Es el "comodín" de logística en la obra.',
    },
    {
      id: '019ee2c3-24cb-7bf6-841b-e992ff6fcc44',
      name: 'Operador de Grúa Móvil / Grúa Torre',
      description:
        'Izar y posicionar con precisión milimétrica equipos pesados, vigas de acero o tolvas. Trabaja en perfecta sincronización con un Aparejador o Rigger (quien amarra la carga y le da señales de guía).',
    },
    {
      id: '019ee2c3-3651-70a3-bc09-fc068f88a797',
      name: 'Operador de Manipulador Telescopico / Montacargas de Terreno Excesivo',
      description:
        'Descargar, transportar y elevar palets de materiales, tuberías o herramientas desde las zonas de acopio hasta los frentes específicos de trabajo en terrenos irregulares.',
    },
    {
      id: '019ee2c3-4b7b-7ce7-9398-b95c450296c6',
      name: 'Operador de Planta de Concreto / Autoconcretera',
      description:
        'Controlar los equipos de bombeo de concreto a grandes alturas o distancias, o conducir y operar el camión mezclador garantizando que el concreto no pierda sus propiedades técnicas durante el trayecto y vaciado.',
    },
    {
      id: '019ee2c3-6014-75a7-9d04-9870a5ed781b',
      name: 'Operador de Vibrocompactador',
      description:
        'Operar los rodillos compactadores (lisos, pata de cabra o neumáticos) para alcanzar el porcentaje de compactación del suelo exigido por los diseños de geotecnia y control de calidad.',
    },
    {
      id: '019ee2c3-70fe-7760-888f-5dfde081989c',
      name: 'Operador de Pavimentadora',
      description:
        'Distribuir y esparcir de forma homogénea las capas de asfalto o concreto hidráulico en proyectos viales o pisos industriales.',
    },
    {
      id: '019ee2c3-8772-7c3d-9be9-bb38e6bf17bc',
      name: 'Operador de Minicargador',
      description:
        'Transportar materiales en espacios confinados o reducidos donde la maquinaria pesada no puede ingresar.',
    },
    {
      id: '019ee2c3-a11f-70d1-8877-3560917a4bd0',
      name: 'Operador de Equipos Menores de Perforación / Compactación Manual',
      description:
        'Manipular herramientas como compactadores tipo "saltarín" (apisonadores), cortadoras de concreto, vibroextendedores o motobombas de achique.',
    },
  ]
