/**
 * Script to copy Strapi types from backend to frontend
 *
 * This copies the generated type definitions from the Strapi backend
 * to the frontend for type-safe API consumption, and auto-generates
 * runtime types from the schema JSON files.
 *
 * Requires: @strapi/strapi installed as a dev dependency
 * Run: yarn add --dev @strapi/strapi
 *
 * Usage: node scripts/copyTypes.js
 */

const fs = require('fs');
const path = require('path');

const BACKEND_PATH = path.join(__dirname, '../../backend');
const DESTINATION_FOLDER = 'src/types/generated';
const DESTINATION_PATH = path.join(__dirname, '..', DESTINATION_FOLDER);

// Files to copy from backend
const SCHEMA_FILES = [
  {
    src: path.join(BACKEND_PATH, 'types/generated/contentTypes.d.ts'),
    dest: path.join(DESTINATION_PATH, 'contentTypes.d.ts'),
  },
  {
    src: path.join(BACKEND_PATH, 'types/generated/components.d.ts'),
    dest: path.join(DESTINATION_PATH, 'components.d.ts'),
  },
];

// =============================================================================
// SCHEMA PARSING
// =============================================================================

/**
 * Load all component schemas from backend
 */
function loadComponentSchemas() {
  const componentsDir = path.join(BACKEND_PATH, 'src/components');
  const schemas = {};

  const categories = fs.readdirSync(componentsDir).filter(f => 
    fs.statSync(path.join(componentsDir, f)).isDirectory()
  );

  for (const category of categories) {
    const categoryDir = path.join(componentsDir, category);
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
      const name = file.replace('.json', '');
      const uid = `${category}.${name}`;
      const content = JSON.parse(fs.readFileSync(path.join(categoryDir, file), 'utf8'));
      schemas[uid] = {
        uid,
        category,
        name,
        displayName: content.info?.displayName || name,
        attributes: content.attributes || {},
      };
    }
  }

  return schemas;
}

/**
 * Load all content type schemas from backend
 */
function loadContentTypeSchemas() {
  const apiDir = path.join(BACKEND_PATH, 'src/api');
  const schemas = {};

  const apis = fs.readdirSync(apiDir).filter(f => {
    const stat = fs.statSync(path.join(apiDir, f));
    return stat.isDirectory() && f !== '.gitkeep';
  });

  for (const api of apis) {
    const schemaPath = path.join(apiDir, api, 'content-types', api, 'schema.json');
    if (fs.existsSync(schemaPath)) {
      const content = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      const uid = `api::${api}.${api}`;
      schemas[uid] = {
        uid,
        name: api,
        displayName: content.info?.displayName || api,
        kind: content.kind,
        attributes: content.attributes || {},
      };
    }
  }

  return schemas;
}

/**
 * Convert to PascalCase
 */
