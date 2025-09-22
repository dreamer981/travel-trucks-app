// src/pages/Catalog/index.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CamperCard from "../../components/campers/CamperCard";
import {
  fetchCampers,
  resetList,
  selectCampers,
  selectCampersStatus,
  selectCampersHasMore,
  selectCampersPage,
} from "../../features/campers/campersSlice";

export default function Catalog() {
  const dispatch = useDispatch();

  const items = useSelector(selectCampers);
  const status = useSelector(selectCampersStatus);     // idle | loading | succeeded | failed
  const hasMore = useSelector(selectCampersHasMore);
  const page = useSelector(selectCampersPage);

  // İlk girişte listeyi sıfırla ve 1. sayfayı getir
  useEffect(() => {
    dispatch(resetList());
    dispatch(fetchCampers({ page: 1, limit: 12 }));
  }, [dispatch]);

  const handleLoadMore = () => {
    if (status !== "loading" && hasMore) {
      dispatch(fetchCampers({ page: page + 1, limit: 12 }));
    }
  };

  return  (
    <main className="catalog">
      <header className="catalog__header">
        <h2 className="catalog__title">Catalog</h2>
        {/* İleride filtre panelini buraya koyacağız */}
      </header>

      {/* İlk yüklemede skeleton/loader metni */}
      {status === "loading" && items.length === 0 && (
        <div className="catalog__loading">Loading...</div>
      )}

      {/* Liste */}
      <section className="catalog__grid">
        {Array.isArray(items) &&
          items.map((c) => <CamperCard key={c.id} camper={c} />)}
      </section>

      {/* Hata */}
      {status === "failed" && (
        <div className="catalog__error">Bir şeyler ters gitti. Lütfen tekrar deneyin.</div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="catalog__more">
          <button
            className="catalog__moreBtn"
            onClick={handleLoadMore}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Loading..." : "Load more"}
          </button>
        </div>
      )}

      {/* Tümü yüklendiyse küçük bilgi */}
      {!hasMore && items.length > 0 && (
        <div className="catalog__end">Hepsi yüklendi.</div>
      )}
    </main>
  );
}
