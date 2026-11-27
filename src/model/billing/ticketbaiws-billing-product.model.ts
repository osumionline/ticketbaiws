import type { TicketBaiWsSuccessResponse } from '../common/ticketbaiws-response.model.js';

/**
 * Product stored in the TicketBaiWS invoicing tool.
 *
 * Monetary and tax values are returned as numbers.
 * Unit prices do not include VAT.
 */
interface TicketBaiWsBillingProduct {
  /**
   * Product identifier used by GET /productos/{codigo}/.
   *
   * Kept as a string even when it contains only digits.
   */
  readonly codigo: string;

  readonly referencia: string;
  readonly descripcion: string;
  readonly nombre_en: string;
  readonly nombre_eu: string;
  readonly marca: string;
  readonly familia: string;
  readonly codigo_familia: string;
  readonly hs_code: string;

  readonly cantidad: number;
  readonly importe_unitario: number;
  readonly tipo_iva: number;
  readonly tipo_req: number;
  readonly tipo_retencion: number;
}

/**
 * Optional filters for searching invoicing products.
 */
interface TicketBaiWsListBillingProductsRequest {
  /**
   * Searches product names in Spanish, English or Basque,
   * as well as references, brands, HS codes and families.
   */
  readonly buscar?: string;

  /**
   * Exact product reference.
   */
  readonly referencia?: string;

  /**
   * Product family code.
   */
  readonly familia?: string;

  /**
   * Zero-based page index.
   */
  readonly pagina?: number;

  /**
   * Number of products per page.
   *
   * Default: 50. Maximum: 250.
   */
  readonly cantidad?: number;
}

/**
 * Response containing a single product.
 */
type TicketBaiWsBillingProductResponse =
  TicketBaiWsSuccessResponse<TicketBaiWsBillingProduct>;

/**
 * Response containing a paginated product list.
 *
 * TicketBaiWS includes the total record count at the
 * response root, alongside result, return and msg.
 */
type TicketBaiWsListBillingProductsResponse = TicketBaiWsSuccessResponse<
  readonly TicketBaiWsBillingProduct[]
> & {
  readonly count?: number;
};

export type {
  TicketBaiWsBillingProduct,
  TicketBaiWsBillingProductResponse,
  TicketBaiWsListBillingProductsRequest,
  TicketBaiWsListBillingProductsResponse,
};
