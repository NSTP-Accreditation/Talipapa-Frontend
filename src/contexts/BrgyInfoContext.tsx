import { useAuthFetch } from "@/admin/hooks/useAuthFetch";
import useFetchData from "@/admin/hooks/useFetchData";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface PageContentInterface {
  _id?: string;
  mission: string;
  vision: string;
  barangayName: string;
  barangayHistory: string;
  barangayDescription: string;
  image?: {
    url: string;
    key: string;
    originalName: string;
    size: number;
    mimetype: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface BrgyInfoContextType {
  pageContent: PageContentInterface | undefined;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const BrgyInfoContext = createContext<BrgyInfoContextType | undefined>(undefined);

export const BrgyInfoProvider = ({ children }: { children: ReactNode }) => {
  const [pageContent, setPageContent] = useState<PageContentInterface | undefined>(undefined);
  
  const {
    data,
    loading: dataLoading,
    error,
    refetch,
  } = useFetchData<PageContentInterface>(`/pageContent/${import.meta.env.VITE_PAGE_CONTENT_ID}`);

  useEffect(() => {
    if (data && !dataLoading && !error) {
      setPageContent(data);
    }
  }, [data, dataLoading, error]);

  const contextValue: BrgyInfoContextType = {
    pageContent,
    loading: dataLoading,
    error,
    refetch,
  };

  return (
    <BrgyInfoContext.Provider value={contextValue}>
      {children}
    </BrgyInfoContext.Provider>
  );
};

export const useBrgyInfo = () => {
  const context = useContext(BrgyInfoContext);
  
  if (context === undefined) {
    throw new Error("useBrgyInfo must be used within a BrgyInfoProvider");
  }
  
  return context;
};