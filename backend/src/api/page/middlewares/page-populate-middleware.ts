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
                populate: true,
              },
              highlights: {
                populate: true,
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
            },
          },
          "sections.banner": {
            populate: {
              buttons: {
                populate: true,
              },
              videoButton: {
                populate: true,
              },
              background: {
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
          "sections.about-company": {
            populate: {
              moreButton: {
                populate: true,
              },
              awards: {
                populate: true,
              },
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
              items: {
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
              background: {
                fields: [
                  "url",
                  "alternativeText",
                  "caption",
                  "width",
                  "height",
                ],
              },
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
        },
      },
      seo: {
        fields: ["metaTitle", "metaDescription"],
        populate: { shareImage: true },
      },
    };

    ctx.query = {
      populate,
      filters: { slug: ctx.query.filters.slug },
      locale: ctx.query.locale,
    };

    await next();
  };
};
