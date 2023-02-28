// declare global {
declare namespace Express {
  export interface Request {
    seller?: CustomSeller | jwt.JwtPayload;
  }
}
// }
