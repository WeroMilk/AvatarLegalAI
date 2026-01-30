"use client";

import { LegalDocLayout, LegalSection } from "@/components/legal-doc-layout";
import { useI18n } from "@/lib/i18n-context";

export default function TerminosPage() {
  const { t } = useI18n();

  return (
    <LegalDocLayout title={t("footer_terms")}>
      <p className="text-muted text-sm">
        {t("legal_terms_intro")}
      </p>

      <LegalSection number="1" title={t("legal_terms_s1_title")}>
        <p>{t("legal_terms_s1_body")}</p>
      </LegalSection>

      <LegalSection number="2" title={t("legal_terms_s2_title")}>
        <p>{t("legal_terms_s2_body")}</p>
      </LegalSection>

      <LegalSection number="3" title={t("legal_terms_s3_title")}>
        <p>{t("legal_terms_s3_body")}</p>
      </LegalSection>

      <LegalSection number="4" title={t("legal_terms_s4_title")}>
        <p>{t("legal_terms_s4_body")}</p>
      </LegalSection>

      <LegalSection number="5" title={t("legal_terms_s5_title")}>
        <p>{t("legal_terms_s5_body")}</p>
      </LegalSection>

      <p className="text-muted text-sm pt-4 border-t border-border/50">
        {t("legal_terms_footer")}
      </p>
    </LegalDocLayout>
  );
}
