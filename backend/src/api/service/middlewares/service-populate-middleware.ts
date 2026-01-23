"use strict";

/**
 * `service-populate-middleware` middleware
 */

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    const populate = {
      picture: {
        fields: ["url", "alternativeText", "caption", "width", "height"],
      },
      icon: {
        fields: ["url", "alternativeText", "width", "height"],
      },
      sections: {
        on: {
          "sections.about-service": {
            populate: true,
          },
          "sections.service-detail": {
            populate: {
              content: {
                populate: {
                  image: {
                    populate: {
                      media: {
                        fields: ["url", "alternativeText", "caption", "width", "height"],
                      },
                      items: true,
                    },
                  },
                  infoList: {
                    populate: {
                      items: true,
                    },
                  },
                  accordion: {
                    populate: {
                      items: true,
                    },
                  },
                  sideBySideBlocks: {
                    populate: {
                      picture: {
                        fields: ["url", "alternativeText", "caption", "width", "height"],
                      },
                    },
                  },
                },
              },
            },
          },
          "sections.service-info": {
            populate: {
              informations: true,
            },
          },
          "sections.transportation-fleet": {
            populate: {
              items: {
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
          "sections.large-image": {
            populate: {
              image: {
                populate: {
                  media: {
                    fields: ["url", "alternativeText", "caption", "width", "height"],
                  },
                  items: true,
                },
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
          "sections.indonesia-map": {
            populate: {
              locations: {
                populate: {
                  location: true,
                  item: {
                    populate: {
                      item: true,
                    },
                  },
                },
              },
            },
          },
        },
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
