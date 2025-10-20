const i18nObj = {
  'Input coordinate outside area of use of either source or destination CRS': (source, dest) =>
    `Input Koordinater udenfor gyldighedsområde af CRS: ${source}, ${dest}`,
  'Kort: Input coordinate outside area of use of either source or destination CRS': (source, dest) => {
    `Input Koordinater udenfor gyldighedsområde af Kortviserens CRS: ${source}, ${dest}`
  }
}

export const i18n = (key, source, dest) => {
  const translation = i18nObj[key]
  if (typeof translation === 'function') {
    return translation(source, dest)
  }
  return translation || 'Ugyldige Input Koordinater' // fallback to key if translation not found
}