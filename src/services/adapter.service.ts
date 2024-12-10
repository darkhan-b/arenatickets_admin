const eloquentNormalize = (obj: any, fields: any) => {
  const formData = new FormData()
  for (const prop in obj) {
    if (propsToIgnore.includes(prop)) continue
    let val = obj[prop]
    const type = fields[prop]?.type
    if (
      type === 'select' &&
      fields[prop]?.select_data?.type === 'model' &&
      val &&
      Array.isArray(val)
    ) {
      val = val.map((item: any) => (typeof item === 'object' ? item.id : item))
    }
    if (type === 'file') {
      if (typeof val !== 'string' && !(val instanceof String)) {
        // in case we get urls from list, we just ignore them
        val.forEach((v: any, i: number) => {
          if (v.file) formData.append(prop + '[' + i + ']', v.file)
        })
      }
    } else {
      if (typeof val === 'object' && val !== null) {
        appendObject(val, prop, formData)
      } else {
        val = castVal(val)
        if (val !== null) formData.append(prop, val)
      }
    }
  }
  if (obj.id) formData.append('_method', 'put')
  return formData
}

const propsToIgnore = ['primary_media_id', 'primary_media_ext']

const castVal = (val: any) => {
  if (val === true) val = 1
  if (val === false) val = 0
  if (val === 'null') val = null
  return val
}

const appendObject = (obj: any, currentKey: string, formData: any) => {
  Object.keys(obj).forEach((key) => {
    const v = castVal(obj[key])
    const k = `${currentKey}[${key}]`
    if (typeof v === 'object' && v !== null) {
      appendObject(v, k, formData)
    } else {
      formData.append(k, v)
    }
  })
}

export { eloquentNormalize }
