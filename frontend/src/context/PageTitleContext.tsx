import { createContext, useContext } from 'react';

type PageTitleContextType = {
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
};

export const PageTitleContext = createContext<PageTitleContextType>({
  setTitle: () => {},
  setSubtitle: () => {}
});

export const usePageTitle = () => useContext(PageTitleContext);
