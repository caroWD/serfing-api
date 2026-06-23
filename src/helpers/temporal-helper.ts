import { Temporal } from 'temporal-polyfill'

export const getTemporalNow = (): Temporal.PlainDate =>
  Temporal.Now.plainDateISO(Temporal.Now.timeZoneId())

export const getTemporalFrom = (from: string): Temporal.PlainDate =>
  Temporal.PlainDate.from(from)

export const compareTemporal = (
  compare: Temporal.PlainDate,
  reference: Temporal.PlainDate
): boolean =>
  Temporal.PlainDate.compare(compare, reference) > 0 ? false : true
