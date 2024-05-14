import type { Allergy } from "./allergy.model";

export type RegistrationData = {
    name: string;
    email: string;
    telephone: string;
    firm: string;
    allergies?: Allergy[];
};
