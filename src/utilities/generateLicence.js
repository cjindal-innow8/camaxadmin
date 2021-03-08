export const generateLicenceKey = (usename)=>{
  const randomString = Math.random().toString(36).slice('2') + Math.random().toString(36).slice('2')
  // console.log("randomString=",randomString)
  const rawKey = randomString.slice(0,16)
  const key = rawKey.match(/.{1,4}/g)
  const licenseKey = key.join('-').toUpperCase()
  return licenseKey 
  }