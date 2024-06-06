// function to generate randomIP
export const generateRandomIP = () => {

    const ip =
    // using floor function from math to generate a random number 
      Math.floor(Math.random() * 255) +
      1 +
      "." +
      Math.floor(Math.random() * 255) +
      "." +
      Math.floor(Math.random() * 255) +
      "." +
      Math.floor(Math.random() * 255);
  
  // return ip address.
    return ip;
  };