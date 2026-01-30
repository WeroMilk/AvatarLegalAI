"use client";

import { LegalDocLayout, LegalSection } from "@/components/legal-doc-layout";
import { useI18n } from "@/lib/i18n-context";

export default function AvisoLegalPage() {
  const { t } = useI18n();

  const highlight = <p>{t("legal_disclaimer_intro")}</p>;

  return (
    <LegalDocLayout title={t("footer_disclaimer")} highlight={highlight}>
      <LegalSection title={t("legal_disclaimer_s1_title")}>
        <p>{t("legal_disclaimer_s1_body")}</p>
      </LegalSection>

      <LegalSection title={t("legal_disclaimer_s2_title")}>
        <p>{t("legal_disclaimer_s2_body")}</p>
      </LegalSection>

      <LegalSection title={t("legal_disclaimer_s3_title")}>
        <p>{t("legal_disclaimer_s3_body")}</p>
      </LegalSection>
    </LegalDocLayout>
  );
}
