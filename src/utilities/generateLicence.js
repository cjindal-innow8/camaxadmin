export const generateLicenceKey = (usename)=>{
  const randomString = Math.random().toString(36).slice('2')
  const rawKey = usename.slice(0,5)+randomString
  const key = rawKey.match(/.{1,4}/g)
  const licenseKey = key.join('-').toUpperCase()
  return licenseKey 
  }