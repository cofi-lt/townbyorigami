import { FC, ReactNode } from "react";
import { Header } from "../sections/Header";
import { Footer } from "../sections/Footer";
import { LanguageModal } from "../sections/LanguageModal";
import { FloatingCallWidget } from "../sections/FloatingCallWidget";
import { Analytics } from "@vercel/analytics/react";

export interface AppLayoutProps {
  headerProps: any;
  footerProps: any;
  languageModalProps: any;
  callRequestLabel: string;
  openModal: (type: any, payload?: any) => void;
  activeModalElement: ReactNode;
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({
  headerProps,
  footerProps,
  languageModalProps,
  callRequestLabel,
  openModal,
  activeModalElement,
  children
}) => {
  return (
    <div className="app-root">
      <Header {...headerProps} />
      
      {children}

      <Footer {...footerProps} />

      <FloatingCallWidget
        openModal={() => openModal("request_call")}
        t={headerProps.t}
        label={callRequestLabel}
      />

      {languageModalProps && <LanguageModal {...languageModalProps} />}

      {activeModalElement}

      <Analytics />
    </div>
  );
};
