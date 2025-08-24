import { api } from "./api";

/**
 * Liste için server-side filtre + sayfalandırma
 * MockAPI tipik paramlar: ?page=1&limit=12&location=Kyiv&type=alcove&ac=true ...
 */
export async function fetchCampersApi(params = {}) {
  const res = await api.get("/campers", { params });
  const totalHeader =
    res.headers["x-total-count"] || res.headers["X-Total-Count"];
  const total = totalHeader ? Number(totalHeader) : undefined; // MockAPI bazen göndermez
  return { items: res.data, total };
}

/** Tekil kayıt */
export async function fetchCamperByIdApi(id) {
  const res = await api.get(`/campers/${id}`);
  return res.data;
}
