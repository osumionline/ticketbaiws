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

  /**
   * Gets the representation document template for Verifactu.
   *
   * The generated PDF is returned by TicketBaiWS as a Base64-encoded
   * string.
   *
   * @param data Optional representative information used to prefill
   * the document.
   * @returns The response containing the Base64-encoded PDF template.
   */
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

  /**
   * Uploads a digitally signed Verifactu representation document.
   *
   * The document is sent as multipart form data using the provided
   * `Blob`.
   *
   * @param data Signed PDF and optional filename to upload.
   * @returns The TicketBaiWS document upload response.
   */
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

  /**
   * Gets the stored Verifactu representation document.
   *
   * The document is returned by TicketBaiWS as a Base64-encoded string.
   *
   * @returns The response containing the stored Base64-encoded PDF.
   */
  async get(): Promise<TicketBaiWsRepresentationPdfResponse> {
    return this.httpClient.request<string>('GET', 'doc-representante/');
  }

  /**
   * Revokes the stored Verifactu representation document.
   *
   * TicketBaiWS may reject the operation if the document has already
   * been used for real submissions.
   *
   * @returns The TicketBaiWS revocation response.
   */
  async revoke(): Promise<TicketBaiWsRepresentationRevokeResponse> {
    return this.httpClient.request<null>('DELETE', 'doc-representante/');
  }
}

export default TicketBaiWsVerifactuRepresentationResource;
