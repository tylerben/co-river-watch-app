import { useState, useEffect, Dispatch, SetStateAction } from "react";
import axios from "axios";

export type iData = {
  [key: string]: any;
};

export type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export type HookReturn<T> = {
  data: T;
  setData: Dispatcher<T>;
  isLoading: boolean;
};

function useFetchData<T>(
  endpoint: string,
  dependencies: any[],
  initValue: any = []
): HookReturn<T> {
  const [data, setData] = useState<T>(initValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up a cancellation source
    let didCancel = false;

    setIsLoading(true);
    async function getData() {
      try {
        const fetchedData = await axios.get(`/.netlify/functions/${endpoint}`);
        if (!didCancel) {
          // Ignore if we started fetching something else
          setData(fetchedData.data);
          setIsLoading(false);
        }
      } catch (err) {
        // Is this error because we cancelled it ourselves?
        if (axios.isCancel(err)) {
          console.log(`call was cancelled`);
        } else {
          console.error(err);
        }
        setIsLoading(false);
      }
    }
    getData();
    return () => {
      didCancel = true;
    }; // Remember if we start fetching something else
    // eslint-disable-next-line
  }, dependencies);

  return {
    data,
    setData,
    isLoading,
  };
}

export default useFetchData;
