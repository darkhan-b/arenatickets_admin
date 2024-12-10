import moment from 'moment'

const copyObject = (object: any) => {
  return JSON.parse(JSON.stringify(object))
}

const formatNumber = (string: string) => {
  return Number(string).toLocaleString('ru-RU')
}

const formatCurrency = (string: string) => {
  return `${formatNumber(string)} ₸`
}

const formatDate = (string: string) => {
  if (!string) return '-'
  return moment(string).format('DD.MM.YYYY')
}

const formatDateTime = (string: string) => {
  if (!string) return '-'
  return moment(string).format('DD.MM.YYYY, HH:mm')
}

const removeNullsFromObject = (obj: any) => {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
}

const openExcelData = (excelData: any) => {
  const blob = new Blob([excelData], { type: 'application/vnd.ms-excel' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.download = `report_${new Date().getTime()}.xlsx`
  link.click()
}

export {
  copyObject,
  formatNumber,
  formatDate,
  formatDateTime,
  formatCurrency,
  removeNullsFromObject,
  openExcelData
}
