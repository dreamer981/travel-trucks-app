import { api } from "./api";

/**
 * Küçük yardımcı:
 * Backend bazen dizi yerine obje döndürebilir.
 * Bu fonksiyon gelen cevaptan "items" dizisini ve "total" sayısını bulup standartlaştırır.
 * Her zaman { items: Array, total: number|undefined } döner.
 */
function normalize(res) {
  const data = res.data;

  // 1) Header'dan toplam kayıt (MockAPI bazen gönderir)
  const hdr = res.headers["x-total-count"] || res.headers["X-Total-Count"];
  let total = hdr ? Number(hdr) : undefined;

  // 2) items'ı bul
  if (Array.isArray(data)) {
    // Direkt dizi ise
    return { items: data, total };
  }

  // Obje ise yaygın alan adlarını deneriz
  if (Array.isArray(data.items)) return { items: data.items, total: total ?? data.total ?? data.count };
  if (Array.isArray(data.data))  return { items: data.data,  total: total ?? data.total ?? data.count };
  if (Array.isArray(data.results)) return { items: data.results, total: total ?? data.total ?? data.count };
  if (Array.isArray(data.campers)) return { items: data.campers, total: total ?? data.total ?? data.count };

  // Son çare: obje içindeki ilk dizi alanı bulunursa onu kullan
  const firstArray = Object.values(data).find(Array.isArray);
  if (Array.isArray(firstArray)) {
    return { items: firstArray, total: total ?? data.total ?? data.count };
  }

  // Hiçbiri değilse boş liste döneriz (UI kırılmaz)
  return { items: [], total: total ?? undefined };
}

/**
 * Listeyi getirir (sayfalandırma + filtre parametreleri opsiyoneldir).
 * Örnek: fetchCampersApi({ page: 1, limit: 12, location: "Kyiv", ac: true })
 */
export async function fetchCampersApi(params = {}) {
  const res = await api.get("/campers", { params }); // GET /campers?...
  return normalize(res);                              // Her zaman {items, total}
}

/**
 * Tek ilan detayını getirir.
 * Örnek: fetchCamperByIdApi("3")
 */
export async function fetchCamperByIdApi(id) {
  const res = await api.get(`/campers/${id}`);        // GET /campers/:id
  return res.data;                                    // Tekil obje döner
}
