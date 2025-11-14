// React hooks wrapping the API callsimport { useEffect, useState } from "react";
import { useEffect, useState } from "react";
import { getPosts } from "./api";

export function usePosts() {
    const [data, setData] = useState<typeof getPosts>([]);

    useEffect(() => {
        getPosts().then(setData);
    }, []);

    return data;
}