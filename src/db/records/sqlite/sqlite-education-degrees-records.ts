import type { sqliteEducationDegreesTable } from '../../schemas/index.js'

export const sqliteEducationDegreesRecords: (typeof sqliteEducationDegreesTable.$inferInsert)[] =
  [
    {
      id: '019ee29d-ee24-75b2-a35a-beaae7265a4e',
      name: 'Postgrado y Alta Especialización',
      description:
        'Requerido principalmente para roles directivos, líderes de disciplina en diseño y especialistas técnicos complejos.',
    },
    {
      id: '019ee29e-05ba-767d-a462-4b5aad108daa',
      name: 'Profesional y Universitario',
      description:
        'El estándar obligatorio para toda la línea de ingeniería, tanto en la oficina técnica como en la gestión de campo.',
    },
    {
      id: '019ee29e-1afd-750f-a386-11874ba52d10',
      name: 'Tecnológico',
      description:
        'El puente perfecto entre el diseño conceptual y la realidad operativa. Tienen una fuerte base práctica respaldada por criterios técnicos sólidos.',
    },
    {
      id: '019ee29e-3964-72d6-b9de-73e8a83cc407',
      name: 'Técnico Profesional y Formación para el Trabajo',
      description:
        'Enfocado en la ejecución pura, la destreza manual técnica, la interpretación de planos y el cumplimiento estricto de procedimientos constructivos.',
    },
  ]
