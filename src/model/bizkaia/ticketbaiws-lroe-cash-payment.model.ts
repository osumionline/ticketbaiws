import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

type TicketBaiWsLroeCashPaymentOperationType = 'con_factura' | 'sin_factura';

type TicketBaiWsLroeCashPaymentConcept =
  | '600'
  | '601'
  | '602'
  | '606'
  | '607'
  | '608'
  | '609'
  | '620'
  | '621'
  | '622'
  | '623'
  | '624'
  | '625'
  | '626'
  | '627'
  | '628'
  | '629'
  | '631'
  | '634'
  | '639'
  | '640'
  | '641'
  | '64201'
  | '64202'
  | '643'
  | '644'
  | '649'
  | '65'
  | '66'
  | '67'
  | '680'
  | '681'
  | '682'
  | '69';

type TicketBaiWsLroeCashPaymentMethod = '01' | '02' | '03' | '04' | '05';

type TicketBaiWsLroeCashPaymentResultStatus =
  | 'Correcto'
  | 'AceptadoConErrores'
  | 'Incorrecto';

type TicketBaiWsLroeCashPaymentsBatchStatus = 'OK' | 'ERROR';

interface TicketBaiWsLroeCashPaymentBase {
  readonly epigrafe?: string;
  readonly fecha_pago: string;
  readonly nif: string;
  readonly pais?: string;
  readonly nombre_social: string;
  readonly importe_pagado: number;
  readonly iva_soportado?: number;
  readonly iva_deducible?: number;
  readonly gasto_irpf?: number;
  readonly forma_pago?: TicketBaiWsLroeCashPaymentMethod;
  readonly descripcion_fpago?: string;
}

interface TicketBaiWsLroeCashPaymentWithInvoice extends TicketBaiWsLroeCashPaymentBase {
  readonly tipo_operacion?: 'con_factura';
  readonly serie?: string;
  readonly num_factura: string;
  readonly fecha_factura: string;
}

interface TicketBaiWsLroeCashPaymentWithoutInvoice extends TicketBaiWsLroeCashPaymentBase {
  readonly tipo_operacion: 'sin_factura';
  readonly concepto: TicketBaiWsLroeCashPaymentConcept;
  readonly linea: number;
}

type TicketBaiWsLroeCashPayment =
  | TicketBaiWsLroeCashPaymentWithInvoice
  | TicketBaiWsLroeCashPaymentWithoutInvoice;

interface TicketBaiWsMutateLroeCashPaymentsRequest {
  readonly ejercicio: number;
  readonly pagos: readonly TicketBaiWsLroeCashPayment[];
}

interface TicketBaiWsLroeCashPaymentOperationResult {
  readonly fecha_factura?: string;
  readonly fecha_pago: string;
  readonly serie?: string;
  readonly num_factura?: string;
  readonly linea?: number;
  readonly estado: TicketBaiWsLroeCashPaymentResultStatus;
  readonly [key: string]: unknown;
}

interface TicketBaiWsLroeCashPaymentsMutationResult {
  readonly response: readonly TicketBaiWsLroeCashPaymentOperationResult[];
  readonly status: TicketBaiWsLroeCashPaymentsBatchStatus;
}

type TicketBaiWsLroeCashPaymentsMutationResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsLroeCashPaymentsMutationResult>;

interface TicketBaiWsListLroeCashPaymentsRequest {
  readonly ejercicio: number;
  readonly fecha_factura_desde?: string;
  readonly fecha_factura_hasta?: string;
  readonly fecha_operacion_desde?: string;
  readonly fecha_operacion_hasta?: string;
  readonly fecha_pago_desde?: string;
  readonly fecha_pago_hasta?: string;
  readonly concepto?: TicketBaiWsLroeCashPaymentConcept;
  readonly num_factura?: string;
  readonly epigrafe?: string;
  readonly estado?: TicketBaiWsLroeCashPaymentResultStatus;
  readonly pagina?: number;
}

interface TicketBaiWsLroeCashPaymentQueryItem {
  readonly fecha_factura?: string;
  readonly fecha_pago: string;
  readonly serie?: string;
  readonly num_factura?: string;
  readonly importe_pagado: string;
  readonly iva_soportado?: string;
  readonly iva_deducible?: string;
  readonly gasto_irpf?: string;
  readonly forma_pago?: TicketBaiWsLroeCashPaymentMethod;
  readonly descripcion_fpago?: string;
  readonly tipo_operacion?: TicketBaiWsLroeCashPaymentOperationType;
  readonly concepto?: TicketBaiWsLroeCashPaymentConcept;
  readonly linea?: number;
  readonly epigrafe?: string;
  readonly estado: TicketBaiWsLroeCashPaymentResultStatus;
  readonly [key: string]: unknown;
}

interface TicketBaiWsListLroeCashPaymentsResult {
  readonly response: readonly TicketBaiWsLroeCashPaymentQueryItem[];
}

type TicketBaiWsListLroeCashPaymentsResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsListLroeCashPaymentsResult>;

interface TicketBaiWsCancelLroeCashPaymentBase {
  readonly epigrafe?: string;
  readonly fecha_pago: string;
  readonly nif: string;
  readonly pais?: string;
  readonly nombre_social: string;
  readonly importe_pagado?: number;
}

interface TicketBaiWsCancelLroeCashPaymentWithInvoice extends TicketBaiWsCancelLroeCashPaymentBase {
  readonly tipo_operacion?: 'con_factura';
  readonly serie?: string;
  readonly num_factura: string;
  readonly fecha_factura: string;
}

interface TicketBaiWsCancelLroeCashPaymentWithoutInvoice extends TicketBaiWsCancelLroeCashPaymentBase {
  readonly tipo_operacion: 'sin_factura';
  readonly concepto: TicketBaiWsLroeCashPaymentConcept;
  readonly linea: number;
}

type TicketBaiWsCancelLroeCashPayment =
  | TicketBaiWsCancelLroeCashPaymentWithInvoice
  | TicketBaiWsCancelLroeCashPaymentWithoutInvoice;

interface TicketBaiWsCancelLroeCashPaymentsRequest {
  readonly ejercicio: number;
  readonly pagos: readonly TicketBaiWsCancelLroeCashPayment[];
}

export type {
  TicketBaiWsCancelLroeCashPayment,
  TicketBaiWsCancelLroeCashPaymentBase,
  TicketBaiWsCancelLroeCashPaymentsRequest,
  TicketBaiWsCancelLroeCashPaymentWithInvoice,
  TicketBaiWsCancelLroeCashPaymentWithoutInvoice,
  TicketBaiWsListLroeCashPaymentsRequest,
  TicketBaiWsListLroeCashPaymentsResponse,
  TicketBaiWsListLroeCashPaymentsResult,
  TicketBaiWsLroeCashPayment,
  TicketBaiWsLroeCashPaymentBase,
  TicketBaiWsLroeCashPaymentConcept,
  TicketBaiWsLroeCashPaymentMethod,
  TicketBaiWsLroeCashPaymentOperationResult,
  TicketBaiWsLroeCashPaymentOperationType,
  TicketBaiWsLroeCashPaymentQueryItem,
  TicketBaiWsLroeCashPaymentResultStatus,
  TicketBaiWsLroeCashPaymentsBatchStatus,
  TicketBaiWsLroeCashPaymentsMutationResponse,
  TicketBaiWsLroeCashPaymentsMutationResult,
  TicketBaiWsLroeCashPaymentWithInvoice,
  TicketBaiWsLroeCashPaymentWithoutInvoice,
  TicketBaiWsMutateLroeCashPaymentsRequest,
};
