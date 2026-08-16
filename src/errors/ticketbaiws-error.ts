class TicketBaiWsError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);

    this.name = new.target.name;
  }
}

export default TicketBaiWsError;
