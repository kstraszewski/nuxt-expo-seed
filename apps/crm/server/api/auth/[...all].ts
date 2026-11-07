export default defineEventHandler((event) => getAuth().handler(toWebRequest(event)))
