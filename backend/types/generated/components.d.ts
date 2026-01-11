import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsAssociation extends Struct.ComponentSchema {
  collectionName: 'components_elements_associations';
  info: {
    displayName: 'Association';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsAward extends Struct.ComponentSchema {
  collectionName: 'components_elements_awards';
  info: {
    displayName: 'Award';
  };
  attributes: {
    caption: Schema.Attribute.String;
    logo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    sponsor: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsCertification extends Struct.ComponentSchema {
  collectionName: 'components_elements_certifications';
  info: {
    displayName: 'Certification';
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    logo: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsCoreValues extends Struct.ComponentSchema {
  collectionName: 'components_elements_core_values';
  info: {
    displayName: 'Core Values';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    subheading: Schema.Attribute.String;
    values: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface ElementsCorporateBenefit extends Struct.ComponentSchema {
  collectionName: 'components_elements_corporate_benefits';
  info: {
    displayName: 'Corporate Benefit';
  };
  attributes: {
    description: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsCorporateJargon extends Struct.ComponentSchema {
  collectionName: 'components_elements_corporate_jargons';
  info: {
    displayName: 'Corporate Jargon';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    index: Schema.Attribute.Integer & Schema.Attribute.Required;
    jargon: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsEmail extends Struct.ComponentSchema {
  collectionName: 'components_elements_emails';
  info: {
    displayName: 'Email';
  };
  attributes: {
    email: Schema.Attribute.Email & Schema.Attribute.Required;
  };
}

export interface ElementsFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_faq_items';
  info: {
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsFooterSection extends Struct.ComponentSchema {
  collectionName: 'components_links_footer_sections';
  info: {
    displayName: 'Footer section';
    icon: 'chevron-circle-down';
    name: 'FooterSection';
  };
  attributes: {
    links: Schema.Attribute.Component<'links.link', true>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsHeroHighlight extends Struct.ComponentSchema {
  collectionName: 'components_elements_hero_highlights';
  info: {
    displayName: 'Hero Highlight';
  };
  attributes: {
    caption: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsHighlightedArticle extends Struct.ComponentSchema {
  collectionName: 'components_elements_highlighted_articles';
  info: {
    displayName: 'Highlighted Article';
  };
  attributes: {
    maxCount: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<5>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsIndustrySector extends Struct.ComponentSchema {
  collectionName: 'components_elements_industry_sectors';
  info: {
    displayName: 'Industry Sector';
  };
  attributes: {
    caption: Schema.Attribute.String & Schema.Attribute.Required;
    media: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface ElementsInfoImage extends Struct.ComponentSchema {
  collectionName: 'components_elements_info_images';
  info: {
    displayName: 'Info Image';
  };
  attributes: {
    caption: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'elements.info-image-item', true>;
    media: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface ElementsInfoImageItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_info_image_items';
  info: {
    displayName: 'Info Image Item';
  };
  attributes: {
    caption: Schema.Attribute.String;
    title: Schema.Attribute.String;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsLocation extends Struct.ComponentSchema {
  collectionName: 'components_elements_locations';
  info: {
    displayName: 'Location';
  };
  attributes: {
    address: Schema.Attribute.Text & Schema.Attribute.Required;
    emails: Schema.Attribute.Component<'elements.email', true>;
    phoneNumbers: Schema.Attribute.Component<'elements.phone-number', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsLogos extends Struct.ComponentSchema {
  collectionName: 'components_elements_logos';
  info: {
    displayName: 'Logos';
    icon: 'apple-alt';
    name: 'logos';
  };
  attributes: {
    logo: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsNotificationBanner extends Struct.ComponentSchema {
  collectionName: 'components_elements_notification_banners';
  info: {
    description: '';
    displayName: 'Notification banner';
    icon: 'exclamation';
    name: 'NotificationBanner';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    link: Schema.Attribute.Component<'links.link', false>;
    show: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['alert', 'info', 'warning']> &
      Schema.Attribute.Required;
  };
}

export interface ElementsPhoneNumber extends Struct.ComponentSchema {
  collectionName: 'components_elements_phone_numbers';
  info: {
    displayName: 'Phone Number';
  };
  attributes: {
    phoneNumber: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsPlan extends Struct.ComponentSchema {
  collectionName: 'components_elements_plans';
  info: {
    description: '';
    displayName: 'Pricing plan';
    icon: 'search-dollar';
    name: 'plan';
  };
  attributes: {
    description: Schema.Attribute.Text;
    isRecommended: Schema.Attribute.Boolean;
    name: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    pricePeriod: Schema.Attribute.String;
  };
}

export interface ElementsSearchBar extends Struct.ComponentSchema {
  collectionName: 'components_elements_search_bars';
  info: {
    displayName: 'Search Bar';
  };
  attributes: {
    isDivisionSearchEnabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    isLocationSearchEnabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    navigateTo: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsServiceValue extends Struct.ComponentSchema {
  collectionName: 'components_elements_service_values';
  info: {
    displayName: 'Service Value';
  };
  attributes: {
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsSimpleCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_simple_cards';
  info: {
    displayName: 'Simple Card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ElementsTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_elements_team_members';
  info: {
    displayName: 'Team Member';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    photo: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsVisionMission extends Struct.ComponentSchema {
  collectionName: 'components_elements_vision_missions';
  info: {
    displayName: 'Vision Mission';
  };
  attributes: {
    missionDescription: Schema.Attribute.Text;
    missionHeading: Schema.Attribute.String & Schema.Attribute.Required;
    subheading: Schema.Attribute.String;
    visionDescription: Schema.Attribute.Text;
    visionHeading: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    description: '';
    displayName: 'Footer';
  };
  attributes: {
    about: Schema.Attribute.Text;
    copyright: Schema.Attribute.String;
    footerLinks: Schema.Attribute.Component<'elements.footer-section', true>;
    footerLogo: Schema.Attribute.Component<'layout.logo', false>;
    holdingLogo: Schema.Attribute.Component<'layout.logo', false>;
    socialLinks: Schema.Attribute.Component<'links.social-link', true>;
    socialLinkText: Schema.Attribute.String;
  };
}

export interface LayoutLogo extends Struct.ComponentSchema {
  collectionName: 'components_layout_logos';
  info: {
    description: '';
    displayName: 'Logo';
  };
  attributes: {
    logoImg: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'> &
      Schema.Attribute.Required;
    logoText: Schema.Attribute.String;
  };
}

export interface LayoutNavbar extends Struct.ComponentSchema {
  collectionName: 'components_layout_navbars';
  info: {
    description: '';
    displayName: 'Navbar';
    icon: 'map-signs';
    name: 'Navbar';
  };
  attributes: {
    button: Schema.Attribute.Component<'links.button-link', false>;
    enableI18n: Schema.Attribute.Boolean;
    enableSearch: Schema.Attribute.Boolean;
    links: Schema.Attribute.Component<'links.link', true>;
    navbarLogo: Schema.Attribute.Component<'layout.logo', false>;
  };
}

export interface LinksButton extends Struct.ComponentSchema {
  collectionName: 'components_links_simple_buttons';
  info: {
    description: '';
    displayName: 'Button';
    icon: 'fingerprint';
    name: 'Button';
  };
  attributes: {
    text: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['primary', 'secondary', 'tertiary']>;
  };
}

export interface LinksButtonLink extends Struct.ComponentSchema {
  collectionName: 'components_links_buttons';
  info: {
    description: '';
    displayName: 'Button link';
    icon: 'fingerprint';
    name: 'Button-link';
  };
  attributes: {
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['primary', 'secondary', 'tertiary']>;
    url: Schema.Attribute.String;
  };
}

export interface LinksButtonVideo extends Struct.ComponentSchema {
  collectionName: 'components_links_button_videos';
  info: {
    displayName: 'Button Video';
  };
  attributes: {
    button: Schema.Attribute.Component<'links.button', false>;
    embedUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LinksChildLink extends Struct.ComponentSchema {
  collectionName: 'components_links_child_links';
  info: {
    displayName: 'Child Link (Flat)';
  };
  attributes: {
    newTab: Schema.Attribute.Boolean;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LinksLink extends Struct.ComponentSchema {
  collectionName: 'components_links_links';
  info: {
    description: '';
    displayName: 'Link (Nested)';
    icon: 'link';
    name: 'Link';
  };
  attributes: {
    children: Schema.Attribute.Component<'links.child-link', true>;
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LinksSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_links_social_links';
  info: {
    description: '';
    displayName: 'Social Link';
  };
  attributes: {
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    social: Schema.Attribute.Enumeration<
      [
        'YOUTUBE',
        'TWITTER',
        'DISCORD',
        'WEBSITE',
        'INSTAGRAM',
        'FACEBOOK',
        'TIKTOK',
      ]
    >;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MetaMetadata extends Struct.ComponentSchema {
  collectionName: 'components_meta_metadata';
  info: {
    description: '';
    displayName: 'Metadata';
    icon: 'robot';
    name: 'Metadata';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsAboutCompany extends Struct.ComponentSchema {
  collectionName: 'components_sections_about_companies';
  info: {
    displayName: 'About Company';
  };
  attributes: {
    cards: Schema.Attribute.Component<'elements.simple-card', true>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    highlights: Schema.Attribute.Component<'elements.hero-highlight', true>;
    image: Schema.Attribute.Component<'elements.info-image', false>;
    moreButton: Schema.Attribute.Component<'links.button-link', false>;
    subheading: Schema.Attribute.String;
    videoEmbed: Schema.Attribute.Component<'shared.video-embed', false>;
  };
}

export interface SectionsAssociations extends Struct.ComponentSchema {
  collectionName: 'components_sections_associations';
  info: {
    displayName: 'Associations';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.association', true>;
    subheading: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsAwardCertification extends Struct.ComponentSchema {
  collectionName: 'components_sections_award_certifications';
  info: {
    displayName: 'Award Certification';
  };
  attributes: {
    award: Schema.Attribute.Component<'elements.award', false>;
    certifications: Schema.Attribute.Component<'elements.certification', true>;
    description: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_banners';
  info: {
    displayName: 'Banner';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'links.button-link', true>;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    videoButton: Schema.Attribute.Component<'links.button-video', false>;
  };
}

export interface SectionsBlogContent extends Struct.ComponentSchema {
  collectionName: 'components_sections_blog_contents';
  info: {
    displayName: 'Blog Content';
  };
  attributes: {
    highlight: Schema.Attribute.Component<
      'elements.highlighted-article',
      false
    >;
  };
}

export interface SectionsCareerBenefit extends Struct.ComponentSchema {
  collectionName: 'components_sections_career_benefits';
  info: {
    displayName: 'Career Benefit';
  };
  attributes: {
    background: Schema.Attribute.Media<'images'>;
    benefits: Schema.Attribute.Component<'elements.corporate-benefit', true>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsClientMarquee extends Struct.ComponentSchema {
  collectionName: 'components_sections_client_marquees';
  info: {
    displayName: 'Client Marquee';
  };
  attributes: {
    clients: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
  };
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_faqs';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'elements.faq-item', true>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_slices_heroes';
  info: {
    description: '';
    displayName: 'Hero';
    icon: 'heading';
    name: 'Hero';
  };
  attributes: {
    award: Schema.Attribute.Component<'elements.award', false>;
    buttons: Schema.Attribute.Component<'links.button-link', true>;
    description: Schema.Attribute.String & Schema.Attribute.Required;
    mobilePicture: Schema.Attribute.Media<'images'>;
    picture: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    videoButton: Schema.Attribute.Component<'links.button-video', false>;
  };
}

export interface SectionsHeroSimple extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_simples';
  info: {
    displayName: 'Hero Simple';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    isPictureBlank: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    mobilePicture: Schema.Attribute.Media<'images'>;
    picture: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    searchBar: Schema.Attribute.Component<'elements.search-bar', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsIndustrySectors extends Struct.ComponentSchema {
  collectionName: 'components_sections_industry_sectors';
  info: {
    displayName: 'Industry Sectors';
  };
  attributes: {
    description: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    sectors: Schema.Attribute.Component<'elements.industry-sector', true>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsJargonSlider extends Struct.ComponentSchema {
  collectionName: 'components_sections_jargon_sliders';
  info: {
    displayName: 'Jargon Slider';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.corporate-jargon', true>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsJobExplore extends Struct.ComponentSchema {
  collectionName: 'components_sections_job_explores';
  info: {
    displayName: 'Job Explore';
  };
  attributes: {
    itemPerPage: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<10>;
  };
}

export interface SectionsJobSlider extends Struct.ComponentSchema {
  collectionName: 'components_sections_job_sliders';
  info: {
    displayName: 'Job Slider';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    jobs: Schema.Attribute.Relation<'oneToMany', 'api::job.job'>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsLargeImage extends Struct.ComponentSchema {
  collectionName: 'components_sections_large_images';
  info: {
    displayName: 'Large Image';
  };
  attributes: {
    desktopImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    mobileImage: Schema.Attribute.Media<'images'>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsLargeVideo extends Struct.ComponentSchema {
  collectionName: 'components_slices_large_videos';
  info: {
    displayName: 'Large video';
    icon: 'play-circle';
    name: 'LargeVideo';
  };
  attributes: {
    description: Schema.Attribute.String;
    embedUrl: Schema.Attribute.String;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    poster: Schema.Attribute.Media<'images'>;
    subheading: Schema.Attribute.String;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface SectionsLeadForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_lead_forms';
  info: {
    description: '';
    displayName: 'Lead form';
    icon: 'at';
    name: 'Lead form';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    locations: Schema.Attribute.Component<'elements.location', true>;
    subheading: Schema.Attribute.String;
    submitButton: Schema.Attribute.Component<'links.button', false>;
  };
}

export interface SectionsLocationGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_location_grids';
  info: {
    displayName: 'Location Grid';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'elements.location', true>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsLocationMap extends Struct.ComponentSchema {
  collectionName: 'components_sections_location_map';
  info: {
    displayName: 'Location Map';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    locations: Schema.Attribute.Relation<'oneToMany', 'api::location.location'>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsNewsRoom extends Struct.ComponentSchema {
  collectionName: 'components_sections_news_rooms';
  info: {
    displayName: 'News Room';
  };
  attributes: {
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsServiceValue extends Struct.ComponentSchema {
  collectionName: 'components_sections_service_values';
  info: {
    displayName: 'Service Value';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.Component<'elements.service-value', true>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsServices extends Struct.ComponentSchema {
  collectionName: 'components_sections_services';
  info: {
    displayName: 'Services';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    services: Schema.Attribute.Relation<'oneToMany', 'api::service.service'>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsServicesGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_services_grids';
  info: {
    displayName: 'Services Grid';
  };
  attributes: {
    description: Schema.Attribute.Text;
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    services: Schema.Attribute.Relation<'oneToMany', 'api::service.service'>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsTeams extends Struct.ComponentSchema {
  collectionName: 'components_sections_teams';
  info: {
    displayName: 'Teams';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    members: Schema.Attribute.Component<'elements.team-member', true>;
    subheading: Schema.Attribute.String;
  };
}

export interface SectionsVisionMission extends Struct.ComponentSchema {
  collectionName: 'components_sections_vision_missions';
  info: {
    displayName: 'Vision Mission';
  };
  attributes: {
    background: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    coreValues: Schema.Attribute.Component<'elements.core-values', false>;
    visionMission: Schema.Attribute.Component<
      'elements.vision-mission',
      false
    > &
      Schema.Attribute.Required;
  };
}

export interface SharedMapEmbed extends Struct.ComponentSchema {
  collectionName: 'components_shared_map_embeds';
  info: {
    displayName: 'Map Embed';
  };
  attributes: {
    mapUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    description: '';
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    description: '';
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    author: Schema.Attribute.String;
    body: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedVideoEmbed extends Struct.ComponentSchema {
  collectionName: 'components_sections_video_embeds';
  info: {
    description: '';
    displayName: 'Video Embed';
  };
  attributes: {
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.association': ElementsAssociation;
      'elements.award': ElementsAward;
      'elements.certification': ElementsCertification;
      'elements.core-values': ElementsCoreValues;
      'elements.corporate-benefit': ElementsCorporateBenefit;
      'elements.corporate-jargon': ElementsCorporateJargon;
      'elements.email': ElementsEmail;
      'elements.faq-item': ElementsFaqItem;
      'elements.footer-section': ElementsFooterSection;
      'elements.hero-highlight': ElementsHeroHighlight;
      'elements.highlighted-article': ElementsHighlightedArticle;
      'elements.industry-sector': ElementsIndustrySector;
      'elements.info-image': ElementsInfoImage;
      'elements.info-image-item': ElementsInfoImageItem;
      'elements.location': ElementsLocation;
      'elements.logos': ElementsLogos;
      'elements.notification-banner': ElementsNotificationBanner;
      'elements.phone-number': ElementsPhoneNumber;
      'elements.plan': ElementsPlan;
      'elements.search-bar': ElementsSearchBar;
      'elements.service-value': ElementsServiceValue;
      'elements.simple-card': ElementsSimpleCard;
      'elements.team-member': ElementsTeamMember;
      'elements.vision-mission': ElementsVisionMission;
      'layout.footer': LayoutFooter;
      'layout.logo': LayoutLogo;
      'layout.navbar': LayoutNavbar;
      'links.button': LinksButton;
      'links.button-link': LinksButtonLink;
      'links.button-video': LinksButtonVideo;
      'links.child-link': LinksChildLink;
      'links.link': LinksLink;
      'links.social-link': LinksSocialLink;
      'meta.metadata': MetaMetadata;
      'sections.about-company': SectionsAboutCompany;
      'sections.associations': SectionsAssociations;
      'sections.award-certification': SectionsAwardCertification;
      'sections.banner': SectionsBanner;
      'sections.blog-content': SectionsBlogContent;
      'sections.career-benefit': SectionsCareerBenefit;
      'sections.client-marquee': SectionsClientMarquee;
      'sections.faq': SectionsFaq;
      'sections.hero': SectionsHero;
      'sections.hero-simple': SectionsHeroSimple;
      'sections.industry-sectors': SectionsIndustrySectors;
      'sections.jargon-slider': SectionsJargonSlider;
      'sections.job-explore': SectionsJobExplore;
      'sections.job-slider': SectionsJobSlider;
      'sections.large-image': SectionsLargeImage;
      'sections.large-video': SectionsLargeVideo;
      'sections.lead-form': SectionsLeadForm;
      'sections.location-grid': SectionsLocationGrid;
      'sections.location-map': SectionsLocationMap;
      'sections.news-room': SectionsNewsRoom;
      'sections.service-value': SectionsServiceValue;
      'sections.services': SectionsServices;
      'sections.services-grid': SectionsServicesGrid;
      'sections.teams': SectionsTeams;
      'sections.vision-mission': SectionsVisionMission;
      'shared.map-embed': SharedMapEmbed;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.video-embed': SharedVideoEmbed;
    }
  }
}