function toPascalCase(str) {
  return str
    .split(/[-_]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/**
 * Convert component category and name to TypeScript type name
 */
function toTypeName(category, name) {
  const pascalName = toPascalCase(name);
  
  // Special handling for common patterns
  if (category === 'sections') {
    return `${pascalName}Section`;
  }
  if (category === 'shared') {
    return `${pascalName}Block`;
  }
  
  return pascalName;
}

/**
 * Convert Strapi attribute type to TypeScript type
 * Note: We treat most fields as required for runtime types since Strapi APIs
 * return populated data. Only explicitly mark fields as optional if they're
 * truly optional in the schema (like SEO components).
 */
function attributeToTsType(attr, attrName, componentSchemas, contentTypeSchemas) {
  const { type, required, component, components, target, relation, multiple, repeatable } = attr;
  let tsType;
  // Only mark as optional if it's a component/relation that might not be populated
  // or if it has default: false/null behavior
  let isOptional = false;
  
  // SEO and similar optional components should be optional
  const optionalComponents = ['seo', 'notificationBanner'];
  if (optionalComponents.includes(attrName)) {
    isOptional = true;
  }

  switch (type) {
    case 'string':
    case 'text':
    case 'richtext':
    case 'email':
    case 'password':
    case 'uid':
      tsType = 'string';
      break;

    case 'integer':
    case 'biginteger':
    case 'float':
    case 'decimal':
      tsType = 'number';
      break;

    case 'boolean':
      tsType = 'boolean';
      break;

    case 'datetime':
    case 'date':
    case 'time':
    case 'timestamp':
      tsType = 'string';
      break;

    case 'json':
      tsType = 'unknown';
      break;

    case 'enumeration':
      if (attr.enum && Array.isArray(attr.enum)) {
        tsType = attr.enum.map(v => `'${v}'`).join(' | ');
      } else {
        tsType = 'string';
      }
      break;

    case 'media':
      tsType = multiple ? 'StrapiMedia[]' : 'StrapiMedia';
      break;

    case 'component':
      if (component) {
        const compSchema = componentSchemas[component];
        if (compSchema) {
          const typeName = toTypeName(compSchema.category, compSchema.name);
          tsType = repeatable ? `${typeName}[]` : typeName;
        } else {
          tsType = 'unknown';
        }
      } else {
        tsType = 'unknown';
      }
      break;

    case 'dynamiczone':
      if (components && Array.isArray(components)) {
        const types = components.map(c => {
          const compSchema = componentSchemas[c];
          if (compSchema) {
            return toTypeName(compSchema.category, compSchema.name);
          }
          return 'unknown';
        }).filter(t => t !== 'unknown');
        
        tsType = types.length > 0 ? `(${types.join(' | ')})[]` : 'unknown[]';
      } else {
        tsType = 'unknown[]';
      }
      break;

    case 'relation':
      if (target) {
        // Extract content type name from target like "api::article.article" or "api::product-feature.product-feature"
        const match = target.match(/api::([\w-]+)\.([\w-]+)/);
        if (match) {
          const relatedTypeName = toPascalCase(match[1]);
          // Handle relation cardinality
          const isToMany = relation?.includes('ToMany') || relation === 'oneToMany';
          tsType = isToMany ? `${relatedTypeName}[]` : relatedTypeName;
        } else {
          tsType = 'unknown';
        }
      } else {
        tsType = 'unknown';
      }
      break;

    default:
      tsType = 'unknown';
  }

  return { tsType, isOptional };
}

/**
 * Generate TypeScript interface from schema
 */
function generateInterface(schema, componentSchemas, contentTypeSchemas, isContentType = false) {
  const { attributes, category, name } = schema;
  
  let typeName;
  if (isContentType) {
    typeName = toPascalCase(schema.name);
  } else {
    typeName = toTypeName(category, name);
  }

  const lines = [];
  
  // Add __component for component types
  if (!isContentType && category) {
    const componentId = `${category}.${name}`;
    lines.push(`  __component: '${componentId}';`);
  }

  for (const [attrName, attr] of Object.entries(attributes)) {
    // Skip internal fields
    if (['createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'publishedAt', 'localizations', 'locale'].includes(attrName)) {
      continue;
    }

    const { tsType, isOptional } = attributeToTsType(attr, attrName, componentSchemas, contentTypeSchemas);
    const optionalMark = isOptional ? '?' : '';
    lines.push(`  ${attrName}${optionalMark}: ${tsType};`);
  }

  const extendsClause = isContentType ? ' extends StrapiBaseEntity' : ' extends BaseComponent';
  
  return {
    typeName,
    code: `export interface ${typeName}${extendsClause} {\n${lines.join('\n')}\n}`,
  };
}

// =============================================================================
// FILE GENERATION
// =============================================================================

/**
 * Generate runtime.ts content from schemas
 */
function generateRuntimeContent(componentSchemas, contentTypeSchemas) {
  const sections = [];
  const sharedBlocks = [];
  const linkTypes = [];
  const layoutTypes = [];
  const elementTypes = [];
  const metaTypes = [];
  const contentTypes = [];

  // Generate component interfaces
  for (const [uid, schema] of Object.entries(componentSchemas)) {
    const { typeName, code } = generateInterface(schema, componentSchemas, contentTypeSchemas);
    
    if (schema.category === 'sections') {
      sections.push({ typeName, code });
    } else if (schema.category === 'shared') {
      sharedBlocks.push({ typeName, code });
    } else if (schema.category === 'links') {
      linkTypes.push({ typeName, code });
    } else if (schema.category === 'layout') {
      layoutTypes.push({ typeName, code });
    } else if (schema.category === 'elements') {
      elementTypes.push({ typeName, code });
    } else if (schema.category === 'meta') {
      metaTypes.push({ typeName, code });
    }
  }

  // Generate content type interfaces
  for (const [uid, schema] of Object.entries(contentTypeSchemas)) {
    const { typeName, code } = generateInterface(schema, componentSchemas, contentTypeSchemas, true);
    contentTypes.push({ typeName, code });
  }

  // Build the file content
  return `/**
 * Runtime Types for Strapi v5
 *
 * AUTO-GENERATED FILE - DO NOT EDIT
 * This file is auto-generated by scripts/copyTypes.js
 * Run 'npm run types:sync' to update
 *
 * These types represent the actual data shape returned by Strapi v5 APIs.
 * Use these types in components and pages for type-safe data handling.
 */

// =============================================================================
// BASE TYPES
// =============================================================================

/** Base fields present in all Strapi entities */
export interface StrapiBaseEntity {
  id: number;
  documentId: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/** Base fields for component types */
interface BaseComponent {
  id: number;
}

/** Base fields for media files */
export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  caption?: string | null;
  name?: string;
  width?: number;
  height?: number;
}

// =============================================================================
// LINK COMPONENTS
// =============================================================================

${linkTypes.map(t => t.code).join('\n\n')}

// =============================================================================
// META COMPONENTS
// =============================================================================

${metaTypes.map(t => t.code).join('\n\n')}

// =============================================================================
// ELEMENT COMPONENTS
// =============================================================================

${elementTypes.map(t => t.code).join('\n\n')}

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

${layoutTypes.map(t => t.code).join('\n\n')}

// =============================================================================
// CONTENT TYPES
// =============================================================================

${contentTypes.map(t => t.code).join('\n\n')}

// =============================================================================
// PAGE SECTIONS (Dynamic Zone Components)
// =============================================================================

${sections.map(t => t.code).join('\n\n')}

/** Union type for all page sections */
export type PageSection = ${sections.length > 0 ? sections.map(t => t.typeName).join(' | ') : 'never'};

// =============================================================================
// ARTICLE BLOCKS (Dynamic Zone Components)
// =============================================================================

${sharedBlocks.map(t => t.code).join('\n\n')}

/** Union type for all article blocks */
export type ArticleBlock = ${sharedBlocks.length > 0 ? sharedBlocks.map(t => t.typeName).join(' | ') : 'never'};

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiListResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
`;
}

/**
 * Add header comment to copied file content
 */
function transformContent(content, filename) {
  const header = `/**
 * Auto-generated from Strapi backend
 * File: ${filename}
 * 
 * DO NOT EDIT - This file is synced from backend/types/generated/
 * Run 'npm run types:sync' to update
 */

`;
  return header + content;
}

/**
 * Extract exported interface names from a .d.ts file content
 */
function extractExportedInterfaces(content) {
  const regex = /export interface (\w+)/g;
  const interfaces = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    interfaces.push(match[1]);
  }
  return interfaces;
}

/**
 * Convert interface name to a friendly alias
 */
function toFriendlyAlias(name) {
  let alias = name
    .replace(/^Api(\w+)\1$/i, '$1')
    .replace(/^Api/, '')
    .replace(/^Elements/, '')
    .replace(/^Sections/, '')
    .replace(/^Layout/, '')
    .replace(/^Links/, '')
    .replace(/^Meta/, '')
    .replace(/^Shared/, 'Shared')
    .replace(/^Admin\w+$/, '')
    .replace(/^Plugin\w+$/, '');
  
  alias = alias.replace(/^(\w+)\1$/i, '$1');
  
  return alias ? `${alias}Schema` : null;
}

/**
 * Generate index.ts content
 */
function generateIndexContent(contentTypesInterfaces, componentsInterfaces) {
  const apiTypes = contentTypesInterfaces.filter(name => name.startsWith('Api'));
  const componentTypes = componentsInterfaces.filter(name => 
    !name.startsWith('Admin') && 
    !name.startsWith('Plugin') &&
    !name.includes('ComponentSchemas')
  );

  const usedAliases = new Set();
  
  const contentTypeAliases = apiTypes
    .map(name => ({ name, alias: toFriendlyAlias(name) }))
    .filter(item => {
      if (!item.alias || usedAliases.has(item.alias)) return false;
      usedAliases.add(item.alias);
      return true;
    });
  
  const componentAliases = componentTypes
    .map(name => ({ name, alias: toFriendlyAlias(name) }))
    .filter(item => {
      if (!item.alias || usedAliases.has(item.alias)) return false;
      usedAliases.add(item.alias);
      return true;
    });

  const contentTypeImports = contentTypeAliases.map(({ name }) => name);
  const componentImports = componentAliases.map(({ name }) => name);

  return `/**
 * Generated Types Index
 *
 * AUTO-GENERATED FILE - DO NOT EDIT
 * This file is auto-generated by scripts/copyTypes.js
 * Run 'npm run types:sync' to update
 */

// =============================================================================
// RUNTIME TYPES (for use in components and pages)
// =============================================================================
export * from './runtime';

// =============================================================================
// SCHEMA TYPES (re-exported from Strapi backend)
// =============================================================================
export * from './contentTypes';
export * from './components';

// Re-export Strapi types for advanced use cases
export type { Schema, Struct } from '@strapi/strapi';

// Import types for aliases
import type {
${contentTypeImports.map(name => `  ${name},`).join('\n')}
} from './contentTypes';

import type {
${componentImports.map(name => `  ${name},`).join('\n')}
} from './components';

// =============================================================================
// CONTENT TYPE SCHEMA ALIASES
// =============================================================================

${contentTypeAliases.map(({ name, alias }) => `export type ${alias} = ${name};`).join('\n')}

// =============================================================================
// COMPONENT SCHEMA ALIASES
// =============================================================================

${componentAliases.map(({ name, alias }) => `export type ${alias} = ${name};`).join('\n')}
`;
}

/**
 * Copy a file from source to destination
 */
function copyFile({ src, dest }) {
  const destinationDir = path.dirname(dest);
  const filename = path.basename(src);

  if (!fs.existsSync(src)) {
    console.error(`Source file does not exist: ${src}`);
    process.exit(1);
  }

  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  const content = fs.readFileSync(src, 'utf8');
  const transformedContent = transformContent(content, filename);

  fs.writeFileSync(dest, transformedContent);
  console.log(`✓ Copied: ${filename}`);
  
  return content;
}

// =============================================================================
// MAIN
// =============================================================================

console.log('Copying Strapi types from backend to frontend...\n');

// Ensure destination directory exists
if (!fs.existsSync(DESTINATION_PATH)) {
  fs.mkdirSync(DESTINATION_PATH, { recursive: true });
}

// Copy schema files
const contentTypesContent = copyFile(SCHEMA_FILES[0]);
const componentsContent = copyFile(SCHEMA_FILES[1]);

// Extract interfaces for index.ts
const contentTypesInterfaces = extractExportedInterfaces(contentTypesContent);
const componentsInterfaces = extractExportedInterfaces(componentsContent);

console.log(`  Found ${contentTypesInterfaces.length} content types`);
console.log(`  Found ${componentsInterfaces.length} components`);

// Load schemas from JSON files
console.log('\nParsing backend schemas...');
const componentSchemas = loadComponentSchemas();
const contentTypeSchemas = loadContentTypeSchemas();

console.log(`  Parsed ${Object.keys(componentSchemas).length} component schemas`);
console.log(`  Parsed ${Object.keys(contentTypeSchemas).length} content type schemas`);

// Generate index.ts
const indexContent = generateIndexContent(contentTypesInterfaces, componentsInterfaces);
fs.writeFileSync(path.join(DESTINATION_PATH, 'index.ts'), indexContent);
console.log(`\n✓ Generated: index.ts`);

// Generate runtime.ts from schemas
const runtimeContent = generateRuntimeContent(componentSchemas, contentTypeSchemas);
fs.writeFileSync(path.join(DESTINATION_PATH, 'runtime.ts'), runtimeContent);
console.log(`✓ Generated: runtime.ts`);

console.log('\nDone! Types copied to frontend/src/types/generated/');
