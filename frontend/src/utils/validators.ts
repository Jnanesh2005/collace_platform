export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCollegeEmail = (email: string): boolean => {
  // Basic college email validation - can be enhanced with specific domain checks
  const collegeDomains = ['.edu', '.ac.', 'university', 'college'];
  return collegeDomains.some(domain => 
    email.toLowerCase().includes(domain)
  ) || validateEmail(email); // Fallback to basic email validation
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return errors;
};