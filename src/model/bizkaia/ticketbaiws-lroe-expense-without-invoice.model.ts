import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';
import type { TicketBaiWsDocumentType } from '../invoice/ticketbaiws-invoice.types.js';
import type { TicketBaiWsLroeCashPaymentConcept } from './ticketbaiws-lroe-cash-payment.model.js';

/**
 * Accounting concepts supported by LROE expenses without invoices.
 *
 * The documented codes currently match the LROE cash payment concepts.
 */
type TicketBaiWsLroeExpenseWithoutInvoiceConcept =
  TicketBaiWsLroeCashPaymentConcept;

type TicketBaiWsLroeExpenseWithoutInvoiceTerritory =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5';

type TicketBaiWsLroeExpenseWithoutInvoiceResultStatus =
  | 'Correcto'
  | 'AceptadoConErrores'
  | 'Incorrecto';

type TicketBaiWsLroeExpenseWithoutInvoiceQueryStatus =
  | TicketBaiWsLroeExpenseWithoutInvoiceResultStatus
  | 'Anulado';

type TicketBaiWsLroeExpensesWithoutInvoiceBatchStatus = 'OK' | 'ERROR';

/**
 * Identifying fields of an expense without an invoice.
 */
interface TicketBaiWsLroeExpenseWithoutInvoiceKey {
  readonly fecha_operacion: string;
  readonly concepto: TicketBaiWsLroeExpenseWithoutInvoiceConcept;
  readonly epigrafe?: string;
  readonly linea?: number;
}

/**
 * Expense without an invoice for Bizkaia LROE model 140.
 */
interface TicketBaiWsLroeExpenseWithoutInvoice extends TicketBaiWsLroeExpenseWithoutInvoiceKey {
  readonly importe: number;

  /**
   * Counterparty tax identifier.
   *
   * When provided, TicketBaiWS also requires nombre_social.
   */
  readonly nif?: string;
  readonly nombre_social?: string;
  readonly pais?: string;
  readonly tipo_documento?: TicketBaiWsDocumentType;

  readonly referencia_bien?: string;
  readonly referencia_catastral?: string;
  readonly territorio_alta_actividad?: TicketBaiWsLroeExpenseWithoutInvoiceTerritory;
  readonly criterio_cobros_pagos?: boolean;
}

/**
 * Batch request for creating or updating expenses.
 *
 * TicketBaiWS accepts up to 1000 records per batch.
 */
interface TicketBaiWsMutateLroeExpensesWithoutInvoiceRequest {
  readonly ejercicio: number;
  readonly gastos: readonly TicketBaiWsLroeExpenseWithoutInvoice[];
}

/**
 * Result for an individual expense in a mutation batch.
 */
interface TicketBaiWsLroeExpenseWithoutInvoiceOperationResult {
  readonly fecha_operacion: string;
  readonly epigrafe: string;
  readonly concepto: TicketBaiWsLroeExpenseWithoutInvoiceConcept;
  readonly linea: number;
  readonly estado: TicketBaiWsLroeExpenseWithoutInvoiceResultStatus;
  readonly codigo_error?: string;
  readonly descripcion_error?: string;
  readonly existe?: boolean;
}

/**
 * Result of a batch of expense mutations.
 */
interface TicketBaiWsLroeExpensesWithoutInvoiceMutationResult {
  readonly response: readonly TicketBaiWsLroeExpenseWithoutInvoiceOperationResult[];
  readonly status: TicketBaiWsLroeExpensesWithoutInvoiceBatchStatus;
}

type TicketBaiWsLroeExpensesWithoutInvoiceMutationResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsLroeExpensesWithoutInvoiceMutationResult>;

/**
 * Filters for querying existing expenses.
 */
interface TicketBaiWsListLroeExpensesWithoutInvoiceRequest {
  readonly ejercicio: number;
  readonly fecha_operacion_desde?: string;
  readonly fecha_operacion_hasta?: string;
  readonly nif?: string;
  readonly pais?: string;
  readonly tipo_documento?: TicketBaiWsDocumentType;
  readonly epigrafe?: string;
  readonly estado?: TicketBaiWsLroeExpenseWithoutInvoiceQueryStatus;
  readonly pagina?: number;
}

/**
 * Expense record returned by the query endpoint.
 */
interface TicketBaiWsLroeExpenseWithoutInvoiceQueryItem {
  readonly fecha_operacion: string;
  readonly epigrafe: string;
  readonly concepto: TicketBaiWsLroeExpenseWithoutInvoiceConcept;
  readonly linea: number;
  readonly importe: number;
  readonly nif?: string;
  readonly nombre_social?: string;
  readonly pais?: string;
  readonly tipo_documento?: TicketBaiWsDocumentType;
  readonly estado: TicketBaiWsLroeExpenseWithoutInvoiceQueryStatus;
  readonly fecha_presentacion?: string;
  readonly [key: string]: unknown;
}

interface TicketBaiWsListLroeExpensesWithoutInvoiceResult {
  readonly response: readonly TicketBaiWsLroeExpenseWithoutInvoiceQueryItem[];
}

type TicketBaiWsListLroeExpensesWithoutInvoiceResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsListLroeExpensesWithoutInvoiceResult>;

/**
 * Identifiers of the expenses to cancel.
 */
interface TicketBaiWsCancelLroeExpensesWithoutInvoiceRequest {
  readonly ejercicio: number;
  readonly gastos: readonly TicketBaiWsLroeExpenseWithoutInvoiceKey[];
}

export type {
  TicketBaiWsCancelLroeExpensesWithoutInvoiceRequest,
  TicketBaiWsListLroeExpensesWithoutInvoiceRequest,
  TicketBaiWsListLroeExpensesWithoutInvoiceResponse,
  TicketBaiWsListLroeExpensesWithoutInvoiceResult,
  TicketBaiWsLroeExpensesWithoutInvoiceBatchStatus,
  TicketBaiWsLroeExpensesWithoutInvoiceMutationResponse,
  TicketBaiWsLroeExpensesWithoutInvoiceMutationResult,
  TicketBaiWsLroeExpenseWithoutInvoice,
  TicketBaiWsLroeExpenseWithoutInvoiceConcept,
  TicketBaiWsLroeExpenseWithoutInvoiceKey,
  TicketBaiWsLroeExpenseWithoutInvoiceOperationResult,
  TicketBaiWsLroeExpenseWithoutInvoiceQueryItem,
  TicketBaiWsLroeExpenseWithoutInvoiceQueryStatus,
  TicketBaiWsLroeExpenseWithoutInvoiceResultStatus,
  TicketBaiWsLroeExpenseWithoutInvoiceTerritory,
  TicketBaiWsMutateLroeExpensesWithoutInvoiceRequest,
};
