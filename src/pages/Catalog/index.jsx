import { useEffect } from "react";
import { api } from "../../services/api";

export default function Catalog() {
  useEffect(() => {
    api.get("/campers").then(res => {
      console.log(res.data);
    });
  }, []);

  return <h2>Catalog</h2>;
}
