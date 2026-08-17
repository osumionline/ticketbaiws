export default interface TicketBaiWsListInvoicesRequest {
  readonly fecha_inicio: string;
  readonly fecha_fin: string;
  readonly serie?: string;
  readonly pagina?: number;
  readonly json_orig?: boolean;
  readonly xml_request?: boolean;
  readonly pedido?: boolean;
}
