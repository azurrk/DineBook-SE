class CustomerStatusStrategy {
  canTransition(from, to) {
    return ['pending', 'confirmed'].includes(from) && to === 'cancelled';
  }

  errorMessage() {
    return 'Customers may only cancel pending or confirmed reservations';
  }
}

class AdminStatusStrategy {
  canTransition(from, to) {
    const allowed = {
      pending: ['confirmed', 'rejected', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      completed: [],
      cancelled: [],
      rejected: [],
    };
    return (allowed[from] || []).includes(to);
  }

  errorMessage() {
    return 'Invalid admin reservation status transition';
  }
}

module.exports = {
  CustomerStatusStrategy,
  AdminStatusStrategy,
};
