export const handleApiError = (error) => {
  if (error.message.includes('Failed to fetch')) {
    return 'Unable to connect to server. Please check your internet connection.';
  }
  
  if (error.message.includes('Email already registered')) {
    return 'This email is already registered. Please use a different email.';
  }
  
  if (error.message.includes('Invalid email or password')) {
    return 'Invalid email or password. Please try again.';
  }
  
  if (error.message.includes('Access token required')) {
    return 'Please log in to continue.';
  }
  
  if (error.message.includes('Invalid token')) {
    return 'Your session has expired. Please log in again.';
  }
  
  if (error.message.includes('Cannot cancel within 2 hours')) {
    return 'Reservations cannot be cancelled within 2 hours of the booking time.';
  }
  
  if (error.message.includes('Table not found')) {
    return 'Selected table is no longer available.';
  }
  
  if (error.message.includes('Reservation not found')) {
    return 'Reservation not found.';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};

export const showErrorMessage = (error) => {
  const message = handleApiError(error);
  console.error('API Error:', error);
  alert(message);
};
