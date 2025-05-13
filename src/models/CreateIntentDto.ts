export interface CreateIntentDto {
    /** ID del paquete seleccionado (debe coincidir con el mismo valor que envías al backend) */
    packageId: string;
    /** Monto en la unidad mínima (centavos para ARS, p.ej. 45000 = ARS 450.00) */
    amount: number;
    /** Moneda ISO, e.g. "ars", "usd" */
    currency: string;
  }