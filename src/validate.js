function validateInput(text) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new Error('Invalid input: text must be a non-empty string');
  }
}

module.exports = { validateInput };