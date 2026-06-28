const AIRTABLE_API_KEY = 'patGEP0AezR6alTgj.381aa15ed6ff221166038cd027c9dce4578eb4b7fb755b04d6f705a63892c819';
const AIRTABLE_BASE_ID = 'appth3V3JeEIqAeXq';
const AIRTABLE_TABLE   = 'ServiceJobs';

const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const method  = event.httpMethod;
  const params  = event.queryStringParameters || {};
  const recordId = params.recordId || '';

  // Build Airtable URL
  let url = BASE_URL;
  if (recordId) url += '/' + recordId;

  // Forward query params (pageSize, offset, etc.)
  const forwardParams = Object.entries(params)
    .filter(([k]) => k !== 'recordId')
    .map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  if (forwardParams) url += '?' + forwardParams;

  try {
    const atRes = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: ['POST','PATCH'].includes(method) ? event.body : undefined,
    });

    const data = await atRes.json();
    return {
      statusCode: atRes.status,
      headers,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
