import { environment } from "../../environments/environment.development";


export const API_BASE_URL = environment.baseurl;
export const CUSTOMER_BASE_URL = `${API_BASE_URL}/customer`;

export const CustomerUrl = Object.freeze({
  create: `${CUSTOMER_BASE_URL}/add`,
  update: (id: string) => `${CUSTOMER_BASE_URL}/edit/${id}`,
  getById: (id: string) => `${CUSTOMER_BASE_URL}/${id}`,
  delete: (id: string) => `${CUSTOMER_BASE_URL}/${id}`,
  getAll: `${CUSTOMER_BASE_URL}/all`,
});
