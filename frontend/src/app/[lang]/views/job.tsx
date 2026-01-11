"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { getStrapiURL } from "../utils/api-helpers";
import type { HeroSimpleSection, Job, StrapiMedia } from "@/types/generated";
import HeroSimple from "../components/HeroSimple";
import Banner from "../components/Banner";

interface JobDetailProps {
  data: Job;
}

export default function JobDetail({ data }: JobDetailProps) {
  const { name, content, location, dueDate } = data;
  const formRef = useRef<HTMLDivElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    job: name || "",
    resume: null as File | null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = process.env.NEXT_PUBLIC_STRAPI_FORM_SUBMISSION_TOKEN;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Track form visibility for mobile floating button
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
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
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append(
        "data",
        JSON.stringify({
          fullname: formData.fullname,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          job: formData.job,
        })
      );

      if (formData.resume) {
        submitData.append("files.resume", formData.resume);
      }

      const res = await fetch(getStrapiURL() + "/api/lead-form-submissions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!res.ok) {
        setErrorMessage("Failed to submit application. Please try again.");
        return;
      }

      setSuccessMessage("Thank you! Your application has been submitted successfully.");
      setFormData({
        fullname: "",
        email: "",
        phoneNumber: "",
        job: name || "",
        resume: null,
      });
    } catch {
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const blankPicture: StrapiMedia = {
    id: 0,
    documentId: "",
    url: "",
    alternativeText: "Blank Picture",
  };

  // Create hero data for HeroSimple
  // typescript-eslint/no-non-null-assertion
  const heroData: HeroSimpleSection = {
    id: 0,
    __component: "sections.hero-simple",
    title: name,
    description: `${location?.name} ${dueDate ? ` | Due Date : ${dueDate}` : ""}`,
    isPictureBlank: true,
    picture: blankPicture,
    mobilePicture: blankPicture,
  };

  return (
    <section>
      {/* Hero Section */}
      <HeroSimple data={heroData} />

      {/* Content Layout */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Main Content */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="mt-10 mb-6 text-3xl font-semibold text-gray-900">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mt-8 mb-4 text-2xl font-semibold text-gray-900">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-6 mb-3 text-xl font-semibold text-gray-900">{children}</h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc space-y-2 pl-5 mb-4 text-gray-700">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal space-y-2 pl-5 mb-4 text-gray-700">{children}</ol>
                  ),
                  li: ({ children }) => <li className="text-gray-700">{children}</li>,
                  p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">{children}</strong>
                  ),
                }}
              >
                {content || ""}
              </ReactMarkdown>
            </div>

            {/* Attention Section */}
            <div className="mt-12 rounded-lg border border-amber-200 bg-amber-50 p-6">
              <h3 className="mb-3 text-lg font-semibold text-amber-800">Attention!</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-amber-700">
                <li>Do not respond any payment for the recruitment process.</li>
                <li>Only shortlisted candidates will be contacted for the recruitment process.</li>
              </ul>
            </div>
          </div>

          {/* Right Side - Application Form */}
          <div className="lg:col-span-1">
            <div ref={formRef} id="apply-form" className="sticky top-24">
              <div className="rounded-2xl bg-gray-50 p-6 md:p-8">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">Apply Now!</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Fullname */}
                  <div>
                    <label
                      htmlFor="fullname"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Full Name <span className="text-red-500">*</span>
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

                  {/* Job (Read-only) */}
                  <div>
                    <label htmlFor="job" className="mb-2 block text-sm font-medium text-gray-700">
                      Job
                    </label>
                    <input
                      type="text"
                      id="job"
                      name="job"
                      value={formData.job}
                      readOnly
                      className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-600"
                    />
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label
                      htmlFor="resume"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Choose File
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-accent-dark"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>

                  {/* Error Message */}
                  {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

                  {/* Success Message */}
                  {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner */}
      <Banner
        data={{
          id: 0,
          __component: "sections.banner",
          heading: "Let’s Connect with LINC and Manage Your Supply Chain",
          buttons: [
            {
              id: 0,
              __component: "links.button-link",
              text: "Contact Us",
              url: "/contact-us",
              type: "primary",
            },
          ],
          videoButton: {
            id: 0,
            __component: "links.button-video",
            embedUrl: "https://www.youtube.com/embed/46p89rG6h6c?feature=oembed",
            button: {
              __component: "links.button",
              id: 0,
              text: "Watch our video",
              type: "tertiary",
            },
          },
        }}
      />

      {/* Mobile Floating Apply Button */}
      {!isFormVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 lg:hidden">
          <button
            onClick={scrollToForm}
            className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Apply Now
          </button>
        </div>
      )}
    </section>
  );
}
