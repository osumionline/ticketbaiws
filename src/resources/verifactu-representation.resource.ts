import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';
import type {
  TicketBaiWsRepresentationPdfResponse,
  TicketBaiWsRepresentationTemplateRequest,
} from '../model/verifactu/ticketbaiws-representation.model.js';

class TicketBaiWsVerifactuRepresentationResource {
  constructor(private readonly httpClient: TicketBaiWsHttpClient) {}

  async getTemplate(
    data: TicketBaiWsRepresentationTemplateRequest = {},
  ): Promise<TicketBaiWsRepresentationPdfResponse> {
    return this.httpClient.request<string>('GET', 'doc-representante/modelo/', {
      query: {
        nombre_representante: data.nombre_representante,
        nif_representante: data.nif_representante,
        poblacion_representante: data.poblacion_representante,
        direccion_representante: data.direccion_representante,
      },
    });
  }
}

export default TicketBaiWsVerifactuRepresentationResource;
