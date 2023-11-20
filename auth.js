const apiKey = '7T#p2Km$8q!Lz&9Wc@yE5sF'; // Replace with your secret key

function authenticateApiKey(req, res, next) {
    const providedApiKey = req.headers['api_key'];
  
    if (providedApiKey === apiKey) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized. Invalid API key.' });
    }
  }

module.exports = authenticateApiKey;

