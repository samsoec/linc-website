"use client";

import { useState } from "react";
import type { LeadFormSection } from "@/types/generated";
import { getStrapiURL } from "../utils/api-helpers";
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from "@heroicons/react/24/outline";

interface LeadFormProps {
  data: LeadFormSection;
}

export default function LeadForm({ data }: LeadFormProps) {
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
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(getStrapiURL() + "/api/lead-form-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: formData }),
      });

      if (!res.ok) {
        setErrorMessage("Failed to submit form. Please try again.");
        return;
      }

      setSuccessMessage("Thank you! Your message has been submitted successfully.");
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
      setErrorMessage("An error occurred. Please try again.");
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
                  Fullname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Ex: Samantha William"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Ex: email@email.com"
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
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Ex: 081234567890"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  required
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="company" className="mb-2 block text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Ex: PT Jaya Barokah"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="mb-2 block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Ex: Marketing Manager"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              {/* Interest Business */}
              <div>
                <label
                  htmlFor="interestedBusiness"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Interest Business
                </label>
                <select
                  id="interestedBusiness"
                  name="interestedBusiness"
                  value={formData.interestedBusiness}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">Select...</option>
                  <option value="Linc Logistics - Warehousing & Contract Logistics">
                    Linc Logistics - Warehousing &amp; Contract Logistics
                  </option>
                  <option value="Linc Express - Transportation">
                    Linc Express - Transportation
                  </option>
                  <option value="Linc Impex - Freight Forwarding">
                    Linc Impex - Freight Forwarding
                  </option>
                  <option value="Linc Terminal - Liquid Bulk Storage (Storage Tank)">
                    Linc Terminal - Liquid Bulk Storage (Storage Tank)
                  </option>
                </select>
              </div>

              {/* Where did you hear about us */}
              <div>
                <label
                  htmlFor="whereDidYouHear"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Where did you hear about Linc Group?
                </label>
                <select
                  id="whereDidYouHear"
                  name="whereDidYouHear"
                  value={formData.whereDidYouHear}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option value="">Select...</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Relatives/Friends">Relatives/Friends</option>
                  <option value="Website">Website</option>
                  <option value="Events">Events</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Inquiry */}
              <div>
                <label htmlFor="inquiry" className="mb-2 block text-sm font-medium text-gray-700">
                  Inquiry
                </label>
                <textarea
                  id="inquiry"
                  name="inquiry"
                  value={formData.inquiry}
                  onChange={handleInputChange}
                  placeholder="Write your message..."
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
                {isSubmitting ? "Submitting..." : submitButton?.text || "Submit Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
