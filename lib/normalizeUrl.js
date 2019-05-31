const normalizeUrl = rawLink => {
  if (typeof rawLink !== 'string') return null
  if (rawLink.indexOf('://') !== -1 || rawLink.length === 0) {
    return rawLink
  }
  return `http://${rawLink}`
}

module.exports = normalizeUrl
