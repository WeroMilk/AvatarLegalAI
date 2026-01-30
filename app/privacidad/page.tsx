"use client";

import { LegalDocLayout, LegalSection } from "@/components/legal-doc-layout";
import { useI18n } from "@/lib/i18n-context";

export default function PrivacidadPage() {
  const { t } = useI18n();

  return (
    <LegalDocLayout title={t("footer_privacy")}>
      <p className="text-muted text-sm">
        {t("legal_privacy_intro")}
      </p>

      <LegalSection title={t("legal_privacy_s1_title")}>
        <p>{t("legal_privacy_s1_body")}</p>
      </LegalSection>

      <LegalSection title={t("legal_privacy_s2_title")}>
        <p>{t("legal_privacy_s2_body")}</p>
      </LegalSection>

      <LegalSection title={t("legal_privacy_s3_title")}>
        <p>{t("legal_privacy_s3_body")}</p>
      </LegalSection>

      <LegalSection title={t("legal_privacy_s4_title")}>
        <p>{t("legal_privacy_s4_body")}</p>
      </LegalSection>

      <LegalSection title={t("legal_privacy_s5_title")}>
        <p>{t("legal_privacy_s5_body")}</p>
      </LegalSection>

      <p className="text-muted text-sm pt-4 border-t border-border/50">
        {t("legal_privacy_footer")}
      </p>
    </LegalDocLayout>
  );
}
