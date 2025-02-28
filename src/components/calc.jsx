// Add this function to calculate Euclidean distance between colors
const calculateColorDistance = (color1, color2) => {
    // Extract RGB components from strings like "rgb(r, g, b)"
    const extractRGB = (color) => {
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        return {
          r: parseInt(match[1], 10),
          g: parseInt(match[2], 10),
          b: parseInt(match[3], 10)
        };
      }
      return { r: 0, g: 0, b: 0 }; // Default if parsing fails
    };
  
    const rgb1 = extractRGB(color1);
    const rgb2 = extractRGB(color2);
  
    // Calculate Euclidean distance in RGB space
    return Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
  };
  
  // Modified function to generate random colors with minimum distance
  const generateRandomColor = (previousColor = null) => {
    const minDistance = 120;
    let attempts = 0;
    const maxAttempts = 50;

    // Colors to check distance against
    // const blackColor = "rgb(0, 0, 0)";
    const whiteColor = "rgb(255, 255, 255)";
    let newColor = "rgb(255, 255, 255)";
    while (attempts < maxAttempts) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      const newColor = `rgb(${r}, ${g}, ${b})`;

      // Check distance from all required colors
      // const distFromBlack = calculateColorDistance(newColor, blackColor);
      const distFromWhite = calculateColorDistance(newColor, whiteColor);
      const distFromPrevious = previousColor ? calculateColorDistance(newColor, previousColor) : Infinity;
      
      // Only accept if all distances are sufficient
      if (//distFromBlack >= minDistance && 
          distFromWhite >= minDistance && 
          distFromPrevious >= minDistance) {
        return newColor;
      }

      // If no previous color or distance is sufficient, return this color
      if (!previousColor || calculateColorDistance(newColor, previousColor) >= minDistance) {
        console.log("Returning color with sufficient distance from previous:", newColor);
        return newColor;
      }
        
      attempts++;
   }
    console.log("Returning color with all distance checks passed:", newColor);
    // If we couldn't find a color with enough distance after many attempts,
    // just return a completely different color
    return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`;
  };

  export default generateRandomColor;