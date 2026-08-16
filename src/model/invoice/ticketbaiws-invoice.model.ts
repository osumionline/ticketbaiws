interface TicketBaiWsInvoiceLine {
  readonly descripcion?: string;
  readonly cantidad: number;
  readonly importe_unitario: number;
  readonly tipo_iva: number;
  readonly tipo_req: number;
  readonly descuento?: number;
  readonly regimen_general?: boolean;
  readonly epigrafe?: number;
}

interface TicketBaiWsRectifiedInvoice {
  readonly serie: string;
  readonly numero: string;
  readonly fecha: string;
  readonly base?: number;
  readonly cuota?: number;
  readonly recargo?: number;
}

export type { TicketBaiWsInvoiceLine, TicketBaiWsRectifiedInvoice };
