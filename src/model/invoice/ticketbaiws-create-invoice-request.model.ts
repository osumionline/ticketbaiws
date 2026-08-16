import type {
  TicketBaiWsInvoiceLine,
  TicketBaiWsRectifiedInvoice,
} from './ticketbaiws-invoice.model.js';
import type {
  TicketBaiWsDocumentType,
  TicketBaiWsExemptionCause,
  TicketBaiWsOperationType,
  TicketBaiWsRectificationKey,
  TicketBaiWsRectificationType,
  TicketBaiWsThirdPartyIssue,
} from './ticketbaiws-invoice.types.js';

export default interface TicketBaiWsCreateInvoiceRequest {
  readonly fecha: string;
  readonly hora: string;
  readonly fecha_operacion?: string;

  readonly nif?: string;
  readonly tipo_documento?: TicketBaiWsDocumentType;
  readonly simplificada: boolean;
  readonly pais_cliente?: string;
  readonly nombre?: string;
  readonly direccion?: string;
  readonly cp?: string;

  readonly serie: string;
  readonly numero: string;

  readonly rectificativa: boolean;
  readonly clave_rectificativa?: TicketBaiWsRectificationKey;
  readonly tipo_rectificativa?: TicketBaiWsRectificationType;
  readonly rectificadas?: readonly TicketBaiWsRectifiedInvoice[];

  readonly tipo_operacion?: TicketBaiWsOperationType;
  readonly intracomunitaria?: boolean;
  readonly exportacion?: boolean;

  readonly retencion: number;
  readonly lineas: readonly TicketBaiWsInvoiceLine[];
  readonly total_factura: number;

  readonly zuzendu?: boolean;

  readonly regimen_iva?: number;
  readonly causa_exencion?: TicketBaiWsExemptionCause;
  readonly inversion_sujeto_pasivo?: boolean;
  readonly emitida_terceros?: TicketBaiWsThirdPartyIssue;
  readonly modo_recargo_equivalencia?: boolean;
  readonly modo_regimen_simplificado?: boolean;
  readonly epigrafe?: string;
}
