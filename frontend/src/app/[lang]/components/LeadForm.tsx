"use client";

import { useState } from "react";
import type { LeadFormSection } from "@/types/generated";
import { getStrapiURL } from "../utils/api-helpers";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useDictionary } from "@/contexts/DictionaryContext";

interface LeadFormProps {
  data: LeadFormSection;
}

export default function LeadForm({ data }: LeadFormProps) {
  const { t } = useDictionary();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    company: "",
    position: "",
    interestedBusiness: "",
    whereDidYouHear: "",
    inquiry: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = process.env.NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!formData.fullname || !formData.email || !formData.phoneNumber) {
      setErrorMessage(t("validation.requiredFields"));
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setErrorMessage(t("validation.invalidEmail"));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(getStrapiURL() + "/api/form-submission-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: formData }),
      });

      if (!res.ok) {
        setErrorMessage(t("messages.error.failedToSubmit"));
        return;
      }

      setSuccessMessage(t("messages.success.formSubmitted"));
      setFormData({
        fullname: "",
        email: "",
        phoneNumber: "",
        company: "",
        position: "",
        interestedBusiness: "",
        whereDidYouHear: "",
        inquiry: "",
      });
    } catch {
      setErrorMessage(t("messages.error.errorOccurred"));
    } finally {
      setIsSubmitting(false);
    }
  }

  const { heading, subheading, description, submitButton, locations } = data;

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Side: Info */}
          <div>
            {/* Header */}
            <div className="mb-8">
              {subheading && (
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.4em] text-accent">
                  {subheading}
                </p>
              )}
              {heading && (
                <h2 className="mb-4 text-3xl font-semibold text-gray-900 md:text-4xl lg:text-5xl">
                  {heading}
                </h2>
              )}
              {description && <p className="text-base text-gray-600 md:text-lg">{description}</p>}
              {/* Accent Line */}
              <div className="mt-6 h-1 w-16 rounded-full bg-accent" />
            </div>

            {/* Locations */}
            {locations && locations.length > 0 && (
              <div className="space-y-8">
                {locations.map((location, index) => (
                  <div key={location.id || index}>
                    <div className="mb-4 flex items-start gap-3">
                      <MapPinIcon className="h-6 w-6 flex-shrink-0 text-accent" />
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">
                          {location.title}
                        </h3>
                        <p className="mb-2 text-sm leading-relaxed text-gray-600">
                          {location.address}
                        </p>

                        {/* Emails */}
                        {location.emails && location.emails.length > 0 && (
                          <div className="mb-3 flex items-start gap-3">
                            <EnvelopeIcon className="h-5 w-5 flex-shrink-0 text-accent" />
                            <div className="flex flex-col gap-1">
                              {location.emails.map((emailObj, idx) => (
                                <a
                                  key={idx}
                                  href={`mailto:${emailObj.email}`}
                                  className="text-sm text-accent hover:underline"
                                >
                                  {emailObj.email}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Phone Numbers */}
                        {location.phoneNumbers && location.phoneNumbers.length > 0 && (
                          <div className="flex items-start gap-3">
                            <PhoneIcon className="h-5 w-5 flex-shrink-0 text-accent" />
                            <div className="flex flex-col gap-1">
                              {location.phoneNumbers.map((phoneObj, idx) => (
                                <a
                                  key={idx}
                                  href={`tel:${phoneObj.phoneNumber}`}
                                  className="text-sm text-accent hover:underline"
                                >
                                  {phoneObj.phoneNumber}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Form */}
          <div className="rounded-2xl bg-gray-50 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Fullname */}
              <div>
                <label htmlFor="fullname" className="mb-2 block text-sm font-medium text-gray-700">
                  {t("form.labels.fullName")} <span className="text-red-500">{t("form.required")}</span>
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder={t("form.placeholders.fullName")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  {t("form.labels.email")} <span className="text-red-500">{t("form.required")}</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t("form.placeholders.email")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("form.labels.phoneNumber")} <span className="text-red-500">{t("form.required")}</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder={t("form.placeholders.phoneNumber")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="mb-2 block text-sm font-medium text-gray-700">
                  {t("form.labels.company")}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder={t("form.placeholders.company")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="mb-2 block text-sm font-medium text-gray-700">
                  {t("form.labels.position")}
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder={t("form.placeholders.position")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              {/* Interest Business */}
              <div>
                <label
                  htmlFor="interestedBusiness"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("form.labels.interestBusiness")}
                </label>
                <select
                  id="interestedBusiness"
                  name="interestedBusiness"
                  value={formData.interestedBusiness}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">{t("form.placeholders.select")}</option>
                  <option value="Linc Logistics - Warehousing & Contract Logistics">
                    {t("form.businessOptions.warehousing")}
                  </option>
                  <option value="Linc Express - Transportation">
                    {t("form.businessOptions.transportation")}
                  </option>
                  <option value="Linc Impex - Freight Forwarding">
                    {t("form.businessOptions.freight")}
                  </option>
                  <option value="Linc Terminal - Liquid Bulk Storage (Storage Tank)">
                    {t("form.businessOptions.storage")}
                  </option>
                </select>
              </div>

              {/* Where did you hear about us */}
              <div>
                <label
                  htmlFor="whereDidYouHear"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {t("form.labels.whereDidYouHear")}
                </label>
                <select
                  id="whereDidYouHear"
                  name="whereDidYouHear"
                  value={formData.whereDidYouHear}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">{t("form.placeholders.select")}</option>
                  <option value="Social Media">{t("form.sourceOptions.socialMedia")}</option>
                  <option value="Relatives/Friends">{t("form.sourceOptions.relatives")}</option>
                  <option value="Website">{t("form.sourceOptions.website")}</option>
                  <option value="Events">{t("form.sourceOptions.events")}</option>
                  <option value="Others">{t("form.sourceOptions.others")}</option>
                </select>
              </div>

              {/* Inquiry */}
              <div>
                <label htmlFor="inquiry" className="mb-2 block text-sm font-medium text-gray-700">
                  {t("form.labels.inquiry")}
                </label>
                <textarea
                  id="inquiry"
                  name="inquiry"
                  value={formData.inquiry}
                  onChange={handleInputChange}
                  placeholder={t("form.placeholders.inquiry")}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                  {successMessage}
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{errorMessage}</div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-accent px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? t("actions.submitting")
                  : submitButton?.text || t("actions.submitMessage")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
