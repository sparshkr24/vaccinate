import jwt from 'jsonwebtoken';

export default function auth(handler) {
  return async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.token;

    try {
      // Verify the token
      const decodedToken = jwt.verify(token, 'sparsh');

      // Access the decoded token payload
      const userId = decodedToken.userId;

      req.userId = userId;

      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}
