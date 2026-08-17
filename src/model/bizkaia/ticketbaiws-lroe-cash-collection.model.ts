import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

type TicketBaiWsLroeCashCollectionOperationType = 'con_factura' | 'sin_factura';

type TicketBaiWsLroeCashCollectionIncomeType = '1' | '2' | '3' | '4';

type TicketBaiWsLroeCashCollectionPaymentMethod =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05';

type TicketBaiWsLroeCashCollectionResultStatus =
  | 'Correcto'
  | 'AceptadoConErrores'
  | 'Incorrecto';

type TicketBaiWsLroeCashCollectionsBatchStatus = 'OK' | 'ERROR';

interface TicketBaiWsLroeCashCollectionBase {
  readonly epigrafe?: string;
  readonly fecha_cobro: string;
  readonly importe_cobrado: number;
  readonly iva_devengado?: number;
  readonly ingreso_irpf?: number;
  readonly forma_pago?: TicketBaiWsLroeCashCollectionPaymentMethod;
  readonly descripcion_fpago?: string;
}

interface TicketBaiWsLroeCashCollectionWithInvoice extends TicketBaiWsLroeCashCollectionBase {
  readonly tipo_operacion?: 'con_factura';
  readonly serie?: string;
  readonly num_factura: string;
  readonly fecha_factura: string;
}

interface TicketBaiWsLroeCashCollectionWithoutInvoice extends TicketBaiWsLroeCashCollectionBase {
  readonly tipo_operacion: 'sin_factura';
  readonly tipo_ingreso: TicketBaiWsLroeCashCollectionIncomeType;
  readonly linea: number;
}

type TicketBaiWsLroeCashCollection =
  | TicketBaiWsLroeCashCollectionWithInvoice
  | TicketBaiWsLroeCashCollectionWithoutInvoice;

interface TicketBaiWsMutateLroeCashCollectionsRequest {
  readonly ejercicio: number;
  readonly cobros: readonly TicketBaiWsLroeCashCollection[];
}

interface TicketBaiWsLroeCashCollectionOperationResult {
  readonly fecha_factura?: string;
  readonly fecha_cobro: string;
  readonly serie?: string;
  readonly num_factura?: string;
  readonly linea?: number;
  readonly estado: TicketBaiWsLroeCashCollectionResultStatus;
  readonly [key: string]: unknown;
}

interface TicketBaiWsLroeCashCollectionsMutationResult {
  readonly response: readonly TicketBaiWsLroeCashCollectionOperationResult[];
  readonly status: TicketBaiWsLroeCashCollectionsBatchStatus;
}

type TicketBaiWsLroeCashCollectionsMutationResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsLroeCashCollectionsMutationResult>;

interface TicketBaiWsListLroeCashCollectionsRequest {
  readonly ejercicio: number;
  readonly fecha_factura_desde?: string;
  readonly fecha_factura_hasta?: string;
  readonly fecha_operacion_desde?: string;
  readonly fecha_operacion_hasta?: string;
  readonly fecha_cobro_desde?: string;
  readonly fecha_cobro_hasta?: string;
  readonly tipo_ingreso?: TicketBaiWsLroeCashCollectionIncomeType;
  readonly num_factura?: string;
  readonly epigrafe?: string;
  readonly estado?: TicketBaiWsLroeCashCollectionResultStatus;
  readonly pagina?: number;
}

interface TicketBaiWsLroeCashCollectionQueryItem {
  readonly fecha_factura?: string;
  readonly fecha_cobro: string;
  readonly serie?: string;
  readonly num_factura?: string;
  readonly importe_cobrado: string;
  readonly iva_devengado?: string;
  readonly forma_pago?: TicketBaiWsLroeCashCollectionPaymentMethod;
  readonly descripcion_fpago?: string;
  readonly tipo_operacion?: TicketBaiWsLroeCashCollectionOperationType;
  readonly tipo_ingreso?: TicketBaiWsLroeCashCollectionIncomeType;
  readonly linea?: number;
  readonly ingreso_irpf?: string;
  readonly epigrafe?: string;
  readonly estado: TicketBaiWsLroeCashCollectionResultStatus;
  readonly [key: string]: unknown;
}

interface TicketBaiWsListLroeCashCollectionsResult {
  readonly response: readonly TicketBaiWsLroeCashCollectionQueryItem[];
}

type TicketBaiWsListLroeCashCollectionsResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsListLroeCashCollectionsResult>;

interface TicketBaiWsCancelLroeCashCollectionBase {
  readonly epigrafe?: string;
  readonly fecha_cobro: string;
  readonly importe_cobrado?: number;
}

interface TicketBaiWsCancelLroeCashCollectionWithInvoice extends TicketBaiWsCancelLroeCashCollectionBase {
  readonly tipo_operacion?: 'con_factura';
  readonly serie?: string;
  readonly num_factura: string;
  readonly fecha_factura: string;
}

interface TicketBaiWsCancelLroeCashCollectionWithoutInvoice extends TicketBaiWsCancelLroeCashCollectionBase {
  readonly tipo_operacion: 'sin_factura';
  readonly tipo_ingreso: TicketBaiWsLroeCashCollectionIncomeType;
  readonly linea: number;
}

type TicketBaiWsCancelLroeCashCollection =
  | TicketBaiWsCancelLroeCashCollectionWithInvoice
  | TicketBaiWsCancelLroeCashCollectionWithoutInvoice;

interface TicketBaiWsCancelLroeCashCollectionsRequest {
  readonly ejercicio: number;
  readonly cobros: readonly TicketBaiWsCancelLroeCashCollection[];
}

export type {
  TicketBaiWsCancelLroeCashCollection,
  TicketBaiWsCancelLroeCashCollectionsRequest,
  TicketBaiWsCancelLroeCashCollectionWithInvoice,
  TicketBaiWsCancelLroeCashCollectionWithoutInvoice,
  TicketBaiWsListLroeCashCollectionsRequest,
  TicketBaiWsListLroeCashCollectionsResponse,
  TicketBaiWsListLroeCashCollectionsResult,
  TicketBaiWsLroeCashCollection,
  TicketBaiWsLroeCashCollectionBase,
  TicketBaiWsLroeCashCollectionIncomeType,
  TicketBaiWsLroeCashCollectionOperationResult,
  TicketBaiWsLroeCashCollectionOperationType,
  TicketBaiWsLroeCashCollectionPaymentMethod,
  TicketBaiWsLroeCashCollectionQueryItem,
  TicketBaiWsLroeCashCollectionResultStatus,
  TicketBaiWsLroeCashCollectionsBatchStatus,
  TicketBaiWsLroeCashCollectionsMutationResponse,
  TicketBaiWsLroeCashCollectionsMutationResult,
  TicketBaiWsLroeCashCollectionWithInvoice,
  TicketBaiWsLroeCashCollectionWithoutInvoice,
  TicketBaiWsMutateLroeCashCollectionsRequest,
};
