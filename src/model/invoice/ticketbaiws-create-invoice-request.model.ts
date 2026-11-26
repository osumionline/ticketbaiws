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

  /**
   * Customer town or city.
   *
   * Recommended for B2B electronic invoicing through SPFE.
   */
  readonly poblacion?: string;

  /**
   * Customer province.
   *
   * TicketBaiWS may infer it from the postal code for Spanish customers.
   */
  readonly provincia?: string;

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

  /**
   * Bizkaia LROE 140 code explaining why the IRPF income
   * differs from the VAT taxable base.
   *
   * Relevant to applicable operations from 2027.
   */
  readonly causa_ingreso_irpf?: string;

  /**
   * Income amount to be considered for IRPF purposes
   * when it differs from the VAT taxable base.
   */
  readonly importe_ingreso_irpf?: number;

  readonly zuzendu?: boolean;
  readonly sincrono?: boolean;

  readonly regimen_iva?: number;
  readonly causa_exencion?: TicketBaiWsExemptionCause;
  readonly inversion_sujeto_pasivo?: boolean;
  readonly emitida_terceros?: TicketBaiWsThirdPartyIssue;
  readonly modo_recargo_equivalencia?: boolean;
  readonly modo_regimen_simplificado?: boolean;
  readonly epigrafe?: string;
}
