export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get backend URL from environment variable
    const backendBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:8082';
    
    // Extract the path from the URL
    const url = new URL(req.url, `https://${req.headers.host}`);
    // Remove leading /api from the pathname
    const apiPath = url.pathname.replace(/^\/api\//, '');
    
    // Construct backend URL with query parameters
    const backendUrl = `${backendBaseUrl}/api/${apiPath}${url.search}`;
    
    console.log('Proxying request:', req.method, backendUrl);
    
    // Prepare fetch options
    const fetchOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization })
      }
    };

    // Add body for non-GET/HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(backendUrl, fetchOptions);

    // Handle different content types
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      console.log('Response status:', response.status);
      res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ success: false, message: 'Proxy error: ' + error.message });
  }
}
