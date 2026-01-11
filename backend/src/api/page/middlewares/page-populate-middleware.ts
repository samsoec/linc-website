"use strict";

/**
 * `page-populate-middleware` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const populate = {
      contentSections: {
        on: {
          "sections.hero": {
            populate: {
              picture: {
                fields: [
                  "url",
                  "alternativeText",
                  "caption",
                  "width",
                  "height",
                ],
              },
              mobilePicture: {
                fields: [
                  "url",
                  "alternativeText",
                  "caption",
                  "width",
                  "height",
                ],
              },
              buttons: {
                populate: true,
              },
              videoButton: {
                populate: {
                  button: {
                    populate: true,
                  },
                },
              },
              award: {
                populate: {
                  logo: {
                    fields: [
                      "url",
                      "alternativeText",
                      "caption",
                      "width",
                      "height",
                    ],
                  },
                },
              },
            },
          },
          "sections.large-video": {
            populate: {
              video: {
                fields: ["url", "alternativeText"],
              },
              poster: {
                fields: ["url", "alternativeText"],
              },
            },
          },
          "sections.hero-simple": {
            populate: {
              picture: {
                fields: [
                  "url",
                  "alternativeText",
                  "caption",
                  "width",
                  "height",
                ],
              },
              mobilePicture: {
                fields: [
                  "url",
                  "alternativeText",
                  "caption",
                  "width",
                  "height",
                ],
              },
              searchBar: {
                populate: true,
              }
            },
          },
          "sections.large-image": {
            populate: {
              desktopImage: {
                fields: [
                  "url",
                  "alternativeText",
                  "caption",
                  "width",
                  "height",
                ],
              },
              mobileImage: {
                fields: [
                  "url",
                  "alternativeText",
                  "caption",
                  "width",
                  "height",
                ],
              },
            },
          },
          "sections.banner": {
            populate: {
              buttons: {
                populate: true,
              },
              videoButton: {
                populate: {
                  button: {
                    populate: true,
                  },
                },
              },
            },
          },
          "sections.about-company": {
            populate: {
              highlights: {
                populate: true,
              },
              moreButton: {
                populate: true,
              },
              cards: {
                populate: true,
              },
              videoEmbed: {
                populate: true,
              },
              image: {
                populate: {
                  media: {
                    fields: [
                      "url",
                      "alternativeText",
                      "caption",
                      "width",
                      "height",
                    ],
                  },
                  items: {
                    populate: true,
                  },
                },
              },
            },
          },
          "sections.client-marquee": {
            populate: {
              clients: {
                fields: [
                  "url",
                  "alternativeText",
                  "caption",
                  "width",
                  "height",
                ],
              },
            },
          },
          "sections.industry-sectors": {
            populate: {
              sectors: {
                populate: {
                  media: {
                    fields: [
                      "url",
                      "alternativeText",
                      "caption",
                      "width",
                      "height",
                    ],
                  },
                },
              },
            },
          },
          "sections.lead-form": {
            populate: {
              submitButton: {
                populate: true,
              },
              locations: {
                populate: {
                  phoneNumbers: true,
                  emails: true,
                },
              },
            },
          },
          "sections.news-room": {
            populate: {
              articles: {
                populate: {
                  cover: {
                    fields: [
                      "url",
                      "alternativeText",
                      "caption",
                      "width",
                      "height",
                    ],
                  },
                  category: {
                    fields: ["name", "slug"],
                  },
                  authorsBio: {
                    fields: ["name"],
                    populate: {
                      avatar: {
                        fields: ["url", "alternativeText"],
                      },
                    },
                  },
                },
              },
            },
          },
          "sections.services": {
            populate: {
              services: {
                fields: ["name", "caption", "slug", "description", "features"],
                populate: {
                  picture: {
                    fields: [
                      "url",
                      "alternativeText",
                      "caption",
                      "width",
                      "height",
                    ],
                  },
                  icon: {
                    fields: ["url", "alternativeText", "width", "height"],
                  },
                },
              },
            },
          },
          "sections.services-grid": {
            populate: {
              services: {
                fields: ["name", "caption", "slug", "description", "features"],
                populate: {
                  picture: {
                    fields: [
                      "url",
                      "alternativeText",
                      "caption",
                      "width",
                      "height",
                    ],
                  },
                  icon: {
                    fields: ["url", "alternativeText", "width", "height"],
                  },
                },
              },
            },
          },
          "sections.service-value": {
            populate: {
              items: true,
            },
          },
          "sections.vision-mission": {
            populate: {
              background: {
                fields: [
                  "url",
                  "alternativeText",
                  "caption",
                  "width",
                  "height",
                ],
              },
              visionMission: {
                populate: true,
              },
              coreValues: {
                populate: true,
              },
            },
          },
          "sections.award-certification": {
            populate: {
              certifications: {
                populate: {
                  logo: {
                    fields: [
                      "url",
                      "alternativeText",
                      "caption",
                      "width",
                      "height",
                    ],
                  },
                },
              },
              award: {
                populate: {
                  logo: {
                    fields: [
                      "url",
                      "alternativeText",
                      "caption",
                      "width",
                      "height",
                    ],
                  },
                },
              },
            },
          },
          "sections.associations": {
            populate: {
              items: true,
            },
          },
          "sections.teams": {
            populate: {
              members: {
                populate: {
                  photo: {
                    fields: [
                      "url",
                      "alternativeText",
                      "caption",
                      "width",
                      "height",
                    ],
                  },
                },
              },
            },
          },
          "shared.map-embed": {
            populate: false,
          },
          "sections.faq": {
            populate: {
              items: true,
            },
          },
          "sections.blog-content": {
            populate: {
              highlight: true,
            },
          },
          "sections.career-benefit": {
            populate: {
              background: {
                fields: [
                  "url",
                  "alternativeText",
                  "caption",
                  "width",
                  "height",
                ],
              },
              benefits: true,
            },
          },
          "sections.jargon-slider": {
            populate: {
              items: true,
            },
          },
          "sections.job-slider": {
            populate: {
              jobs: {
                populate: {
                  location: {
                    fields: ["name"],
                  },
                  jobDivision: {
                    fields: ["name", "slug"],
                  },
                },
              },
            },
          },
          "sections.job-explore": {
            populate: false,
          },
          "sections.location-map": {
            populate: {
              locations: {
                fields: ["name", "mapUrl"],
              },
            },
          },
          "sections.location-grid": {
            populate: {
              items: {
                populate: {
                  phoneNumbers: {
                    populate: true,
                  },
                  emails: {
                    populate: true,
                  },
                },
              },
            },
          },
        },
      },
      seo: { 
        fields: ["metaTitle", "metaDescription"],
        populate: { shareImage: true },
      },
    };

    ctx.query = {
      populate,
      filters: ctx.query.filters && ctx.query.filters.slug ? { slug: ctx.query.filters.slug } : undefined,
      locale: ctx.query.locale,
    };

    await next();
  };
};
