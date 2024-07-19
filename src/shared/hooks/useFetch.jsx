import { useCallback, useState, useEffect, useRef } from "react";

function useFetch() {
  // HOOKS TO SHOW SPINNER AND ERROR MODAL

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  // FUNCTION TO FETCH DATA FROM SERVER

  const sendRequest = useCallback(

    async (url, method = "GET", body = null, headers = {}) => {

      setIsLoading(true);

      // CREATE ABORT CONTROLLER OBJECT

      const httpAbortCtrl = new AbortController();

      // PUSH ABORT CONTROLLER OBJECT IN ARRAY

      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,

          // SIGNAL PROPERTY WILL CANCEL FETCH WHEN IT HAS ABORT FUNCTION

          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        // SCAN ARRAY TO FIND OUT WHICH REQUESTS WERE ABORTED WHICH NOT

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setIsLoading(false);
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // SCAN TO FIND OUT WHICH REQUESTS ARE ABORTED
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return [isLoading, error, sendRequest, clearError];
}

export default useFetch;
