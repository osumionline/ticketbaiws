import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

type TicketBaiWsLroeReceivedInvoiceType = 'compras' | 'inversion' | 'gasto';

type TicketBaiWsLroeReceivedInvoiceDocumentType =
  | '02'
  | '03'
  | '04'
  | '05'
  | '06';

type TicketBaiWsLroeReceivedInvoiceRectificationKey =
  | 'R1'
  | 'R2'
  | 'R3'
  | 'R4'
  | 'R5';

type TicketBaiWsLroeReceivedInvoiceRectificationType = 'S' | 'I';

type TicketBaiWsLroeReceivedInvoiceKey =
  | 'F1'
  | 'F2'
  | 'F3'
  | 'F4'
  | 'F5'
  | 'F6'
  | 'LC';

type TicketBaiWsLroeReceivedInvoiceIrpfVatAssetType = 'I' | 'R' | 'N';

type TicketBaiWsLroeReceivedInvoiceSimplifiedSurchargeMode = 'E' | 'N' | 'S';

interface TicketBaiWsLroeReceivedInvoiceBase {
  readonly base_imponible: number;
  readonly tipo_iva: number;
  readonly tipo_req: number;
  readonly tipo?: TicketBaiWsLroeReceivedInvoiceType;
  readonly cuota_soportada?: number;
  readonly cuota_deducible?: number;
  readonly epigrafe?: string;
  readonly bien_afecto_irpf_iva?: TicketBaiWsLroeReceivedInvoiceIrpfVatAssetType;
  readonly importe_gasto_irpf?: number;
  readonly concepto_contable?: number;
  readonly referencia_bien?: string;
  readonly modo_recargo_simplificado?: TicketBaiWsLroeReceivedInvoiceSimplifiedSurchargeMode;
}

interface TicketBaiWsLroeReceivedInvoice {
  readonly fecha: string;
  readonly fecha_operacion?: string;
  readonly fecha_recepcion?: string;
  readonly nif: string;
  readonly tipo_documento?: TicketBaiWsLroeReceivedInvoiceDocumentType;
  readonly pais?: string;
  readonly nombre_social: string;
  readonly serie?: string;
  readonly num_factura: string;
  readonly descripcion: string;
  readonly importacion: boolean;
  readonly tipo_factura: TicketBaiWsLroeReceivedInvoiceType;
  readonly importe_total: number;
  readonly bases: readonly TicketBaiWsLroeReceivedInvoiceBase[];
  readonly regimen_iva?: number;
  readonly regimen_iva_2?: number;
  readonly regimen_iva_3?: number;
  readonly inversion_sujeto_pasivo?: boolean;
  readonly rectificativa: boolean;
  readonly serie_factura_rectificada?: string;
  readonly num_factura_rectificada?: string;
  readonly fecha_rectificada?: string;
  readonly clave_rectificativa?: TicketBaiWsLroeReceivedInvoiceRectificationKey;
  readonly tipo_rectificativa?: TicketBaiWsLroeReceivedInvoiceRectificationType;
  readonly base_rectificada?: number;
  readonly cuota_rectificada?: number;
  readonly prorrata?: number;
  readonly clave_factura?: TicketBaiWsLroeReceivedInvoiceKey;
}

interface TicketBaiWsCreateLroeReceivedInvoicesRequest {
  readonly ejercicio: number;
  readonly facturas: readonly TicketBaiWsLroeReceivedInvoice[];
}

interface TicketBaiWsLroeReceivedInvoiceUpdateBase {
  readonly base_imponible: number;
  readonly tipo_iva: number;
  readonly tipo_req: number;
  readonly epigrafe?: string;
}

interface TicketBaiWsLroeReceivedInvoiceUpdate {
  readonly fecha: string;
  readonly fecha_operacion?: string;
  readonly fecha_recepcion?: string;
  readonly nif: string;
  readonly pais?: string;
  readonly nombre_social: string;
  readonly num_factura: string;
  readonly descripcion: string;
  readonly importacion: boolean;
  readonly tipo_factura: TicketBaiWsLroeReceivedInvoiceType;
  readonly importe_total: number;
  readonly bases: readonly TicketBaiWsLroeReceivedInvoiceUpdateBase[];
  readonly regimen_iva?: number;
  readonly regimen_iva_2?: number;
  readonly regimen_iva_3?: number;
  readonly inversion_sujeto_pasivo?: boolean;
  readonly rectificativa: boolean;
  readonly num_factura_rectificada?: string;
  readonly fecha_rectificada?: string;
  readonly clave_rectificativa?: TicketBaiWsLroeReceivedInvoiceRectificationKey;
  readonly tipo_rectificativa?: TicketBaiWsLroeReceivedInvoiceRectificationType;
  readonly base_rectificada?: number;
  readonly cuota_rectificada?: number;
  readonly prorrata?: number;
}

interface TicketBaiWsUpdateLroeReceivedInvoicesRequest {
  readonly ejercicio: number;
  readonly facturas: readonly TicketBaiWsLroeReceivedInvoiceUpdate[];
}

type TicketBaiWsLroeReceivedInvoiceResultStatus =
  | 'Correcto'
  | 'AceptadoConErrores'
  | 'Incorrecto';

type TicketBaiWsLroeReceivedInvoicesBatchStatus = 'OK' | 'ERROR';

interface TicketBaiWsLroeReceivedInvoiceOperationResult {
  readonly fecha: string;
  readonly num_factura: string;
  readonly estado: TicketBaiWsLroeReceivedInvoiceResultStatus;
  readonly nif: string;
  readonly codigo_error?: string;
  readonly descripcion_error?: string;
}

interface TicketBaiWsLroeReceivedInvoicesMutationResult {
  readonly response: readonly TicketBaiWsLroeReceivedInvoiceOperationResult[];
  readonly status: TicketBaiWsLroeReceivedInvoicesBatchStatus;
}

type TicketBaiWsLroeReceivedInvoicesMutationResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsLroeReceivedInvoicesMutationResult>;

export type {
  TicketBaiWsCreateLroeReceivedInvoicesRequest,
  TicketBaiWsLroeReceivedInvoice,
  TicketBaiWsLroeReceivedInvoiceBase,
  TicketBaiWsLroeReceivedInvoiceDocumentType,
  TicketBaiWsLroeReceivedInvoiceIrpfVatAssetType,
  TicketBaiWsLroeReceivedInvoiceKey,
  TicketBaiWsLroeReceivedInvoiceOperationResult,
  TicketBaiWsLroeReceivedInvoiceRectificationKey,
  TicketBaiWsLroeReceivedInvoiceRectificationType,
  TicketBaiWsLroeReceivedInvoiceResultStatus,
  TicketBaiWsLroeReceivedInvoicesBatchStatus,
  TicketBaiWsLroeReceivedInvoiceSimplifiedSurchargeMode,
  TicketBaiWsLroeReceivedInvoicesMutationResponse,
  TicketBaiWsLroeReceivedInvoicesMutationResult,
  TicketBaiWsLroeReceivedInvoiceType,
  TicketBaiWsLroeReceivedInvoiceUpdate,
  TicketBaiWsLroeReceivedInvoiceUpdateBase,
  TicketBaiWsUpdateLroeReceivedInvoicesRequest,
};
