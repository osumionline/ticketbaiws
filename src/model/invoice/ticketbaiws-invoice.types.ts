type TicketBaiWsDocumentType = '02' | '03' | '04' | '05' | '06';

type TicketBaiWsRectificationKey = 'R1' | 'R2' | 'R3' | 'R4' | 'R5';

type TicketBaiWsRectificationType = 'S' | 'I' | 'SN';

type TicketBaiWsOperationType = 'servicios' | 'bienes';

type TicketBaiWsExemptionCause =
  | 'E1'
  | 'E2'
  | 'E3'
  | 'E4'
  | 'E5'
  | 'E6'
  | 'RL'
  | 'OT'
  | 'IE'
  | 'VT';

type TicketBaiWsThirdPartyIssue = 'N' | 'T' | 'D';

export type {
  TicketBaiWsDocumentType,
  TicketBaiWsExemptionCause,
  TicketBaiWsOperationType,
  TicketBaiWsRectificationKey,
  TicketBaiWsRectificationType,
  TicketBaiWsThirdPartyIssue,
};
