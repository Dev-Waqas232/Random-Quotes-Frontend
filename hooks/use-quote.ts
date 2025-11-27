import { useEffect, useState } from "react";

export function useQuote() {
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<{
    id: number;
    quote: string;
    author: string;
  } | null>(null);

  useEffect(() => {
    getQuote();
  }, []);

  async function getQuote() {
    try {
      setLoading(true);
      setQuote(null);

      console.log(process.env.BACKEND_URL);
      const response = await fetch(
        "https://random-quotes-backend-t4ol.onrender.com/quote"
      );
      if (!response.ok) {
        const err = new Error("API Request Failed");
        throw err;
      }

      const data = (await response.json()) as {
        ok: boolean;
        data: { id: number; quote: string; author: string };
      };

      setQuote(data.data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { loading, quote, getQuote };
}
