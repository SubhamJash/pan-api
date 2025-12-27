export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: true, 
      message: 'Only GET method is allowed' 
    });
  }
  
  // Get PAN from query parameters
  const { pan } = req.query;
  
  // Check if PAN is provided
  if (!pan) {
    return res.status(400).json({
      error: true,
      message: "PAN is required. Use ?pan=ABCDE1234F"
    });
  }
  
  // Validate PAN format (optional but recommended)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(pan.toUpperCase())) {
    return res.status(400).json({
      error: true,
      message: "Invalid PAN format. Format should be: ABCDE1234F (5 letters, 4 digits, 1 letter)"
    });
  }
  
  try {
    // TurtleFin API URL
    const turtleUrl = `https://app.turtlefin.com/api/minterprise/v1/products/personal-loan/leads/existing-lead-by-pan?pan=${pan}`;
    
    // Headers from your original code
    const headers = {
      "authorization": "69e82d4f667f7e7939b7c5c5fa0c6063f6e5da0b5cf9559758feeb416a2f526c35961a754dc8ba81a2a99e6a07f9e28a",
      "x-broker": "turtlemint",
      "x-provider": "signzy",
      "x-partner-id": "68f61e4e310f4219c3aa846d",
      "x-tenant": "turtlemint",
      "user-agent": "Mozilla/5.0 (Android)",
      "accept": "application/json"
    };
    
    // Fetch data from TurtleFin API
    const response = await fetch(turtleUrl, { headers });
    const data = await response.json();
    
    // Format the response
    const result = {
      firstName: data.data?.firstName || null,
      lastName: data.data?.lastName || null,
      dob: data.data?.dob || null,
      panStatus: data.data?.panStatus || null,
      fullName: data.data?.customerName || 
               `${data.data?.firstName || ''} ${data.data?.lastName || ''}`.trim(),
      success: true,
      timestamp: new Date().toISOString()
    };
    
    // Return success response
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error:', error);
    
    // Return error response
    return res.status(500).json({
      success: false,
      error: true,
      message: "Internal Server Error",
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
