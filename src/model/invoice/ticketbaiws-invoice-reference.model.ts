interface TicketBaiWsInvoiceReference {
  readonly serie: string;
  readonly numero: string;
}

interface TicketBaiWsCancelInvoiceRequest extends TicketBaiWsInvoiceReference {
  readonly fecha?: string;
}

export type { TicketBaiWsCancelInvoiceRequest, TicketBaiWsInvoiceReference };
