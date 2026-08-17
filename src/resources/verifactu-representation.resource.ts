import TicketBaiWsHttpClient from '../client/ticketbaiws-http-client.js';

import type {
  TicketBaiWsRepresentationPdfResponse,
  TicketBaiWsRepresentationRevokeResponse,
  TicketBaiWsRepresentationTemplateRequest,
  TicketBaiWsRepresentationUploadRequest,
  TicketBaiWsRepresentationUploadResponse,
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

  async upload(
    data: TicketBaiWsRepresentationUploadRequest,
  ): Promise<TicketBaiWsRepresentationUploadResponse> {
    const formData = new FormData();

    if (data.filename === undefined) {
      formData.append('file', data.file);
    } else {
      formData.append('file', data.file, data.filename);
    }

    return this.httpClient.request<string>('POST', 'doc-representante/', {
      body: formData,
    });
  }

  async get(): Promise<TicketBaiWsRepresentationPdfResponse> {
    return this.httpClient.request<string>('GET', 'doc-representante/');
  }

  async revoke(): Promise<TicketBaiWsRepresentationRevokeResponse> {
    return this.httpClient.request<null>('DELETE', 'doc-representante/');
  }
}

export default TicketBaiWsVerifactuRepresentationResource;
