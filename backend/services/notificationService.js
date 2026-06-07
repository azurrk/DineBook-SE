class NotificationService {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(eventName, listener) {
    const listeners = this.listeners.get(eventName) || [];
    listeners.push(listener);
    this.listeners.set(eventName, listeners);
  }

  async publish(eventName, payload) {
    const listeners = this.listeners.get(eventName) || [];
    await Promise.all(listeners.map((listener) => listener(payload)));
  }
}

const notificationService = new NotificationService();

const emailLogger = async ({ user, reservation }) => {
  if (!user?.email) return;
  console.log(`[email:${user.email}] ${reservation.status} reservation #${reservation.id}`);
};

notificationService.subscribe('reservation.created', emailLogger);
notificationService.subscribe('reservation.statusChanged', emailLogger);
notificationService.subscribe('reservation.cancelled', emailLogger);

module.exports = notificationService;
