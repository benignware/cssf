export const parseValues = (str) => {
  const results = [];
  
  // Regex to match numeric values with optional units
  const regex = /(?:^|\s|\b)([\d.]+(?:e[-+]?\d+)?)([a-zA-Z%]*)/g;
  let match;
  
  while ((match = regex.exec(str)) !== null) {
    // Ensure valid capture of numeric values and optional units
    const value = parseFloat(match[1]);
    const unit = match[2] || '';
    
    // Add only if we have a numeric value (ignore empty matches)
    if (!isNaN(value)) {
      results.push({ value, unit });
    }
  }
  
  return results;
};

