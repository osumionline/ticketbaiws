export { default as TicketBaiWsClient } from './client/ticketbaiws-client.js';

export { default as TicketBaiWsApiError } from './errors/ticketbaiws-api-error.js';
export { default as TicketBaiWsConfigurationError } from './errors/ticketbaiws-configuration-error.js';
export { default as TicketBaiWsError } from './errors/ticketbaiws-error.js';
export { default as TicketBaiWsHttpError } from './errors/ticketbaiws-http-error.js';
export { default as TicketBaiWsNetworkError } from './errors/ticketbaiws-network-error.js';
export { default as TicketBaiWsResponseError } from './errors/ticketbaiws-response-error.js';

export type { default as TicketBaiWsClientOptions } from './model/common/ticketbaiws-client-options.model.js';

export type { default as TicketBaiWsEnvironment } from './model/common/ticketbaiws-environment.type.js';

export type {
  TicketBaiWsErrorResponse,
  TicketBaiWsResponse,
  TicketBaiWsResult,
  TicketBaiWsSuccessResponse,
} from './model/common/ticketbaiws-response.model.js';

export type { default as TicketBaiWsStatusResponse } from './model/system/ticketbaiws-status-response.model.js';

export type { default as TicketBaiWsCreateInvoiceRequest } from './model/invoice/ticketbaiws-create-invoice-request.model.js';

export type {
  TicketBaiWsCreateInvoiceResponse,
  TicketBaiWsCreateInvoiceResult,
  TicketBaiWsTicketBaiInvoiceResult,
  TicketBaiWsVerifactuInvoiceResult,
} from './model/invoice/ticketbaiws-create-invoice-response.model.js';

export type {
  TicketBaiWsInvoiceLine,
  TicketBaiWsRectifiedInvoice,
} from './model/invoice/ticketbaiws-invoice.model.js';

export type {
  TicketBaiWsDocumentType,
  TicketBaiWsExemptionCause,
  TicketBaiWsOperationType,
  TicketBaiWsRectificationKey,
  TicketBaiWsRectificationType,
  TicketBaiWsThirdPartyIssue,
} from './model/invoice/ticketbaiws-invoice.types.js';

export type {
  TicketBaiWsCancelInvoiceResponse,
  TicketBaiWsInvoiceActionResult,
  TicketBaiWsResendInvoiceResponse,
} from './model/invoice/ticketbaiws-invoice-action-response.model.js';

export type {
  TicketBaiWsCancelInvoiceRequest,
  TicketBaiWsInvoiceReference,
} from './model/invoice/ticketbaiws-invoice-reference.model.js';

export type {
  TicketBaiWsGetInvoiceResponse,
  TicketBaiWsGetInvoiceResult,
  TicketBaiWsInvoiceStatus,
  TicketBaiWsTicketBaiInvoiceStatusResult,
  TicketBaiWsVerifactuInvoiceStatusResult,
} from './model/invoice/ticketbaiws-get-invoice-response.model.js';

export type {
  default as TicketBaiWsCompleteInvoiceRequest,
  TicketBaiWsSimplifiedInvoiceReference,
} from './model/invoice/ticketbaiws-complete-invoice-request.model.js';

export type { TicketBaiWsCompleteInvoiceResponse } from './model/invoice/ticketbaiws-complete-invoice-response.model.js';

export type { default as TicketBaiWsListInvoicesRequest } from './model/invoice/ticketbaiws-list-invoices-request.model.js';

export type {
  TicketBaiWsInvoiceListItem,
  TicketBaiWsListInvoicesResponse,
} from './model/invoice/ticketbaiws-list-invoices-response.model.js';

export type {
  TicketBaiWsFacturaERequest,
  TicketBaiWsFacturaEResponse,
  TicketBaiWsInvoicePdfResponse,
  TicketBaiWsInvoiceXmlResponse,
  TicketBaiWsInvoiceXmlResult,
} from './model/invoice/ticketbaiws-invoice-download.model.js';

export type {
  TicketBaiWsAeatValidationRequest,
  TicketBaiWsAeatValidationResponse,
  TicketBaiWsAeatValidationResult,
  TicketBaiWsAeatValidationStatus,
  TicketBaiWsViesValidationRequest,
  TicketBaiWsViesValidationResponse,
  TicketBaiWsViesValidationResult,
  TicketBaiWsViesValidationStatus,
} from './model/validation/ticketbaiws-validation.model.js';

export type {
  TicketBaiWsCompany,
  TicketBaiWsCompanyResponse,
  TicketBaiWsCompanyTaxAuthority,
  TicketBaiWsCreateCompanyRequest,
  TicketBaiWsListCompaniesRequest,
  TicketBaiWsListCompaniesResponse,
  TicketBaiWsUpdateCompanyRequest,
} from './model/company/ticketbaiws-company.model.js';

export type {
  TicketBaiWsCreateLicenseRequest,
  TicketBaiWsCreateLicenseResponse,
  TicketBaiWsCreateLicenseResult,
  TicketBaiWsLicense,
  TicketBaiWsLicenseModality,
  TicketBaiWsListLicensesRequest,
  TicketBaiWsListLicensesResponse,
} from './model/license/ticketbaiws-license.model.js';

export type {
  TicketBaiWsGetWebhookResponse,
  TicketBaiWsGetWebhookResult,
  TicketBaiWsListWebhooksRequest,
  TicketBaiWsListWebhooksResponse,
  TicketBaiWsWebhook,
  TicketBaiWsWebhookRequest,
  TicketBaiWsWebhookResponse,
} from './model/webhook/ticketbaiws-webhook.model.js';

export type {
  TicketBaiWsRepresentationPdfResponse,
  TicketBaiWsRepresentationRevokeResponse,
  TicketBaiWsRepresentationTemplateRequest,
  TicketBaiWsRepresentationUploadRequest,
  TicketBaiWsRepresentationUploadResponse,
} from './model/verifactu/ticketbaiws-representation.model.js';

export type {
  TicketBaiWsEpigraph,
  TicketBaiWsListEpigraphsResponse,
} from './model/bizkaia/ticketbaiws-epigraph.model.js';

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
} from './model/bizkaia/ticketbaiws-lroe-received-invoice.model.js';
