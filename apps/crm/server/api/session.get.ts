export default defineEventHandler(async (event) => {
  if (getServiceStatus().mode === 'demo') return { user: null }
  const session = await getAuth().api.getSession({ headers: toWebRequest(event).headers })
  return {
    user: session?.user
      ? { id: session.user.id, name: session.user.name, email: session.user.email }
      : null,
  }
})
