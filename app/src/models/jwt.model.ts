import type { JwtPayload } from "jsonwebtoken";

export interface TokenData {
  document_id: string;
  event_id: number;
  email: string;
}

export interface DecodedToken extends JwtPayload {
  data: TokenData;
}
