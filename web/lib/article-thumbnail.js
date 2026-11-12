import sanitizeHtml from 'sanitize-html';

const defaultThumbnail = '/assets/images/content/01.webp';

export function getArticleThumbnail({ imageUrl, content }) {
  if (imageUrl) return imageUrl;

  let firstImage;
  sanitizeHtml(content || '', {
    allowedTags: ['img'],
    allowedAttributes: { img: ['src'] },
    allowedSchemes: ['http', 'https'],
    allowProtocolRelative: false,
    exclusiveFilter({ attribs }) {
      if (!firstImage && attribs.src) firstImage = attribs.src;
      return true;
    },
  });

  return firstImage || defaultThumbnail;
}
