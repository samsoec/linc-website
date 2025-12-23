"use strict";

/**
 * `page-populate-middleware` middleware
 */

const populate = {
  contentSections: {
    on: {
      'sections.hero': {
        populate: {
          picture: {
            fields: ["url", "alternativeText", "caption", "width", "height"],
          },
          buttons: {
            populate: true,
          },
        },
      },
      'sections.bottom-actions': {
        populate: {
          buttons: {
            populate: true,
          },
        },
      },
      'sections.feature-columns-group': {
        populate: {
          features: {
            populate: {
              icon: {
                fields: ["url", "alternativeText"],
              },
            },
          },
        },
      },
      'sections.feature-rows-group': {
        populate: {
          features: {
            populate: {
              media: {
                fields: ["url", "alternativeText", "caption", "width", "height"],
              },
            },
          },
        },
      },
      'sections.testimonials-group': {
        populate: {
          testimonials: {
            populate: {
              picture: {
                fields: ["url", "alternativeText", "caption", "width", "height"],
              },
            },
          },
        },
      },
      'sections.large-video': {
        populate: {
          video: {
            fields: ["url", "alternativeText"],
          },
          poster: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      'sections.rich-text': {
        populate: '*',
      },
      'sections.pricing': {
        populate: {
          plans: {
            populate: ["product_features"],
          },
        },
      },
      'sections.lead-form': {
        populate: {
          submitButton: {
            populate: true,
          },
        },
      },
      'sections.features': {
        populate: {
          feature: {
            populate: {
              media: {
                fields: ["url", "alternativeText", "caption", "width", "height"],
              },
            },
          },
        },
      },
      'sections.heading': {
        populate: '*',
      },
    },
  },
  seo: {
    fields: ["metaTitle", "metaDescription"],
    populate: { shareImage: true },
  }
};

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    ctx.query = {
      populate,
      filters: { slug: ctx.query.filters.slug },
      locale: ctx.query.locale,
    };

    console.log("page-populate-middleware.js: ctx.query = ", ctx.query);

    await next();
  };
};
