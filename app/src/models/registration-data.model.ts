import type { Allergy } from "./allergy.model";

export type RegistrationData = {
    name: string;
    email: string;
    telephone: number | undefined;
    firm: string;
    allergies?: Allergy[];
};
