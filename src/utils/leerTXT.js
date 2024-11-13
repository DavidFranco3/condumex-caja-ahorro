// Funcion que lee los datos del archivo TXT y los entrega en formato JSON
export function convierteTXTaJSON(txt) {
  const cells = txt.split('\n').map(function (el) {
    return el.split(/\s+/)
  })

  const headings = cells.shift()

  const obj = cells.map(function (el) {
    const obj = {}
    for (let i = 0, l = el.length; i < l; i++) {
      obj[headings[i]] = isNaN(Number(el[i])) ? el[i] : +el[i]
    }
    return obj
  })

  return JSON.stringify(obj)
}
