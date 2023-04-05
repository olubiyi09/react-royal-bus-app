import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useFetchDocument = (collectionName, docName) => {
  const [document, setDocument] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getDocument = async () => {
    setIsLoading(true);
    const docRef = doc(db, collectionName, docName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const obj = {
        id: docName,
        ...docSnap.data(),
      };
      setDocument([obj]);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDocument();
  }, []);

  return { document };
};

export default useFetchDocument;
