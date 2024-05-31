import type { JwtPayload } from "jsonwebtoken";

interface TokenData {
  event_id: number;
  email: string;
}

export interface DecodedToken extends JwtPayload {
  data: TokenData;
}
