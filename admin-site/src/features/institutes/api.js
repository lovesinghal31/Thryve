export const createInstitute = async (payload) => {
  return { _id: `inst-${Date.now()}`, ...payload }
}
