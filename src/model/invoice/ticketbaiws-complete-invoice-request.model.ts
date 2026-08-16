interface TicketBaiWsSimplifiedInvoiceReference {
  readonly serie: string;
  readonly numero: string;
  readonly fecha: string;
}

export default interface TicketBaiWsCompleteInvoiceRequest {
  readonly fecha: string;
  readonly hora: string;

  readonly nif: string;
  readonly pais_cliente?: string;
  readonly nombre: string;
  readonly direccion: string;
  readonly cp: string;

  readonly serie: string;
  readonly numero: string;

  readonly simplificadas: readonly TicketBaiWsSimplifiedInvoiceReference[];

  readonly intracomunitaria?: boolean;
  readonly exportacion?: boolean;
}

export type { TicketBaiWsSimplifiedInvoiceReference };
