import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const status = useSelector(selectCampersStatus);
  const hasMore = useSelector(selectCampersHasMore);
  const page = useSelector(selectCampersPage);

  useEffect(() => {
    // İlk girişte listeyi sıfırla ve 1. sayfayı yükle
    dispatch(resetList());
    dispatch(fetchCampers({ page: 1, limit: 12 }));
  }, [dispatch]);

  const loadMore = () => {
    if (status !== "loading" && hasMore) {
      dispatch(fetchCampers({ page: page + 1, limit: 12 }));
    }
  };

  return (
    <main>
      <h2>Catalog</h2>

      {status === "loading" && items.length === 0 && <p>Loading...</p>}

      <ul>
        {items.map((c) => (
          <li key={c.id}>
            {c.name} — {Number(c.price).toFixed(2)}
            {/* Show More (yeni sekme): */}
            {" "}
            <a href={`/catalog/${c.id}`} target="_blank" rel="noopener">
              Show More
            </a>
          </li>
        ))}
      </ul>

      {status === "failed" && <p>Bir şeyler ters gitti.</p>}

      {hasMore && (
        <button onClick={loadMore} disabled={status === "loading"}>
          {status === "loading" ? "Loading..." : "Load More"}
        </button>
      )}
      {!hasMore && items.length > 0 && <p>Hepsi yüklendi.</p>}
    </main>
  );
}
